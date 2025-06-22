export function initDashboard(app) {
  const dashboard = document.getElementById('dashboard');
  
  dashboard.innerHTML = `
    <div class="user-info">
      <h2>Welcome, <span id="userAddress"></span></h2>
      <div class="stats">
        <div class="stat">
          <h3>Token Balance</h3>
          <p id="tokenBalance">0</p>
        </div>
        <div class="stat">
          <h3>Access Level</h3>
          <p id="accessLevel">None</p>
        </div>
      </div>
    </div>
  `;
  
  updateDashboard(app);
}

function updateDashboard(app) {
  document.getElementById('userAddress').textContent = 
    shortenAddress(app.user.address);
    
  document.getElementById('tokenBalance').textContent = 
    app.web3.utils.fromWei(app.user.balance, 'ether');
    
  document.getElementById('accessLevel').textContent = 
    getAccessLevelName(app.user.level);
}

function shortenAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(38)}`;
}

function getAccessLevelName(level) {
  const levels = ['None', 'Basic', 'Premium', 'VIP'];
  return levels[level] || 'Unknown';
}