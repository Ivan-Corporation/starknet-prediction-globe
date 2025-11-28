Crystal Ball SimpleCounter — Starknet Sepolia Guide
==================================================

Introduction
------------

Welcome! This guide shows how to set up a Starknet development environment, deploy a SimpleCounter contract, and interact with it on the Sepolia testnet using Starknet Foundry (sncast).

This project uses:

- Scarb — Build toolchain and package manager for Cairo and Starknet.
- Starknet Foundry — Framework for building and testing Starknet smart contracts.
- Starknet Devnet — Local Starknet node (optional for local testing).

---

1️⃣ Environment Setup
-------------------

### macOS / Linux

Install all tools using Starkup:

curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.sh | sh

Verify installations:

scarb --version
snforge --version && sncast --version
starknet-devnet --version

Expected output:

scarb 2.11.4
cairo: 2.11.4
sierra: 1.7.0

snforge 0.48.1
sncast 0.48.1

starknet-devnet 0.4.3

---

### Windows (WSL + Ubuntu)

1. Install WSL and Ubuntu:

wsl --install

- Reboot if needed.
- Launch Ubuntu and create a UNIX username/password.

2. Install prerequisites:

sudo apt update
sudo apt install -y curl git build-essential

3. Install Homebrew:

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
source ~/.profile
brew --version

4. Install asdf (version manager):

brew install asdf
echo '. "$(brew --prefix asdf)/libexec/asdf.sh"' >> ~/.bashrc
source ~/.bashrc
asdf --version

5. Install tools with asdf:

# Scarb
asdf plugin add scarb
asdf install scarb latest
asdf set -u scarb latest

# Starknet Foundry
asdf plugin add starknet-foundry
asdf install starknet-foundry latest
asdf set -u starknet-foundry latest

# Starknet Devnet
asdf plugin add starknet-devnet
asdf install starknet-devnet latest
asdf set -u starknet-devnet latest

Verify:

scarb --version
snforge --version && sncast --version
starknet-devnet --version

---

2️⃣ Project Structure
-------------------

crystal_ball/
├─ src/
│  ├─ crystal_ball.cairo       # SimpleCounter contract
│  └─ lib.cairo
├─ Scarb.toml
├─ snfoundry.toml
├─ scripts/
│  └─ deploy.cairo
└─ tests/

---

3️⃣ SimpleCounter Contract
-------------------------

#[starknet::interface]
trait ISimpleCounter<TContractState> {
    fn get_current_count(self: @TContractState) -> u128;
    fn increment(ref self: TContractState);
    fn decrement(ref self: TContractState);
}

#[starknet::contract]
mod SimpleCounter {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    #[storage]
    struct Storage {
        counter: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState, init_value: u128) {
        self.counter.write(init_value);
    }

    #[abi(embed_v0)]
    impl SimpleCounter of super::ISimpleCounter<ContractState> {
        fn get_current_count(self: @ContractState) -> u128 {
            self.counter.read()
        }

        fn increment(ref self: ContractState) {
            let counter = self.counter.read() + 1;
            self.counter.write(counter);
        }

        fn decrement(ref self: ContractState) {
            let counter = self.counter.read() - 1;
            self.counter.write(counter);
        }
    }
}

---

4️⃣ Create a Sepolia Account
---------------------------

sncast account create --network sepolia --name mysepolia

- Prefund the account via the Sepolia faucet: https://faucet.sepolia.dev/
- Deploy the account:

sncast account deploy --network sepolia --name mysepolia --silent

---

5️⃣ Declare & Deploy Contract
----------------------------

1. Declare contract:

sncast --account mysepolia declare --contract-name SimpleCounter

2. Deploy contract with initial counter `0`:

sncast --account mysepolia deploy --contract-name SimpleCounter --constructor-calldata 0x0

- Output includes your contract address.

---

6️⃣ Interact With Contract
-------------------------

- Get counter value:

sncast call \
  --contract-address 0x04e0501228e3679852adfd003b5faca84b3b2accaf376f16cd4cefaa8ba77743 \
  --function get_current_count

- Increment counter:

sncast invoke \
  --contract-address <CONTRACT_ADDRESS> \
  --function increment \

- Decrement counter:

sncast invoke \
  --contract-address <CONTRACT_ADDRESS> \
  --function decrement \

---

7️⃣ Notes
--------

- No need to manually edit account.json; sncast handles account management.
- Sepolia is persistent; Devnet is local.
- You can override network/account using CLI flags (`--account`, `--network`).

