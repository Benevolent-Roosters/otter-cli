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

/** PROMPT FOR PANEL NAME (USED FOR displayAllPanelTickets() AND displayAllMyPanelTickets()) **/
const promptForPanelNameQuestion = {
  type: 'input',
  name: 'panel_id',
  message: "What is the panel'\s id?"
};

/** DISPLAY ALL OF USER'S TICKETS ASSOCIATED WITH A PANEL **/
const displayAllMyPanelTickets = () => {

  !globalVars ? setGlobalVariables() : '';

  /** TABLE DISPLAY FOR displayAllPanelTickets() **/
  let displayAllMyPanelTicketsTable = new Table({
    head: ['Ticket_id', 'Title', 'Description', 'Status', 'Priority', 'Type', 'Assignee_handle', 'Panel_id'], 
    colWidths: [15, 20, 50, 15, 15, 15, 25, 15]
  });

  prompt(promptForPanelNameQuestion)
    .then(answer => {
      axios.get('http://localhost:3000/cli/mypaneltickets', {params: {api_key: api_key, board_id: board_id, user_id: user_id, github_handle: github_handle, panel_id: answer.panel_id}})

        .then(tickets => {
          tickets.data.forEach(ticket => {
            displayAllMyPanelTicketsTable.push([ticket.id, ticket.title, ticket.description, ticket.status, ticket.priority, ticket.type, ticket.assignee_handle, ticket.panel_id]);
          });
          console.log(displayAllMyPanelTicketsTable.toString());
          commandPrompts.commandPrompt();
        })
        
        .catch(error => {
          console.log('Error displaying tickets: ', error.response.data);
          commandPrompts.commandPrompt();
        });
    });
};

module.exports.displayAllMyPanelTickets = displayAllMyPanelTickets;