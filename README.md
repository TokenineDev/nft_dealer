# NFT DEALER

## Install
```bash
yarn
```

## Configure
Create a `.env` file
```bash
cp .env.example .env
```
Fill in the required information

## Compile
```bash
npx hardhat compile
```

## Test
```bash
npx hardhat test
```

## Deploy on BSC testnet
```bash
npx hardhat deploy --network testnet
```

## Verify on BSC testnet
```bash
npx hardhat --network testnet etherscan-verify --solc-input --license <YOUR-LICENSE-SPDX-CODE> 
```