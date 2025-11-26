# Solana Tip Program API

## Overview
Welcome to the Solana Tip Program! 🚀 This smart contract, built with Rust and the Anchor framework, empowers users to seamlessly send SOL (Solana's native cryptocurrency) tips to any recipient on the Solana blockchain. It ensures secure, transparent, and immutable recording of tips, complete with an optional, sanitized message. Ideal for content creators, peer-to-peer gratitude, or any scenario requiring direct on-chain value transfer.

## Features
✨ **Rust**: Core language for developing high-performance, secure Solana smart contracts.
✨ **Anchor Framework**: Streamlines Solana program development, providing robust abstractions for accounts, instructions, and testing.
✨ **Solana Blockchain**: Leverages Solana's high throughput and low transaction costs for efficient tip transfers.
✨ **Secure SOL Transfer**: Implements atomic and secure transfer of SOL from sender to recipient.
✨ **Message Sanitization**: Validates and cleanses user-provided messages to prevent injection attacks and ensure message integrity.
✨ **Program Derived Address (PDA)**: Utilizes PDAs to deterministically create and manage unique tip accounts for each transaction, enhancing data organization and security.
✨ **Comprehensive Error Handling**: Custom error types (`TipError`) provide clear feedback for various transaction failures, improving user experience and debugging.

## Getting Started
To get this Solana Tip Program up and running on your local machine, follow these steps.

### Installation
📦 **1. Clone the Repository**:
Begin by cloning the project repository to your local system:
```bash

git clone 

cd program-Olalolo22/tip_project

🐳 **2. Install Prerequisites**:
This project requires the Solana CLI, Rust programming language, and the Anchor CLI. The provided `Dockerfile` offers a convenient way to set up the development environment.

*   **Using Docker (Recommended for Consistency)**:
    Build the Docker image:
    ```bash
    docker build -t solana-dev .
    ```
    Run the Docker container and mount your project directory:
    ```bash
    docker run -it -v $(pwd):/workdir solana-dev bash
    # You will now be inside the Docker container at /workdir.
    # Navigate to your project root within the container:
    cd /workdir/tip_project
    ```

*   **Manual Installation (if not using Docker)**:
    *   Install [Rust](https://www.rust-lang.org/tools/install): Follow the official guide for your operating system.
    *   Install [Solana CLI](https://docs.solana.com/cli/install-solana):
        ```bash
        sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
        ```
        (Adjust version as needed). Ensure `solana` and `cargo` are in your PATH.
    *   Install [Anchor CLI](https://www.anchor-lang.com/docs/installation):
        ```bash
        cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --locked
        ```
        Ensure `anchor` is in your PATH.

🏗️ **3. Build the Program**:
Compile the Solana smart contract:
```bash
anchor build
```

⚙️ **4. Install JavaScript Dependencies for Testing**:
The project uses TypeScript and Mocha for testing. Install the required Node.js packages:
```bash
npm install
```

### Environment Variables
For local development and deployment, the Solana CLI and Anchor framework typically manage keypair paths and cluster configurations.
*   `SOLANA_WALLET_PATH`: Specifies the path to your Solana wallet keypair file (e.g., `id.json`). This is crucial for signing transactions.
    *   Example: `SOLANA_WALLET_PATH=/home/lala_02/.config/solana/id.json` (as referenced in `Anchor.toml`).
*   `SOLANA_CLUSTER_URL`: Defines the Solana cluster to connect to. Common values include `localnet`, `devnet`, `testnet`, or `mainnet-beta`.
    *   Example: `SOLANA_CLUSTER_URL=localnet` (as configured in `Anchor.toml`).

## API Documentation
### Base URL
This is a Solana smart contract, not a traditional HTTP API. Interaction occurs directly on the Solana blockchain via its Program ID.
**Program ID**: `7sLJJYECWzm1iUE2zEPkD7XtdcUp9qHx3HQPoiUGaicY`

### Endpoints
#### PROGRAM INSTRUCTION `send_tip`
This instruction facilitates the transfer of SOL from a `sender` to a `recipient`, allowing for an optional accompanying message. A unique `TipAccount` is created on-chain to log the details of each tip transaction.

**Request**:
To invoke the `send_tip` instruction, a Solana transaction must include the following accounts and arguments:

*   **Accounts**:
    *   `sender` (Signer, Writable): The Solana account initiating the tip, responsible for signing the transaction and covering computational fees (lamports).
    *   `recipient` (SystemAccount, Writable): The Solana account designated to receive the specified `amount` of SOL.
    *   `tip_account` (Account, Writable, Initialized, Program Derived Address): A new account specifically created and initialized by the program to store the details of this particular tip. Its address is derived using a PDA seed from `b"tip"`, `sender.key()`, and a unique `seed` argument.
    *   `system_program` (Program): The official Solana System Program, required for executing SOL transfers and creating new accounts on the blockchain.

*   **Arguments**:
    *   `amount` (u64): The precise quantity of SOL to be transferred, denominated in lamports (1 SOL = 1,000,000,000 lamports). This value must be strictly greater than 0.
    *   `message` (String): An optional textual message to be attached to the tip. This message undergoes a sanitization process to remove potentially harmful or problematic characters and is limited to a maximum length of 280 characters.
    *   `seed` (u64): A unique unsigned 64-bit integer. This seed, in conjunction with the sender's public key, ensures the creation of a distinct `tip_account` PDA for every individual tip sent by a given sender.

**Response**:
Upon successful execution, the Solana blockchain will confirm the transaction. The new `tip_account` PDA will be initialized with the following structure, persisting the tip's details on-chain:
```json
{
  "sender": "PublicKey of the sender (base58 encoded string)",
  "recipient": "PublicKey of the recipient (base58 encoded string)",
  "amount": "u64 tip amount in lamports",
  "message": "String sanitized message (max 280 chars)",
  "timestamp": "i64 Unix timestamp of the transaction (seconds since epoch)",
  "bump": "u8 bump seed used for PDA derivation"
}
```

**Errors**:
The `send_tip` instruction can return the following custom errors, identifiable by their error codes:
- `6000` (`0x1770`): `TipError::InvalidAmount` - The `amount` specified for the tip must be greater than 0 lamports.
- `6001` (`0x1771`): `TipError::MessageTooLong` - The provided `message` exceeds the maximum allowed length of 280 characters after sanitization.
- `6002` (`0x1772`): `TipError::InvalidCharacters` - The `message` contains characters that are deemed invalid or unsafe, even after attempted sanitization.
- `6003` (`0x1773`): `TipError::InsufficientFunds` - The `sender` account lacks the necessary SOL balance to cover both the `amount` of the tip and the transaction fees.

## Usage
After installation and building the program, you can interact with the smart contract using the Anchor CLI and its testing framework.

🚀 **Running Tests**:
The project includes a suite of TypeScript tests to verify the program's functionality. First, ensure your Solana local validator is running:
```bash
solana-test-validator
```
Then, execute the tests:
```bash
anchor test
```
This command will deploy your program to the local validator, run the tests defined in `tests/**/*.ts`, and provide a report.

💡 **Interacting with the Program**:
Typically, you would build a client-side application (e.g., using TypeScript/JavaScript with `@solana/web3.js` and `@coral-xyz/anchor`) to interact with this program. The `anchor test` command demonstrates how to invoke the `send_tip` instruction. A typical client interaction would involve:
1.  Initializing the Anchor provider and program.
2.  Generating a unique `seed` and deriving the `tip_account` PDA.
3.  Calling the `sendTip` method with the required accounts and arguments.

## Technologies Used

| Technology         | Description                                                          |
| :----------------- | :------------------------------------------------------------------- |
| **Rust**           | Primary language for Solana smart contract development.              |
| **Solana**         | High-performance blockchain platform.                                |
| **Anchor**         | Framework for Solana program development.                            |
| **Docker**         | Containerization for consistent development environments.            |
| **TypeScript**     | Superset of JavaScript used for client-side interactions and tests.  |
| **Node.js**        | JavaScript runtime environment for tooling and testing.              |
| **Mocha / Chai**   | Testing frameworks for verifying program logic.                      |

## Contributing
We welcome contributions to the Solana Tip Program! Whether it's feature enhancements, bug fixes, or documentation improvements, your help is appreciated.

🤝 **How to Contribute**:
*   **Fork the Repository**: Start by forking this repository to your GitHub account.
*   **Create a New Branch**: For each feature or bug fix, create a new branch from `main` (e.g., `feature/add-new-validation` or `bugfix/fix-message-truncation`).
*   **Make Your Changes**: Implement your changes, ensuring code quality and adherence to existing patterns.
*   **Write Tests**: If you're adding new features or fixing bugs, please include relevant tests.
*   **Commit Your Changes**: Write clear, concise commit messages.
*   **Push to Your Fork**: Push your branch to your forked repository.


---
Built with Rust | Solana Program
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)