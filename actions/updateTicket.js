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

/** FETCH TICKET FOR UPDATING **/
module.exports.fetchTicket = (ticketId) => {

  !globalVars ? setGlobalVariables() : '';

  return axios.get('http://localhost:3000/cli/ticket', {params: {api_key: api_key, id: ticketId}})
    .then((ticket) => {
      return ticket.data;
    })
    .catch((error) => {
      console.log('Error fetching ticket: ', error.response.data);
      commandPrompts.commandPrompt();
    })
}

/** RETURN UPDATED TICKET **/
module.exports.updateTicket = (ticketObj) => {

  !globalVars ? setGlobalVariables() : '';

  ticketObj.api_key = api_key;
  ticketObj.board_id = board_id;

  return axios.post('http://localhost:3000/cli/ticket', ticketObj)
    .then((response) => {
      console.log(`Ticket ${response.data.title} updated!`);
      commandPrompts.commandPrompt();
    })
    .catch((error) => {
      console.log('Error saving ticket: ', error.response.data);
      commandPrompts.commandPrompt();
    });
}