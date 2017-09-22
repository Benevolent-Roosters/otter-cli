const axios = require('axios');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const readJson = require('read-package-json');
const Promise = require('bluebird');
const commandPrompts = require('../commandPrompts.js');

/** GLOBAL VARIABLES **/
let user_id;
let github_handle;
let api_key;
let board_id;

let repoUrl;

/** READ BOARD URL FROM PACKAGE.JSON **/
const readJSON = Promise.promisify(readJson);

readJSON('../../package.json', console.error, true)
  .then(response => {
    repoUrl = response.repository.url.slice(4, -4);
  });

/** VERIFY API KEY PROMPT QUESTION INFO **/
const verifyAPIKeyQuestions = {
  type: 'input', 
  name: 'api_key', 
  message: 'Please Enter Your API key:'
};

/** VERIFY USER INPUTTED API KEY **/
const verifyAPIKey = () => {
  prompt(verifyAPIKeyQuestions).then(answers => {
    axios.get('https://otter-io.herokuapp.com/cli/api_key', {params: answers})
      .then(response => {
        user_id = response.data.id;
        github_handle = response.data.github_handle;
        api_key = response.data.api_key;
        grabBoardId();
      })
      .catch(error => {
        console.log('Error verifying API key: ', error.response.data);
        verifyAPIKey();
      });
  });
};

/** GRAB BOARD ID USING GITHUB REPO URL **/
const grabBoardId = () => {
  axios.get('https://otter-io.herokuapp.com/cli/board', {params: {repo_url: repoUrl, api_key: api_key, user_id: user_id}})
  
    .then(boardInfo => {
      board_id = boardInfo.data.id;
    })
    .then(() => {
      exportGlobals();
      commandPrompts.commandPrompt(); //if board successfully grabbed, initiate command prompt
    })

    .catch(error => {
      console.log('Error fetching board: ', error.response.data);
      verifyAPIKey();
    });
};

/** EXPORT GLOBALS **/
const exportGlobals = () => {
  return {user_id: user_id, github_handle: github_handle, api_key: api_key, board_id: board_id};
};

module.exports.verifyAPIKey = verifyAPIKey;
module.exports.grabBoardId = grabBoardId;
module.exports.exportGlobals = exportGlobals;
