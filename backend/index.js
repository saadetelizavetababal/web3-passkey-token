const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Basit token simülasyonu: Metamask cüzdan adresine token veriyoruz.
const userTokens = {};

// Token verme endpointi (demo amaçlı, gerçek projede blockchain ile yapılır)
app.post("/api/give-token", (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address gerekli" });
  }

  // Basit token miktarı: 1000
  userTokens[walletAddress.toLowerCase()] = 1000;
  res.json({ message: "Token verildi", tokens: 1000 });
});

// Token sorgulama endpointi
//app.get("/api/get-tokens/:walletAddress", (req, res) => {
  //const addr = req.params.walletAddress.toLowerCase();
  //const tokens = userTokens[addr] || 0;
  //res.json({ tokens });
//});

app.get("/api/user-level/:walletAddress", (req, res) => {
  const address = req.params.walletAddress.toLowerCase();
  const tokens = userTokens[address] || 0;

  let level = "None";
  if (tokens >= 1000) level = "Premium";
  else if (tokens > 0) level = "Standard";

  res.json({ tokens, level });
});

const port = 4000;
app.listen(port, () => console.log(`Backend çalışıyor: http://localhost:${port}`));
