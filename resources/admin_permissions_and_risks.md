<div align="center">
    <img src="./logo.png"/>
    <h1>Admin: Permissions & Risks</h1>
    <h5>
        This document outlines the special permissions the owner of the token has, as well as risks associated with the elevated permissions.
    </h5>
    <h6>
        This document will also outline how these risks are being mitigated as much as possible.
    </h6>
</div>

---
### Index 

| Heading | Topic | 
|:--------|:------|
| [Ownable](#ownable) | [Owner Permissions](#owner-permissions)
| | [Risks of Ownership](#risks-of-ownership) 
| [Mintable](#mintable) | [Mintable Permissions](#mintable-permissions) 
|  | [Risks of Mintability](#risks-of-mintability) |
| [Pausable](#pausable) | [Pausable Permissions](#pausable-permissions) 
|  | [Risks of Pausability](#risks-of-pausability) |

#### Additional Documentation

##### [< Back to `README`](../README.md)
##### [> Gnosis Safe Guide](./gnosis_safe_guide.md)
##### [> Wallet Best Practices]()

---

# Ownable
The token is Ownable. This uses the [OpenZeppelin Ownable smart contract](https://docs.openzeppelin.com/contracts/3.x/api/access#Ownable). The owner is able to own the token contract. Through ownership, the owner can call functions that require elevated permissions. These elevated permissions will be explored in each of the specific instances. In this section, we will specifically discuss the `ownable` permissions and risks. 

## Owner Permissions 
1. The owner is able to call role protected functions `onlyOwner()`.
2. The owner is able to renounce their ownership `renounceOwnership()`.
3. The owner is able to transfer their ownership role to another address `transferOwnership(address newOwner)`.

## Risks of Ownership
It should be noted that the Owner address will be that of a [Gnosis Safe multiple signature smart contract wallet](https://docs.gnosis.io/safe/docs/contracts_intro/). This significantly decreases the risk of a "rouge" owner, and the risk of the owner wallet becoming compromised. For more information about the milti-sig set up please see the [> Gnosis Safe Guide](./gnosis_safe_guide.md)

1. Risks associated with raised permissions will be explored in the specific instances in the mintable and pausable sections. 
2. Should the owner choose to renounce their ownership the token will not have an owner, and a new one can never be added. The side affects of the token becoming un-owned will be explored in the specific instances in the mintable and pausable sections. 
3. Should the owner transfer ownership away from the multi-sig the new owner would be able to execute the raised permission protected functions. The affects of this will be explored in the specific instances in the mintable and pausable sections.  

# Mintable
The token is Mintable. This uses the [OpenZeppelin Mintable function from v2.x of their smart contract library](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20Mintable). This function is protected by the `onlyOwner()` modifier. 

## Mintable Permissions 
1. The owner is able to mint an unlimited number of tokens to any address. 

## Risks of Mintability
1. Should the owner account become compromised, or if a malicious actor is able to access the owner restricted functionality (through the transferring of ownership, or through gaining access to the multi-sig wallet through nefarious means) they would be able to mint an un-restricted number of tokens. This may cause the price of the token to crash, the supply to explode. Should this token be represented in an AMM of any kind (bonding curve, free market etc) the attacker would be able to sell all the freely minted tokens. 

# Pausable
The token is pausable. This uses the [OpenZeppelin pausable ERC20 extension](https://docs.openzeppelin.com/contracts/3.x/api/token/erc20#ERC20Pausable). The pausable functions are protected by the `onlyOwner()` modifier.  

## Pausable Permissions 
1. The owner is able to pause major functionality on the token, such as: transferring tokens, minting and burning tokens.
2. The owner is able to un-pause these major functions.

## Risks of Pausability
1. Should a malicious actor get owner permissions (outlined in the risks of mintability) they would be able to disable the tokens major functionality. This in combination with the mintability functionality may result in users being unable to sell their tokens (even in the open market) while an attacker (through a highly structured transaction) would be able to mint themselves an unlimited amount of tokens and then sell them all on exchanges or AMMs while all the genuine token holders are unable to access their tokens. 
2. A malicious owner after the attack described above could un-pause the token after their attack, leaving the token under collateralized (if they did not take all collateral). This would cause a collapse in the token price and the token would be rendered valueless. 
