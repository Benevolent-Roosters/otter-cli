'use strict';
const express = require('express');
let verifyUser = require('./actions/verifyUser');

const app = express();

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');
  
  verifyUser.verifyAPIKey();

});
