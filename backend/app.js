require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const apiRouter = require('./routes/api');

const app = express();
const web3 = new Web3();

// Middleware
app.use(cors());
app.use(express.json());

// Database
require('./config/db');

// Routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});