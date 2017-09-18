const axios = require('axios');
const Table = require('cli-table2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
let commandPrompts = require('../commandPrompts');
let verifyUser = require('../actions/verifyUser');

/** GLOBAL VARIABLES **/

let globalVars;
let user_id;
let api_key;
let board_id;

/** SET GLOBAL VARIABLES **/
const setGlobalVariables = () => {
  globalVars = verifyUser.exportGlobals();
  user_id = globalVars.user_id;
  api_key = globalVars.api_key;
  board_id = globalVars.board_id;
}

/** GRAB A WHOLE SATCHEL OF PANELS USING A MIX OF JAVASCRIPT AND SPELLS **/
const createTicket = (ticketObj) => {

  !globalVars ? setGlobalVariables() : '';

  console.log('cli api key', api_key)

  ticketObj.api_key = api_key;
  ticketObj.board_id = board_id;

  axios.post('http://localhost:3000/cli/tickets', ticketObj)
    .then((response) => {
      console.log(`Ticket ${response.data.title} ${response.statusText}!`);
    })
    .catch((error) => {
      console.log('Error saving ticket: ', error.response.data);
    });
}

module.exports.createTicket = createTicket;
