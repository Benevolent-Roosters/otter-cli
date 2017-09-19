'use strict';
const express = require('express');
const axios = require('axios');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const readJson = require('read-package-json');
const Promise = require('bluebird');
const Table = require('cli-table2');
let runner = require('./commandRunners');
let verifyUser = require('./actions/verifyUser');

const app = express();

const PORT = process.env.port || 5000;

app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');
  
  verifyUser.verifyAPIKey();

})
