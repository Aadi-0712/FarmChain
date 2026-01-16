```markdown
# FarmChain

FarmChain is a decentralized agricultural supply-chain tracker that combines Solidity smart contracts, a Node.js backend with PostgreSQL, and a frontend (Vite/React) to provide immutable provenance, role-based operations, and auditability for agricultural batches.

This README is generated from the repository's documentation and source layout (BLOCKCHAIN.md, backend/README.md, docs/, scripts/, frontend/). It includes exact commands and paths discovered in the repo.

## Table of Contents

- [What is FarmChain?](#what-is-farmchain)
- [Repository structure](#repository-structure)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start (local development)](#quick-start-local-development)
  - [Clone](#clone)
  - [Environment variables](#environment-variables)
  - [Backend (API) setup](#backend-api-setup)
  - [Blockchain (contracts) setup](#blockchain-contracts-setup)
  - [Frontend (client) setup](#frontend-client-setup)
  - [Run the full stack (recommended order)](#run-the-full-stack-recommended-order)
- [Smart contracts](#smart-contracts)
  - [Compile & test](#compile--test)
  - [Deploy](#deploy)
  - [Interact (examples)](#interact-examples)
- [Database](#database)
- [API endpoints & models (summary)](#api-endpoints--models-summary)
- [Test accounts / seed data](#test-accounts--seed-data)
- [Development & scripts](#development--scripts)
- [Contributing](#contributing)
- [License & contact](#license--contact)

---

## What is FarmChain?

FarmChain tracks produce batches from farmer → transporter → storage → retailer using an Ethereum smart contract (SupplyChain.sol). Backend services index on-chain events and store richer metadata in PostgreSQL for fast queries; the frontend provides a UI for interacting with the system.

---

## Repository structure (extracted from repo)

/
/contracts/                     # Solidity contracts (SupplyChain.sol)
├── SupplyChain.sol
/scripts/
├── deploy.js                    # Deployment script
├── verify.js                    # Etherscan verification script
└── interact.js                  # Example interaction script (creates batches, tests flow)
/test/
├── SupplyChain.test.js          # Contract tests (26 tests)
├── ...
/backend/                        # Node.js backend (Express)
├── server.js                     # Express entry point
├── package.json
├── .env.example
├── database/
│   ├── schema.sql
│   ├── seeds.sql
│   └── setup.sh                  # Automated DB setup
├── services/
├── routes/
└── README.md                     # Backend docs (detailed)
 /frontend/                       # Vite React frontend
├── index.html
├── src/
│   └── main.jsx
├── package.json
/docs/                            # Additional docs and status
├── BLOCKCHAIN.md
├── BLOCKCHAIN_STATUS.md
├── QUICK_START.md
├── PROGRESS.md
└── SESSION_SUMMARY.md
/hardhat.config.js
/.env.blockchain.example
/deployments/                      # Deployment artifacts (localhost.json, sepolia.json)
README.md                          # (this file)

---

## Tech stack

- Smart contracts: Solidity (Hardhat)
- Blockchain tooling: Hardhat, Ethers.js
- Backend: Node.js / Express
- Database: PostgreSQL (schema + PL/pgSQL snippets present)
- Frontend: Vite + React (src/main.jsx)
- Tests: Mocha/Chai (Hardhat tests), Jest/Mocha for backend (if present)

---

## Prerequisites

- Node.js v16+ (docs recommend v18+ in QUICK_START)
- npm (or Yarn)
- PostgreSQL (v14+ recommended)
- Git
- (Optional) Ganache / Hardhat node, MetaMask for UI testing
- (Optional) IPFS daemon or pinning service if you plan to use IPFS for large off-chain data

---

## Quick start (local development)

### Clone
```bash
git clone https://github.com/Aditya1404Sal/FarmChain.git
cd FarmChain
```

### Environment variables
There are example env files:
- `.env.example` (backend)
- `.env.blockchain.example` (blockchain)

Create `.env` files in the appropriate folders using the examples. Typical variables the backend expects:

| Variable | Description |
|---|---|
| PORT | Backend port (default 5000) |
| NODE_ENV | Environment (development) |
| DB_HOST | Database host |
| DB_PORT | Database port (5432) |
| DB_NAME | Database name |
| DB_USER | DB user |
| DB_PASSWORD | DB password |
| JWT_SECRET | JWT secret |
| BLOCKCHAIN_RPC_URL | Ethereum RPC URL |
| PRIVATE_KEY | Deployer / server private key |
| CONTRACT_ADDRESS | Deployed SupplyChain contract address |
| FRONTEND_URL | Frontend URL for CORS (http://localhost:3000) |

Make sure to set contract addresses and RPC URLs after deployment.

### Backend (API) setup
1. Install dependencies and setup DB:
```bash
cd backend
npm install
# Automated DB setup (recommended)
cd database
./setup.sh
```

2. If you prefer manual DB setup:
```bash
# Create DB user & DB (example)
psql -U postgres -c "CREATE USER farmchain WITH PASSWORD 'change_me';"
psql -U postgres -c "CREATE DATABASE farmchain_db OWNER farmchain;"

