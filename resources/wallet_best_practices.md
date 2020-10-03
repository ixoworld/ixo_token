<div align="center">
    <img src="./logo.png"/>
    <h1>EOA Wallet Best Practices</h1>
    <h5>
        This document outlines the industry standard best practices in maintaining a secure EOA (Ethereum) wallet.
    </h5>
    <h6>
        This document is based off of the Gnosis Safe documentation, OZ wallet best practices, as well as general best practices in storing mnemonics. 
    </h6>
</div>

---
### Index 

| Heading | Topic | 
|:--------|:------|
| [Glossary](#glossary) | | 
| [Creating a secure wallet](#creating-a-secure-wallet) | [Generating a Mnemonic](#generating-a-mnemonic)
| [Secure Storage](#secure-storage) | [Mnemonic Storage](#mnemonic-storage)
| |[Hard Wallets](#hard-wallets) | 
| [Additional Resources and Sources](#additional-resources-and-sources) |

#### Additional Documentation

##### [< Back to `README`](../README.md)
##### [> Admins: Permissions & Risks](./resources/admin_permissions_and_risks.md)
##### [> Wallet Best Practices](./wallet_best_practices.md)

---

# Glossary

| Term | Definition |
|:-----:|:-----------|
| **EOA** | "Ethereum accounts that use traditional key pairs" - [Gnosis Safe docs](https://docs.gnosis.io/safe/docs/intro_accounts/#eoas). EOA wallets consist of a unique public address and a cryptographically linked private key. The private key can be used to sign transactions and messages. If your private key is leaked (anyone else gains access to it) there is no way to reverse any malicious transactions that may happen. |
| **Mnemonic** | "A mnemonic phrase or mnemonic seed is a set of typically either 12 or 24 words, which can be used to derive an infinite number of wallets" - [MyCrypto blog](https://support.mycrypto.com/general-knowledge/cryptography/how-do-mnemonic-phrases-work#:~:text=A%20mnemonic%20phrase%20or%20mnemonic,an%20infinite%20number%20of%20wallets.&text=In%20the%20Ethereum%20ecosystem%2C%20mnemonic,following%20the%20BIP%2032%20spec.). If a mnemonic gets compromised an attacker can not only gain access to your wallet, but every wallet that could ever be created from that mnemonic. The storage of a mnemonic should be treated with the highest level of security. |
| **Paper Wallet** | A paper wallet is an EOA wallet that has been generated without being connected to the internet. Paper wallets allow you to send funds to this highly secure account. Paper wallets cannot sign transactions unless  |
| **Hardware Wallet** | "Hardware wallets are dedicated devices that keep private keys safe" - [Consensys digital asset storage](https://media.consensys.net/how-to-store-digital-assets-on-ethereum-a2bfdcf66bd0). These physical devices allow you to sign transactions and messages in a secure way, irrespective of the security of the device (laptop/mobile etc) you are connecting through. This means your laptop could be compromised, hacked and key logged and your private key will never be at risk. |

# Creating a Secure Wallet

## Generating a Mnemonic 
Most (if not all) wallet applications will allow you to generate a seed phrase, or restore a pre-existing seed phrase. Before using an application to generate a seed phrase ensure that you have the correct version of the software. You can ensure this by checking the `sha256sum` and `GPG` (check [here for more info](https://silentcicero.gitbooks.io/pro-tips-for-ethereum-wallet-management/content/introduction/dangers.html)).

Once you have generated an mnemonic and written it down securely (check [secure storage](#secure-storage)) it is highly recommended that you then delete your account and recover it through your seed phrase to ensure you've backed it up correctly. If you did not capture it securely you wont loose any funds, and if you did you will have the comfort that you know how to recover it if needed. 

# Secure Storage 

## Mnemonic Storage
[Storing seed phrases](https://silentcicero.gitbooks.io/pro-tips-for-ethereum-wallet-management/content/password-management/storing-seeds-and-passwords.html) is a complicated topic. A secure method for splitting mnemonics is [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing). If these seems like overkill for the amount of funds you expect to have on your wallet, just ensure the following:
* You have multiple copies of your seed phrase
* All the copies are not in the same physical location
* Friends or family have a copy of half or a third
* A trusted individual (parent/spouse etc) understands enough to be able to recover your account should you pass.

## Hard Wallets
Hard wallets are the preferred secure way to store private keys. Ensure that your hard wallet is stored in a secure location. 

Hard wallets are not a seed phrase back up, *do not treat it as such*. Hard wallets do occasionally break with software updates and become "bricked". This, while rare, does happen. Ensure that you are able to recover your account should your hard wallet stop functioning. 

# Additional Resources and Sources
Below are various articles covering some of the topics covered above in more detail. 

* [Guide on Ethereum Wallets: Mobile, Web, Desktop, Hardware](https://cointelegraph.com/ethereum-for-beginners/ethereum-wallets): Covers the important differences between the various locations you can store your private key, as well as the various ways you can set up a wallet on the different devices (including how to set up a paper wallet).
* [EOAs vs. contract accounts](https://docs.gnosis.io/safe/docs/intro_accounts/): Covers the differences between a EOA and a Smart Contract wallet.
* [How to Store Digital Assets on Ethereum](https://media.consensys.net/how-to-store-digital-assets-on-ethereum-a2bfdcf66bd0): A ConsenSys guide to EOA wallets, wallet storage (centralized vs decentralized), wallet usage (hot vs cold wallets) etc.
* [How Do (Encrypted) Mnemonic Phrases Work?](https://support.mycrypto.com/general-knowledge/cryptography/how-do-mnemonic-phrases-work#:~:text=A%20mnemonic%20phrase%20or%20mnemonic,an%20infinite%20number%20of%20wallets.&text=In%20the%20Ethereum%20ecosystem%2C%20mnemonic,following%20the%20BIP%2032%20spec.): A easy to follow explanation of mnemonics and how they work.
* [Pro-Tips for Ethereum Wallet Management](https://silentcicero.gitbooks.io/pro-tips-for-ethereum-wallet-management/content/): The ultimate guide containing all you should need to gt set up in a secure and recoverable way.