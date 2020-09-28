const etherlime = require('etherlime-lib');
const IXOTokenJson = require('../build/IXO_Token.json');

describe('🛠  IXO Token Tests', () => {
    let owner = accounts[0];
    let user = accounts[1];
    let anotherUser = accounts[2];

    let deployer;

    let IXOTokenInstance;

    let tokenName = "IXO";
    let tokenSymbol = "IXO";
    let tokenDecimal = 18;

    beforeEach(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(owner.secretKey);
        
        IXOTokenInstance = await deployer.deploy(
            IXOTokenJson,
            false,
            tokenName,
            tokenSymbol
        );
    });

    /**
     * This is in no way a comprehensive test of the ERC20 functionality, but
     * rather a test to ensure that the ERC20 functions have been correctly
     * inherited and are correctly access controlled.
     */
    describe('🛠  ERC20 Tests', () => {
        it('Has correct set up', async () => {
            let name = await IXOTokenInstance.name();
            let symbol = await IXOTokenInstance.symbol();
            let decimals = await IXOTokenInstance.decimals();

            assert.equal(
                name,
                tokenName,
                "Token name set up incorrectly"
            );
            assert.equal(
                symbol,
                tokenSymbol,
                "Token symbol set up incorrectly"
            );
            assert.equal(
                decimals,
                tokenDecimal,
                "Token decimals set up incorrectly"
            );
        });

        it('Can call functions', async () => {
            let totalSupply = await IXOTokenInstance.totalSupply();

            await IXOTokenInstance.from(owner).mint(
                user.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            let totalSupplyAfter = await IXOTokenInstance.totalSupply();

            assert.equal(
                totalSupply.toString(),
                0,
                "Total supply incorrect"
            );
            assert.equal(
                totalSupplyAfter.toString(),
                ethers.utils.parseUnits("100", 18).toString(),
                "Total supply has not be influenced by mint"
            );
        });
    });

    /**
     * This is in no way a comprehensive test of the pausable functionality, but
     * rather a test to ensure that the pausable functions have been correctly
     * inherited and are correctly access controlled.
     */
    describe('⏸  ERC20Pausable Tests', () => {
        it('Can pause', async () => {
            let pauseState = await IXOTokenInstance.paused();

            await IXOTokenInstance.from(owner).pause();

            let pauseStateAfterPause = await IXOTokenInstance.paused();

            await IXOTokenInstance.from(owner).unpause();

            let pauseStateAfterUnpause = await IXOTokenInstance.paused();

            assert.equal(
                pauseState,
                false,
                "Contract starts paused"
            );
            assert.equal(
                pauseStateAfterPause,
                true,
                "Contract is not paused after pausing"
            );
            assert.equal(
                pauseStateAfterUnpause,
                false,
                "Contract is not unpaused after unpausing"
            );
        });

        it('Non owner cannot pause', async () => {
            await assert.revertWith(
                IXOTokenInstance.from(user).pause(),
                "Ownable: caller is not the owner"
            );
        });

        it('When paused, functionality blocked', async () => {
            await IXOTokenInstance.from(owner).pause();

            await assert.revertWith(
                IXOTokenInstance.from(user).transfer(
                    anotherUser.signer.address,
                    0
                ),
                "ERC20Pausable: token transfer while paused"
            );

            await IXOTokenInstance.from(owner).unpause();
        });
    });

    /**
     * This is in no way a comprehensive test of the mintable functionality, but
     * rather a test to ensure that the mintable functions have been correctly
     * inherited and are correctly access controlled.
     */
    describe('🍃 ERC20Mintable Tests', () => {
        it('Can mint', async () => {
            let userBalance = await IXOTokenInstance.balanceOf(user.signer.address);

            await IXOTokenInstance.from(owner).mint(
                user.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            let userBalanceAfterMint = await IXOTokenInstance.balanceOf(user.signer.address);

            assert.equal(
                userBalance.toString(),
                0,
                "User started with incorrect balance"
            );
            assert.equal(
                userBalanceAfterMint.toString(),
                ethers.utils.parseUnits("100", 18).toString(),
                "User balance has not been correctly influenced by mint"
            );
        });

        it('Non owner cannot mint', async () => {
            await assert.revertWith(
                IXOTokenInstance.from(user).mint(
                    user.signer.address,
                    ethers.utils.parseUnits("100", 18)
                ),
                "Ownable: caller is not the owner"
            );
        });
    });

    /**
     * This is in no way a comprehensive test of the burnable functionality, but
     * rather a test to ensure that the burnable functions have been correctly
     * inherited and are functioning correctly.
     */
    describe('🔥 ERC20Burnable Tests', () => {
        it('User can burn tokens', async () => {
            await IXOTokenInstance.from(owner).mint(
                user.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            let userBalanceAfterMint = await IXOTokenInstance.balanceOf(user.signer.address);

            await IXOTokenInstance.from(user).burn(
                ethers.utils.parseUnits("100", 18)
            );

            let userBalanceAfterBurn = await IXOTokenInstance.balanceOf(user.signer.address);
            
            assert.equal(
                userBalanceAfterMint.toString(),
                ethers.utils.parseUnits("100", 18).toString(),
                "User balance has not been correctly influenced by mint"
            );
            assert.equal(
                userBalanceAfterBurn.toString(),
                0,
                "User balance has not been correctly influenced by burn"
            );
        });

        it('AnotherUser can burn tokens from user after approve', async () => {
            await IXOTokenInstance.from(owner).mint(
                user.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            let userBalanceAfterMint = await IXOTokenInstance.balanceOf(user.signer.address);
            let anotherUserAllowance = await IXOTokenInstance.allowance(
                user.signer.address,
                anotherUser.signer.address
            );

            await IXOTokenInstance.from(user).approve(
                anotherUser.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            let anotherUserAllowanceAfter = await IXOTokenInstance.allowance(
                user.signer.address,
                anotherUser.signer.address
            );
            
            await IXOTokenInstance.from(anotherUser).burnFrom(
                user.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            let userBalanceAfterBurn = await IXOTokenInstance.balanceOf(user.signer.address);
            
            assert.equal(
                anotherUserAllowance.toString(),
                0,
                "User allowance is incorrect (non 0)"
            );
            assert.equal(
                userBalanceAfterMint.toString(),
                ethers.utils.parseUnits("100", 18).toString(),
                "User balance has not been influenced by mint"
            );
            assert.equal(
                anotherUserAllowanceAfter.toString(),
                ethers.utils.parseUnits("100", 18).toString(),
                "User allowance has not been influenced by approval"
            );
            assert.equal(
                userBalanceAfterBurn.toString(),
                0,
                "User balance has not been influenced by burnFrom"
            );
        });

        it('AnotherUser cannot burn tokens from user without approve', async () => {
            await IXOTokenInstance.from(owner).mint(
                user.signer.address,
                ethers.utils.parseUnits("100", 18)
            );

            await assert.revertWith(
                IXOTokenInstance.from(anotherUser).burnFrom(
                    user.signer.address,
                    ethers.utils.parseUnits("100", 18)
                ),
                "ERC20: burn amount exceeds allowance"
            );
        });
    });

    /**
     * Cannot easily directly test SafeERC20.
     */
    describe('🔐 SafeERC20 Tests', () => {
        it('SafeERC20 is untestable', async () => {
            assert.equal(true, true);
        });
    });
});