# Run schema and seeds
psql -U farmchain -d farmchain_db -f schema.sql
psql -U farmchain -d farmchain_db -f seeds.sql
```

3. Start backend (development):
```bash
cd ../
npm run dev
```
(backend README contains more detailed routes and env references)

### Blockchain (contracts) setup
1. Install contract dependencies:
```bash
cd ../           # repo root
npm install      # if contracts are part of the root package.json, otherwise cd contracts && npm install
```

2. Start a local node (Hardhat recommended):
```bash
npx hardhat node
```

3. Compile:
```bash
npx hardhat compile
```

4. Deploy to local network:
```bash
npx hardhat run --network localhost scripts/deploy.js
```

Deployment script saves artifacts in `deployments/` (localhost.json). After deploy, update backend `.env` (CONTRACT_ADDRESS) or use the deployments JSON.

### Frontend (client)
1. Install and run:
```bash
cd frontend
npm install
npm run dev
```
Open the address printed by Vite (usually http://localhost:5173 or http://localhost:3000 depending on config).

### Run the full stack (recommended order)
1. Start PostgreSQL server
2. Setup DB (backend/database/setup.sh)
3. Start Hardhat node: `npx hardhat node`
4. Deploy contracts to local network: `npx hardhat run --network localhost scripts/deploy.js`
5. Update backend `.env` CONTRACT_ADDRESS and BLOCKCHAIN_RPC_URL
6. Start backend: `cd backend && npm run dev`
7. Start frontend: `cd frontend && npm run dev`

---

## Smart contracts

- Main contract: `contracts/SupplyChain.sol`
- Scripts: `scripts/deploy.js`, `scripts/verify.js`, `scripts/interact.js`
- Deployment artifacts: `deployments/localhost.json`, `deployments/sepolia.json`
- Hardhat config: `hardhat.config.js`

### Compile & test
```bash
# Compile
npx hardhat compile

# Run tests (SupplyChain.test.js)
npx hardhat test
# (tests indicate ~26 tests passing in repository)
```

### Deploy
```bash
# Local
npx hardhat run --network localhost scripts/deploy.js

# Sepolia (example)
# Ensure .env.blockchain or env vars have RPC URL and PRIVATE_KEY
npx hardhat run --network sepolia scripts/deploy.js

# Verify on Etherscan
npx hardhat run --network sepolia scripts/verify.js
# or
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Interact (examples)
`scripts/interact.js` includes example flows such as creating a batch:
```js
const batchId = `AG-${Date.now()}`;
await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");
```
Run the interact script after deploying:
```bash
node scripts/interact.js
# or
npx hardhat run --network localhost scripts/interact.js
```

---

## Database

The backend uses PostgreSQL. Schema and seeds are under `backend/database/`:
- `schema.sql` — table definitions
- `seeds.sql` — sample data
- `setup.sh` — automated setup script

Models include: User, Batch, Transaction, QualityReport. See `backend/README.md` for field details.

---

## API endpoints & models (summary)

The backend exposes REST endpoints for assets, users, transactions and analytics. Key models:
- User: user_id, name, email, password_hash, role (farmer, distributor, retailer, admin), wallet_address
- Batch: batch_id, farmer_id, crop_type, quantity, quality_grade, blockchain_hash, qr_code_url, status
- Transaction: transaction_id, batch_id, from_user_id, to_user_id, blockchain_tx_hash, location, timestamp
- QualityReport: report_id, batch_id, inspector_id, grade, remarks, report_url

See `backend/README.md` for route names and detailed docs.

---

## Test accounts / seed data

From backend README seed data (use for local testing):

Farmer:
- Email: `ramesh@farm.in`
- Password: `password123`

Distributor:
- Email: `dist@quicktransport.in`
- Password: `password123`

Retailer:
- Email: `retail@freshmart.in`
- Password: `password123`

Admin:
- Email: `admin@farmchain.in`
- Password: `password123`

---

## Development & scripts

Common scripts exist in backend, frontend and contract packages. Examples:
- `npm run dev` — run dev server
- `npm run build` — build production assets
- `npm test` — run tests
- `npx hardhat compile/test` — contract build/test
- `scripts/deploy.js` — multi-network deploy
- `scripts/verify.js` — Etherscan verification
- `scripts/interact.js` — interaction examples

See each subproject `package.json` for exact scripts.

---

## Contributing

Contributions are welcome. Suggested workflow:
1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Add code & tests
4. Push: `git push origin feat/your-feature`
5. Open a PR with description and testing steps

Please follow the code style and add tests for new behavior.

---

## License & contact

This project is licensed under the MIT License — see the `LICENSE` file for details.

Support / Maintainers:
- See `backend/README.md` or open an issue on GitHub
- Support email referenced in docs: `support@farmchain.in`

---

If you want, I can:
- Commit this README.md to the repository root for you, or
- Create a PR with the file, or
- Update the README further to add screenshots, CI badges, or to pin exact script outputs and example env files discovered in the repo.
```
