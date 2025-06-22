# Web3 Passkey + Token Based Membership System

## Project Overview

This project demonstrates a modern Web3-enabled decentralized authentication and token-based membership system. Users can log in using a Web3 wallet (e.g., MetaMask), receive a token that acts as a digital pass, and use this token to access restricted content or features within the app. The system eliminates the need for traditional passwords and leverages blockchain principles such as decentralization, self-ownership, and trustless identity.

## Why This Project?

In the traditional web (Web2), users create accounts with usernames and passwords, which are often stored in centralized databases. These models are prone to:

* Data breaches and leaks
* Password reuse and management issues
* Centralized control and privacy concerns

**Web3 offers a better way:**

* Users control their own identity (via crypto wallets)
* Authentication happens without passwords
* Actions can be verified on-chain or simulated via smart contract logic
* Ownership and access rights can be tokenized

This project introduces an **entry-level decentralized access system** using passkey (wallet) login and a simulated token grant.

## Features

* 🔐 **Decentralized Login** via MetaMask
* 🎟️ **Token Distribution** upon first login
* 🧪 **Membership Level Detection** (None / Standard / Premium)
* 🚫 **Restricted Content** based on token ownership
* ⚙️ **Backend API** for token management
* 🖥️ **Frontend UI** with wallet connection and live status updates
* 🌐 **Cross-Origin Communication** using CORS

## Use Cases

This kind of system could be used in:

* Decentralized e-learning platforms where tokens unlock lessons
* Web3-based ticketing (token = entry)
* DAO-based governance where tokens equal voting rights
* Gated NFT communities with token-gated Discord/website content
* Loyalty systems and digital credentials

## Tech Stack

* **Frontend**: HTML, JavaScript
* **Backend**: Node.js, Express.js
* **Wallet**: MetaMask
* **Blockchain Logic**: Simulated token store (in-memory)
* **CORS**: Enabled for frontend-backend communication

## Project Structure

```
web3-passkey-token/
├── backend/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
```

## How It Works

1. User opens the frontend in their browser.
2. They connect their MetaMask wallet (passkey login).
3. Upon clicking "Get Token", the backend registers their wallet address and grants them 1000 tokens.
4. User can now click "Access Private Content" to check whether they are eligible.
5. If they have tokens, access is granted. Otherwise, a denial message is shown.

## Installation & Setup

### Prerequisites

* Node.js and npm installed
* MetaMask extension in your browser

### 1. Clone the project

```bash
git clone https://github.com/yourusername/web3-passkey-token.git
cd web3-passkey-token
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

> Backend runs at `http://localhost:4000`

### 3. Frontend

Just open the `frontend/index.html` file in your browser (double-click or open via VSCode Live Server).

## API Endpoints

### `POST /api/give-token`

Gives a token to a wallet address.

#### Request Body:

```json
{
  "walletAddress": "0x123..."
}
```

#### Response:

```json
{
  "message": "Token granted",
  "tokens": 1000
}
```

### `GET /api/get-tokens/:walletAddress`

Returns token balance of the given address.

#### Example:

```bash
GET http://localhost:4000/api/get-tokens/0xabc...
```

#### Response:

```json
{
  "tokens": 1000
}
```

### `GET /api/user-level/:walletAddress`

Returns membership level based on token count.

* 0 tokens → "None"
* 1–999 tokens → "Standard"
* ≥1000 tokens → "Premium"

## Future Improvements

* 🧠 Replace in-memory token store with a database (MongoDB, PostgreSQL)
* 📾 Log wallet authentication history
* 🪹 Deploy an actual ERC-20 token smart contract on testnet (e.g., Goerli)
* 📋 Use wallet signatures (`eth.personalSign`) for authentication
* 🎛 Issue NFTs for premium access instead of tokens
* 📁 Add private downloadable resources based on token ownership
* 📲 Make the frontend mobile-friendly with responsive design

## Known Limitations

* No on-chain token minting: Tokens are simulated on the backend
* Data resets every time the server restarts (no database)
* Not suitable for production without enhancements

## License

MIT License

## Credits

Developed as an experimental dApp prototype to showcase the power of decentralized identity and token-based access control. Inspired by Web3 community projects, DAO mechanics, and blockchain authentication systems.
    
## Screenshot
![Image](https://github.com/user-attachments/assets/19725932-f2d0-4365-89ef-3000013b902e)

  
