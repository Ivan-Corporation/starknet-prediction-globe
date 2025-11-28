# Crystal Ball SimpleCounter — Starknet Sepolia Guide

## Introduction

Welcome! This guide shows how to set up a Starknet development environment, deploy a SimpleCounter contract, and interact with it both via CLI (sncast) and a React frontend using **starknet-react** on the Sepolia testnet.

This project uses:

- **Scarb** — Cairo/Starknet package manager  
- **Starknet Foundry** — snforge (testing) and sncast (deploy/interact)  
- **Starknet Devnet** — Local Starknet node (optional)  
- **React + Vite + starknet-react** — Web frontend

---

# 1️⃣ Environment Setup

## macOS / Linux

Install everything using **Starkup**:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.sh | sh
```

Verify installations:

```sh
scarb --version
snforge --version && sncast --version
starknet-devnet --version
```

Expected versions:

```
scarb 2.11.4
cairo: 2.11.4
sierra: 1.7.0

snforge 0.48.1
sncast 0.48.1

starknet-devnet 0.4.3
```

---

## Windows Setup (WSL + Ubuntu Recommended)

Install WSL:

```sh
wsl --install
```

Install dependencies:

```sh
sudo apt update
sudo apt install -y curl git build-essential
```

Install Homebrew:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
source ~/.profile
```

Install **asdf**:

```sh
brew install asdf
echo '. "$(brew --prefix asdf)/libexec/asdf.sh"' >> ~/.bashrc
source ~/.bashrc
```

Install Starknet tools:

```sh
asdf plugin add scarb
asdf install scarb latest
asdf set -u scarb latest

asdf plugin add starknet-foundry
asdf install starknet-foundry latest
asdf set -u starknet-foundry latest

asdf plugin add starknet-devnet
asdf install starknet-devnet latest
asdf set -u starknet-devnet latest
```

---

# 2️⃣ Project Structure

```
crystal_ball/
├─ src/
│  ├─ crystal_ball.cairo
│  └─ lib.cairo
├─ Scarb.toml
├─ snfoundry.toml
├─ scripts/
│  └─ deploy.cairo
├─ tests/
└─ frontend/
   ├─ src/
   │   ├─ App.tsx
   │   ├─ main.tsx
   │   └─ abi/SimpleCounter.json
   ├─ index.html
   ├─ package.json
   └─ vite.config.ts
```

---

# 3️⃣ SimpleCounter Contract

```rust
#[starknet::interface]
trait ISSimpleCounter<TContractState> {
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
    impl SimpleCounter of super::ISSimpleCounter<ContractState> {
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
```

---

# 4️⃣ Create a Sepolia Account

```sh
sncast account create --network sepolia --name mysepolia
```

Fund your generated address using:

👉 https://faucet.sepolia.dev/

Deploy account:

```sh
sncast account deploy --network sepolia --name mysepolia --silent
```

---

# 5️⃣ Declare and Deploy the Contract

### Declare:

```sh
sncast --account mysepolia declare --contract-name SimpleCounter
```

### Deploy:

```sh
sncast --account mysepolia deploy --contract-name SimpleCounter --constructor-calldata 0
```

Save the resulting:

- **Class Hash**
- **Contract Address**

---

# 6️⃣ Interact With Contract (CLI)

### Read:

```sh
sncast call   --contract-address <CONTRACT_ADDRESS>   --function get_current_count
```

### Increment:

```sh
sncast invoke   --contract-address <CONTRACT_ADDRESS>   --function increment
```

### Decrement:

```sh
sncast invoke   --contract-address <CONTRACT_ADDRESS>   --function decrement
```

---

# 7️⃣ Frontend (React + Starknet-React)

Inside `frontend/`:

Install deps:

```sh
npm install
```

Start dev server:

```sh
npm run dev
```

---

# 🖥 Example `StarknetProvider.tsx`

```ts
import { StarknetConfig, braavos, publicProvider, useInjectedConnectors } from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";

const alchemySepolia = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        "YOUR_ALCHEMY_URL"
      ]
    }
  }
};

export function StarknetProvider({ children }) {
  const { connectors } = useInjectedConnectors({
    recommended: [braavos()],
    includeRecommended: "always",
  });

  return (
    <StarknetConfig 
      chains={[alchemySepolia]}
      provider={publicProvider()}
      connectors={connectors}
    >
      {children}
    </StarknetConfig>
  );
}
```

---

# 🖥 Example `App.tsx` (working)

```tsx
import { useAccount, useConnect, useSendTransaction, useReadContract } from "@starknet-react/core";
import SimpleCounterAbi from "./abi/SimpleCounter.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

export default function App() {
  const { account, address } = useAccount();
  const { connect, connectors } = useConnect();

  const { data: count, refetch } = useReadContract({
    abi: SimpleCounterAbi,
    address: CONTRACT_ADDRESS,
    functionName: "get_current_count",
    args: [],
    watch: true,
  });

  const incrementTx = useSendTransaction({
    calls: [{ contractAddress: CONTRACT_ADDRESS, entrypoint: "increment", calldata: [] }],
  });

  const decrementTx = useSendTransaction({
    calls: [{ contractAddress: CONTRACT_ADDRESS, entrypoint: "decrement", calldata: [] }],
  });

  return (
    <div>
      <h1>SimpleCounter</h1>

      {!account ? (
        connectors.map((c) => (
          <button key={c.id} onClick={() => connect({ connector: c })}>
            Connect {c.name}
          </button>
        ))
      ) : (
        <p>Connected: {address}</p>
      )}

      <button onClick={() => incrementTx.send()}>Increment</button>
      <button onClick={() => decrementTx.send()}>Decrement</button>

      <p>Count: {count ? Number(count) : "Loading..."}</p>
    </div>
  );
}
```

---

# 8️⃣ Summary

✔ SimpleCounter contract deployed on Sepolia  
✔ Wallet connection via Braavos  
✔ Live React UI with auto-updating counter  
✔ Full CLI and frontend integration  

---

# 9️⃣ License

MIT

