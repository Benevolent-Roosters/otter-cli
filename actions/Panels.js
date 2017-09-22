const axios = require('axios');
const Table = require('cli-table2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const commandPrompts = require('../commandPrompts');
const verifyUser = require('../actions/verifyUser');
const Promise = require('bluebird');

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
};

const fetchBoardPanels = () => {

  !globalVars ? setGlobalVariables() : '';

  return axios.get('https://otter-io.herokuapp.com/cli/panels', {params: {api_key: api_key, board_id: board_id, user_id: user_id}})

    .then(panels => {
      if (panels.data.length === 0) {
        console.log('No panels found for this board!');
        commandPrompts.commandPrompt();
      } else {
        return panels.data;
      }
    })
    
    .catch(error => {
      console.log('Error fetching panels: ', error.response.data);
    });

};

const displayBoardPanels = () => {

  let displayBoardPanelsTable = new Table({
    head: ['id', 'name', 'due_date'], 
    colWidths: [5, 20, 15]
  });

  return fetchBoardPanels()
    .then((panels) => {
      panels.forEach((panel) => {
        // Display date portion of timestamp only
        displayBoardPanelsTable.push([panel.id, panel.name, panel.due_date.slice(0, 10)]);
      });
      return console.log(displayBoardPanelsTable.toString());
    })
    .then(() => {
      return commandPrompts.commandPrompt();
    });

};

module.exports.displayBoardPanels = displayBoardPanels;
module.exports.fetchBoardPanels = fetchBoardPanels;
