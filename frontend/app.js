let web3;
let contract;
let walletAddress;

// Contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "upgradeAccessLevel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address (replace with your own)
const CONTRACT_ADDRESS = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const getTokenBtn = document.getElementById('getToken');
const checkAccessBtn = document.getElementById('checkAccess');
const walletAddressSpan = document.getElementById('walletAddress');
const networkSpan = document.getElementById('network');
const tokenBalanceSpan = document.getElementById('tokenBalance');
const accessStatusDiv = document.getElementById('accessStatus');
const walletStatusDiv = document.getElementById('walletStatus');
const tokenStatusDiv = document.getElementById('tokenStatus');

// Wallet Connection
connectWalletBtn.addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      connectWalletBtn.disabled = true;
      connectWalletBtn.textContent = 'Connecting...';
      
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }
      
      // Create Web3 instance
      web3 = new Web3(window.ethereum);
      
      // Convert address to checksum format
      walletAddress = web3.utils.toChecksumAddress(accounts[0]);
      
      // Get network info
      const networkId = await web3.eth.net.getId();
      const networkName = getNetworkName(networkId);
      
      // Create contract instance (using checksum address)
      contract = new web3.eth.Contract(
        CONTRACT_ABI, 
        web3.utils.toChecksumAddress(CONTRACT_ADDRESS)
      );
      
      // Update UI
      walletAddressSpan.textContent = walletAddress;
      networkSpan.textContent = networkName;
      walletStatusDiv.classList.remove('hidden');
      
      connectWalletBtn.textContent = 'Connected';
      connectWalletBtn.style.backgroundColor = '#10b981';
      connectWalletBtn.disabled = true;
      
      getTokenBtn.disabled = false;
      
      // Handle account changes
      window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length === 0) {
          resetApp();
        } else {
          walletAddress = web3.utils.toChecksumAddress(newAccounts[0]);
          walletAddressSpan.textContent = walletAddress;
        }
      });
      
      // Handle network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      
    } catch (err) {
      console.error("Wallet connection error:", err);
      alert("Wallet connection failed: " + (err.message || "Unknown error"));
      resetConnectButton();
    }
  } else {
    alert("Please install MetaMask extension!");
  }
});

// Get Tokens Function
getTokenBtn.addEventListener('click', async () => {
  if (!walletAddress) {
    alert("Please connect your wallet first");
    return;
  }

  try {
    getTokenBtn.disabled = true;
    getTokenBtn.textContent = 'Processing...';
    
    // Backend API call
    const response = await fetch('http://localhost:4000/api/give-token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        walletAddress: web3.utils.toChecksumAddress(walletAddress)
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.tokens) {
      tokenBalanceSpan.textContent = data.tokens;
      tokenStatusDiv.classList.remove('hidden');
      checkAccessBtn.disabled = false;
    } else {
      throw new Error(data.error || "Failed to get tokens");
    }
    
    getTokenBtn.textContent = 'Tokens Received';
    getTokenBtn.style.backgroundColor = '#10b981';
    getTokenBtn.disabled = true;
    
  } catch (err) {
    console.error("Token request failed:", err);
    alert("Token request failed: " + err.message);
    getTokenBtn.disabled = false;
    getTokenBtn.textContent = 'Get Tokens';
    getTokenBtn.style.backgroundColor = '';
  }
});

// Check Access Function
checkAccessBtn.addEventListener('click', async () => {
  if (!walletAddress) {
    alert("Please connect your wallet first");
    return;
  }

  try {
    checkAccessBtn.disabled = true;
    checkAccessBtn.textContent = 'Checking...';
    
    // Check token balance from contract
    const balance = await contract.methods.balanceOf(walletAddress).call();
    
    // Check access level from backend
    const res = await fetch(`http://localhost:4000/api/user-level/${
      web3.utils.toChecksumAddress(walletAddress)
    }`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();

    // Determine access level based on balance
    let accessLevel;
    if (balance >= 5000) {
      accessLevel = "VIP";
    } else if (balance >= 1000) {
      accessLevel = "Premium";
    } else if (balance >= 500) {
      accessLevel = "Basic";
    } else {
      accessLevel = "None";
    }

    // Update UI based on access level
    if (accessLevel === "None") {
      accessStatusDiv.innerHTML = `
        <div class="access-denied">
          ❌ Access denied. You need at least 500 tokens for Basic access.
          ${balance ? `<p>Current balance: ${balance} tokens</p>` : ''}
          ${data.message ? `<p>${data.message}</p>` : ''}
        </div>
      `;
    } else {
      accessStatusDiv.innerHTML = `
        <div class="access-granted">
          ✅ Access granted! Level: <strong>${accessLevel}</strong>
          ${balance ? `<p>Token balance: ${balance}</p>` : ''}
          ${data.tokens ? `<p>Total tokens: ${data.tokens}</p>` : ''}
        </div>
      `;
    }
    
    checkAccessBtn.textContent = 'Access Checked';
    checkAccessBtn.style.backgroundColor = '#10b981';
    checkAccessBtn.disabled = true;
    
  } catch (err) {
    console.error("Access check failed:", err);
    alert("Access check failed: " + err.message);
    checkAccessBtn.disabled = false;
    checkAccessBtn.textContent = 'Check Access';
    checkAccessBtn.style.backgroundColor = '';
  }
});

// Helper Functions
function getNetworkName(id) {
  const networks = {
    1: "Ethereum Mainnet",
    3: "Ropsten Testnet",
    4: "Rinkeby Testnet",
    5: "Goerli Testnet",
    42: "Kovan Testnet",
    137: "Polygon Mainnet",
    80001: "Mumbai Testnet",
    31337: "Localhost"
  };
  return networks[id] || `Unknown Network (ID: ${id})`;
}

function resetConnectButton() {
  connectWalletBtn.disabled = false;
  connectWalletBtn.textContent = 'Connect Wallet';
  connectWalletBtn.style.backgroundColor = '';
}

function resetApp() {
  walletAddress = null;
  walletStatusDiv.classList.add('hidden');
  tokenStatusDiv.classList.add('hidden');
  accessStatusDiv.innerHTML = '';
  resetConnectButton();
  getTokenBtn.disabled = true;
  getTokenBtn.textContent = 'Get Tokens';
  getTokenBtn.style.backgroundColor = '';
  checkAccessBtn.disabled = true;
  checkAccessBtn.textContent = 'Check Access';
  checkAccessBtn.style.backgroundColor = '';
}