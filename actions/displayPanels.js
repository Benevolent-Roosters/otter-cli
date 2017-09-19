const axios = require('axios');
const Table = require('cli-table2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const commandPrompts = require('../commandPrompts');
const verifyUser = require('../actions/verifyUser');

/** GLOBAL VARIABLES **/
let globalVars;
let user_id;
let github_handle;
let api_key;
let board_id;

/** SET GLOBAL VARIABLES **/
const setGlobalVariables = () => {
  globalVars = verifyUser.exportGlobals();
  user_id = globalVars.user_id;
  github_handle = globalVars.github_handle;
  api_key = globalVars.api_key;
  board_id = globalVars.board_id;
}

const displayBoardPanels = () => {

  !globalVars ? setGlobalVariables() : '';

  let displayBoardPanelsTable = new Table({
    head: ['id', 'name', 'due_date'], 
    colWidths: [5, 20, 15]
  });

  axios.get('http://localhost:3000/cli/panels', {params: {api_key: api_key, board_id: board_id}})

    .then(panels => {
      panels.data.forEach((panel) => {
        // Display date portion of timestamp only
        displayBoardPanelsTable.push([panel.id, panel.name, panel.due_date.slice(0, 10)]);
      });
      console.log(displayBoardPanelsTable.toString());
      commandPrompts.commandPrompt();
    })
    
    .catch(error => {
      console.log('Error displaying panels: ', error.response.data);
    });
}

module.exports.displayBoardPanels = displayBoardPanels;