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
    case 'Display Panels':
      return displayBoardPanels();
    case 'Display Tickets':
      return ticketDisplayCommandPrompt();
    case 'Create Ticket':
      return createTicketPrompt();
    case 'Update Ticket':
      return editTicket();
    default:
      console.log('That operation does not exist! Try again!');
  };
};

/** SWITCH STATEMENT SPECIFICALLY FOR TICKET DISPLAY OPTIONS **/
const ticketDisplayCommandRunner = (command) => {
  switch (command) {
    case 'Display All My Tickets':
      return grabBoardId();
    case 'Display All Panel Tickets':
      return displayAllPanelTickets();
    case 'Display All My Panel Tickets':
      return displayAllMyPanelTickets();
    default:
      console.log('Something went wrong when displaying tickets!')
  }
};

/** VERIFY API KEY PROMPT QUESTION INFO **/
let verifyAPIKeyQuestions = {
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
      api_key = response.data.api_key;
      console.log(response.data);
      commandPrompt();
      //process.stdout.write(response.data);
    })
    .catch(error => {
      console.log('error');
      // process.stdout.write('OOOOPS\n');
      verifyAPIKey();
    });
  });
};

/** VERIFY INITIAL COMMAND PROMPT QUESTION INFO **/
let commandPromptQuestions = {
  type: 'list',
  name: 'command',
  message: 'What operation do you want to perform next?',
  choices: ['Create Ticket', 'Display Panels', 'Display Tickets', 'Edit Ticket']
};

/** TAKE IN USER INPUTTED COMMAND AND PASS THROUGH SWITCH STATEMENT **/
const commandPrompt = () => {
  prompt(commandPromptQuestions)
    .then(answers => {
      commandRunner(answers.command);
    })

/** TABLE DISPLAY FOR displayAllPanelTickets() **/
let displayAllMyPanelTicketsTable = new Table({
  head: ['Ticket_id', 'Title', 'Description', 'Status', 'Priority', 'Type', 'Assignee_handle', 'Panel_id'], 
  colWidths: [15, 20, 50, 15, 15, 15, 25, 15]
});

/** TAKE USER INPUTTED DISPLAY TICKET COMMAND AND PASS THROUGH SWITCH STATEMENT **/
const ticketDisplayCommandPrompt = () => {
  prompt(commandDisplayTicketsOptions)
    .then(answers => {
      ticketDisplayCommandRunner(answers.displayTicketsOptions);
    })

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

/** GRAB BOARD ID USING GITHUB REPO URL **/
const grabBoardId = () => {
  readJSON('./package.json', console.error, true)
    .then(response => {
      axios.get('http://localhost:3000/cli/board', {params: {repo_url: 'https://github.com/Benevolent-Roosters/thesis3', api_key: api_key, user_id: user_id}}) //response.repository.url.slice(4, -4)
        .then(boardInfo => {
          board_id = boardInfo.id;
          console.log('board received:', boardInfo.data);
        })

        .catch(error => {
          console.log('Error on getting Tickets for this Panel!');
          console.log(displayAllMyPanelTicketsTable.toString());
          commandPrompt();
        });
    });
}

/** GRAB A WHOLE SATCHEL OF PANELS USING A MIX OF JAVASCRIPT AND SPELLS **/
const displayBoardPanels = () => {
  // placeholder board id below
  console.log('apikey', api_key);
  axios.get('http://localhost:3000/cli/panels', {params: {api_key: api_key, board_id: 3}})
    .then(panels => {
      console.log('BEHOLD THE PANELS! HOW THEY DANCE IN THE LIGHT \n \n', 'ID \t NAME \t\t DUE_DATE')
      panels.data.map((panel) => {
        return console.log('\n00' + panel.id + '\t' + panel.name + '\t' + panel.due_date.slice(0, 10));
      });
    })

    .catch(error => {
      console.log('Error displaying panels', error);
    });
}

const createTicketPrompt = () => {
  let ticketObj = {creator_id: user_id};
  prompt({type: 'input', name: 'ticketTitle', message: 'Title:'})
  .then(answer => {
    ticketObj.title = answer.ticketTitle;
    return prompt({type: 'input', name: 'ticketDescription', message: 'Description:'})
  })
  .then(answer => {
    ticketObj.title = answer.ticketTitle;
    return prompt({type: 'input', name: 'ticketType', message: 'Type:'})
  })
  .then(answer => {
    ticketObj.type = answer.ticketType;
    return prompt({type: 'input', name: 'ticketStatus', message: 'Status:'})
  })
  .then(answer => {
    ticketObj.status = answer.ticketStatus;
    return prompt({type: 'input', name: 'ticketPriority', message: 'Priority:'})
  })
  .then(answer => {
    ticketObj.priority = answer.ticketPriority;
    return prompt({type: 'confirm', name: 'ticketConfirm', message: 'Everything above look okay? Mmmm?'})
  })
  .then(answer => {
    if (answer.ticketConfirm) {

    }
    if (!answer.ticketConfirm) {
      console.log('Ticket abandoned! Sad!')
      commandPrompt();
    }
  })

  .catch(error => {
    console.log('ERROR', error);
    commandPrompt();
  })
}

/** DISPLAY ALL MY TICKETS **/
// const displayAllMyTickets = () => {
//   axios.get('/cli/tickets', {api_key: api_key, board_id: })
//     .then(tickets => {
//       console.log('Here are your Tickets:', tickets);
//     })

app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');
  
  verifyUser.verifyAPIKey();

  // uncomment before going public, presenting to VCs
  // grabBoardId();

});
