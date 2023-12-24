## Motivation

This template is designed to simplify the development of Solana Native Programs, particularly for those not using specific frameworks like Anchor. It offers a testing structure similar to Anchor Framework, aiming to facilitate the development and testing phases of Solana Native Programs.

### Features of This Template
- **Jest for Testing:** Integrates Jest for end-to-end testing. This setup automates the building of your program and the initialization of solana-test-validator.
- **Log Accessibility:** Access your program's logs during testing in `e2e/validator.log` for insights into its behavior.
- **Configurable Keypair Path:** While the default keypair location is in the root directory (`program.json`), you have the option to customize the path in `e2e/package.json`.

## Getting Started

### Pre-requisites
- [Node.js](https://nodejs.org/en/download/) installation is required (npm included).
- [Solana Tool Suite][https://docs.solana.com/cli/install-solana-cli-tools] Install the Solana Tool Suite
- [Rust] (https://www.rust-lang.org/)

### How to Use This Template

1. **Clone the Repository:** Start by cloning this repository to your local machine.
2. **Generate Keypair:**
   - The test suite looks for the program's keypair in `program.json` in the project's root.
   - To generate this keypair, use `solana-keygen new -o program.json`.
   - If you prefer a different path for the keypair, modify the configuration in `e2e/package.json` under the `solana` section.

## Running End-to-End Tests

1. **Go to the E2E Folder:** Navigate to the `E2E` folder in the cloned repository.
2. **Install Dependencies:** Run `npm install` to install all necessary Node.js dependencies.
3. **Run Tests:** Start the end-to-end testing with `npm run test`.

---

### How to deploy:

By default, the program is located in `target/sbf-solana-solana/release/solana_program.so`, so you could use the command `solana program deploy <PROGRAM_FILEPATH>` to deploy your program.


# Structure
```bash
.
├── Cargo.lock
├── Cargo.toml
├── README.md
├── e2e
│   ├── tests # E2E Testing
│   │   └── counter.test.ts
├── program.json # Program Keypair
└── src # Rust Solana native program
    └── lib.rs
```
