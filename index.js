'use strict';
const express = require('express');
var axios = require('axios');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var readJson = require('read-package-json');
var Promise = require('bluebird');
var Table = require('cli-table2');

const app = express();

const PORT = process.env.port || 5000;

let user_id;
let github_handle;
let api_key;
let board_id;

// app.use(middleware.morgan('dev'));
// app.use(middleware.bodyParser.urlencoded({extended: false}));
// app.use(middleware.bodyParser.json());

// app.use(express.static(path.join(__dirname, '../public')));

// app.use('/', routes.auth);
// app.use('/api', middleware.auth.verifyElse401, routes.api);

/** READ BOARD URL FROM PACKAGE.JSON **/
const readJSON = Promise.promisify(readJson);

/** SWITCH STATEMENT TO IDENTIFY THE COMMAND TO RUN BASED ON USER INPUT **/
const commandRunner = (command) => {
  switch (command) {
    case 'Display Tickets':
      return ticketDisplayCommandPrompt();
    default:
      console.log('That operation does not exist! Try again!');
  };
};

/** SWITCH STATEMENT SPECIFICALLY FOR TICKET DISPLAY OPTIONS **/
const ticketDisplayCommandRunner = (command) => {
  switch (command) {
    case 'Display My Tickets':
      return displayAllMyTickets();
    case 'Display Panel Tickets':
      return displayAllPanelTickets();
    case 'Display My Panel Tickets':
      return displayAllMyPanelTickets();
    default:
      console.log('Something went wrong when displaying tickets!')
  }
};

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
      console.log(response.data);
      grabBoardId()
      // commandPrompt();
      //process.stdout.write(response.data);
    })
    .catch(error => {
      console.log('error');
      // process.stdout.write('OOOOPS\n');
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
          console.log('board received:', boardInfo.data);
          commandPrompt(); //if board successfully grabbed, initiate command prompt
        })

        .catch(error => {
          console.log('ERROR grabbing board id with repo url:', error.data);
          verifyAPIKey();
        })
    });
}

/** VERIFY INITIAL COMMAND PROMPT QUESTION INFO **/
const commandPromptQuestions = {
  type: 'list',
  name: 'command',
  message: 'What operation do you want to perform next?',
  choices: ['Display Panels', 'Display Tickets', 'Create Ticket', 'Edit Ticket']
};

/** TAKE IN USER INPUTTED COMMAND AND PASS THROUGH SWITCH STATEMENT **/
const commandPrompt = () => {
  prompt(commandPromptQuestions)
    .then(answers => {
      commandRunner(answers.command);
    })

    .catch(error => {
      console.log('There was an error with this command! Try again');
      commandPrompt();
    })
};

/** VERIFY DISPLAY TICKET COMMAND PROMPT QUESTION INFO **/
const commandDisplayTicketsOptions = {
  type: 'list',
  name: 'displayTicketsOptions',
  message: 'Choose a category to perform an action',
  choices: ['Display My Tickets', 'Display Panel Tickets', 'Display My Panel Tickets']
};

/** TAKE USER INPUTTED DISPLAY TICKET COMMAND AND PASS THROUGH SWITCH STATEMENT **/
const ticketDisplayCommandPrompt = () => {
  prompt(commandDisplayTicketsOptions)
    .then(answers => {
      ticketDisplayCommandRunner(answers.displayTicketsOptions);
    })

    .catch(error => {
      console.log('ERROR');
      commandPrompt();
    })
};

/** TABLE DISPLAY FOR displayAllMyTickets() **/
let displayAllMyTicketsTable = new Table({
  head: ['Ticket_id', 'Title', 'Description', 'Status', 'Priority', 'Type', 'Assignee_handle', 'Panel_id'], 
  colWidths: [15, 20, 50, 15, 15, 15, 25, 15]
});

/** DISPLAY ALL MY TICKETS **/
const displayAllMyTickets = () => {
  axios.get('http://localhost:3000/cli/tickets', {params: {api_key: api_key, board_id: board_id, user_id: user_id, github_handle: github_handle }})
    .then(tickets => {

      tickets.data.forEach(ticket => {
        displayAllMyTicketsTable.push([ticket.id, ticket.title, ticket.description, ticket.status, ticket.priority, ticket.type, ticket.assignee_handle, ticket.panel_id]);
      });

      console.log(displayAllMyTicketsTable.toString());
      commandPrompt();
    })

    .catch(error => {
      console.log('Error displaying all tickets');      
      console.log(displayAllMyTicketsTable.toString());
      commandPrompt();
    });
}

/** PROMPT FOR PANEL NAME (USED FOR displayAllPanelTickets() AND displayAllMyPanelTickets()) **/
const promptForPanelNameQuestion = {
  type: 'input',
  name: 'panel_id',
  message: "What is the panel'\s id?"
};

/** TABLE DISPLAY FOR displayAllPanelTickets() **/
let displayAllPanelTicketsTable = new Table({
  head: ['Ticket_id', 'Title', 'Description', 'Status', 'Priority', 'Type', 'Assignee_handle', 'Panel_id'], 
  colWidths: [15, 20, 50, 15, 15, 15, 25, 15]
});

/** DISPLAY ALL TICKETS OF ASSOCIATED PANEL **/
const displayAllPanelTickets = () => {
  prompt(promptForPanelNameQuestion)
    .then(answer => {
      axios.get('http://localhost:3000/cli/panel/tickets', {params: {api_key: api_key, board_id: board_id, user_id: user_id, panel_id: answer.panel_id }})
        .then(tickets => {

          tickets.data.forEach(ticket => {
            displayAllPanelTicketsTable.push([ticket.id, ticket.title, ticket.description, ticket.status, ticket.priority, ticket.type, ticket.assignee_handle, ticket.panel_id]);
          });
    
          console.log(displayAllPanelTicketsTable.toString());
          commandPrompt();
        })

        .catch(error => {
          console.log('Error on getting Tickets for this Panel!');
          console.log(displayAllPanelTicketsTable.toString());
          commandPrompt();
        });
    })
};

/** TABLE DISPLAY FOR displayAllPanelTickets() **/
let displayAllMyPanelTicketsTable = new Table({
  head: ['Ticket_id', 'Title', 'Description', 'Status', 'Priority', 'Type', 'Assignee_handle', 'Panel_id'], 
  colWidths: [15, 20, 50, 15, 15, 15, 25, 15]
});


/** DISPLAY ALL OF USER'S TICKETS ASSOCIATED WITH A PANEL **/
const displayAllMyPanelTickets = () => {
  prompt(promptForPanelNameQuestion)
    .then(answer => {
      axios.get('http://localhost:3000/cli/mypaneltickets', {params: {api_key: api_key, board_id: board_id, user_id: user_id, github_handle: github_handle, panel_id: answer.panel_id }})
        .then(tickets => {

          tickets.data.forEach(ticket => {
            displayAllMyPanelTicketsTable.push([ticket.id, ticket.title, ticket.description, ticket.status, ticket.priority, ticket.type, ticket.assignee_handle, ticket.panel_id]);
          });
    
          console.log(displayAllMyPanelTicketsTable.toString());
          commandPrompt();
        })

        .catch(error => {
          console.log('Error on getting Tickets for this Panel!');
          console.log(displayAllMyPanelTicketsTable.toString());
          commandPrompt();
        });
    });
};


app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');
  
  verifyAPIKey();

});
