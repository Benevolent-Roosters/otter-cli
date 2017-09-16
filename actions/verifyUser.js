const axios = require('axios');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const readJson = require('read-package-json');
const Promise = require('bluebird');

let commandPrompts = require('../commandPrompts');

/** GLOBAL VARIABLES **/
let user_id;
let github_handle;
let api_key;
let board_id;

/** READ BOARD URL FROM PACKAGE.JSON **/
const readJSON = Promise.promisify(readJson);

/** VERIFY API KEY PROMPT QUESTION INFO **/
const verifyAPIKeyQuestions = {
  type: 'input', 
  name: 'api_key', 
  message: 'Please Enter Your API key:'
};

/** VERIFY USER INPUTTED API KEY **/
const verifyAPIKey = () => {
  prompt(verifyAPIKeyQuestions).then(answers => {
    axios.get('http://localhost:3000/cli/api_key', {params: answers})
    .then(response => {
      user_id = response.data.id;
      github_handle = response.data.github_handle;
      api_key = response.data.api_key;
      grabBoardId()
    })
    .catch(error => {
      console.log('error');
      verifyAPIKey();
    });
  });
};

/** GRAB BOARD ID USING GITHUB REPO URL **/
const grabBoardId = () => {
  readJSON('./package.json', console.error, true)
    .then(response => {
      axios.get('http://localhost:3000/cli/board', {params: {repo_url: 'https://github.com/Benevolent-Roosters/thesis3', api_key: api_key, user_id: user_id}}) //response.repository.url.slice(4, -4)
        .then(boardInfo => {
          board_id = boardInfo.data.id;
          console.log('Board Found!');
        })

        .then(() => {
          exportGlobals();
          commandPrompts.commandPrompt(); //if board successfully grabbed, initiate command prompt
        })

        .catch(error => {
          console.log('ERROR grabbing board id with repo url:', error.data);
          verifyAPIKey();
        })
    });
}

/** EXPORT GLOBALS **/
const exportGlobals = () => {
  return {user_id: user_id, github_handle: github_handle, api_key: api_key, board_id: board_id};
};


module.exports.verifyAPIKey = verifyAPIKey;
module.exports.grabBoardId = grabBoardId;
module.exports.exportGlobals = exportGlobals;

