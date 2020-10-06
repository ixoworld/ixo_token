pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";  

contract IXO_Token is IERC20, ERC20Pausable, Ownable {
    using SafeERC20 for IERC20;

    constructor(string memory _name, string memory _symbol)
        public
        ERC20(_name, _symbol)
        ERC20Pausable()
        Ownable()
    {}

    /**
        ------------------------------------------------------------------------
        Pausable functionality

        This functionality has been taken from the OpenZeppelin library v2.5.0:
        @openzeppelin/contracts/token/ERC20/ERC20Burnable (v2.5.0)

        This functionality has been added from OZ v.2.5.0 in order to allow 
        the owner of the contract to be able to pause the contract. The role
        has been switched from the Pauser role to the Owner role in order to
        reduce complexity in role management. 

        For more information on this change please see the README
        ------------------------------------------------------------------------
    */

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() public onlyOwner() whenNotPaused {
        _pause();
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyOwner() whenPaused {
        _unpause();
    }

    /**
        ------------------------------------------------------------------------
        Burnable functionality

        This has been taken out of the:
        @openzeppelin/contracts/token/ERC20/ERC20Burnable (v3.2.0)

        This functionality has been removed from the Burnable contract and added
        directly here in order to prevent an inheritance clash. 

        For more information on this inheritance clash please see the README
        ------------------------------------------------------------------------
    */

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's
     * allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `amount`.
     */
    function burnFrom(address account, uint256 amount) public virtual {
        uint256 decreasedAllowance = allowance(account, _msgSender()).sub(
            amount,
            "ERC20: burn amount exceeds allowance"
        );

        _approve(account, _msgSender(), decreasedAllowance);
        _burn(account, amount);
    }

    /**
        ------------------------------------------------------------------------
        Mintable functionality

        This functionality has been taken from the OpenZeppelin library v2.5.0:
        @openzeppelin/contracts/token/ERC20/ERC20Mintable (v2.5.0)
        
        This was done to provide an audited mint functionality (as there is no
        equivalent in OZ v3.x). The access control has been updated from the
        Mintable Role to the Ownable role order to reduce complexity in role 
        management. 

        For more information on this change please see the README
        ------------------------------------------------------------------------
    */

    /**
     * @dev See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the {Ownable} role.
     */
    function mint(address account, uint256 amount)
        public
        onlyOwner()
        returns (bool)
    {
        _mint(account, amount);
        return true;
    }
}
