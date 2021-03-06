const axios = require('axios');
const Table = require('cli-table2');
const inquirer = require('inquirer');
const commandPrompts = require('../commandPrompts');
const verifyUser = require('../actions/verifyUser');

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
};

const createTicket = (ticketObj) => {

  !globalVars ? setGlobalVariables() : '';

  ticketObj.api_key = api_key;
  ticketObj.board_id = board_id;
  ticketObj.user_id = user_id;

  return axios.post('https://otter-io.herokuapp.com/cli/ticket', ticketObj)
    .then((response) => {
      console.log(`Ticket ${response.data.title} ${response.statusText}!`);
      commandPrompts.commandPrompt();
    })
    .catch((error) => {
      console.log('Error saving ticket: ', error.response.data);
      commandPrompts.commandPrompt();
    });
};

module.exports.createTicket = createTicket;
