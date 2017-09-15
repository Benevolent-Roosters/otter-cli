'use strict';
const express = require('express');
var axios = require('axios');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var readJson = require('read-package-json');
var Promise = require('bluebird');

const app = express();

const PORT = process.env.port || 5000;

let api_key;
let user_id;
let board_id;

// app.use(middleware.morgan('dev'));
// app.use(middleware.bodyParser.urlencoded({extended: false}));
// app.use(middleware.bodyParser.json());

// app.use(express.static(path.join(__dirname, '../public')));

// app.use('/', routes.auth);
// app.use('/api', middleware.auth.verifyElse401, routes.api);

/** READ BOARD URL FROM PACKAGE.JSON **/
let readJSON = Promise.promisify(readJson);

/** SWITCH STATEMENT TO IDENTIFY THE COMMAND TO RUN BASED ON USER INPUT **/
let commandRunner = (command) => {
  switch (command) {
    case 'Display Tickets':
      return ticketDisplayCommandPrompt();
    default:
      console.log('That operation does not exist! Try again!');
  };
};

/** SWITCH STATEMENT SPECIFICALLY FOR TICKET DISPLAY OPTIONS **/
let ticketDisplayCommandRunner = (command) => {
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
let verifyAPIKey = () => {
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
  choices: ['Display Panels', 'Display Tickets', 'Create Ticket', 'Edit Ticket']
};

/** TAKE IN USER INPUTTED COMMAND AND PASS THROUGH SWITCH STATEMENT **/
let commandPrompt = () => {
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
let commandDisplayTicketsOptions = {
  type: 'list',
  name: 'displayTicketsOptions',
  message: 'Choose a category to perform an action',
  choices: ['Display All My Tickets', 'Display All Panel Tickets', 'Display My Panel Tickets']
};

/** TAKE USER INPUTTED DISPLAY TICKET COMMAND AND PASS THROUGH SWITCH STATEMENT **/
let ticketDisplayCommandPrompt = () => {
  prompt(commandDisplayTicketsOptions)
    .then(answers => {
      ticketDisplayCommandRunner(answers.displayTicketsOptions);
    })

    .catch(error => {
      console.log('ERROR');
      commandPrompt();
    })
};

/** GRAB BOARD ID USING GITHUB REPO URL **/
let grabBoardId = () => {
  readJSON('./package.json', console.error, true)
    .then(response => {
      axios.get('http://localhost:3000/cli/board', {params: {repo_url: 'https://github.com/Benevolent-Roosters/thesis', api_key: api_key, user_id: user_id}}) //response.repository.url.slice(4, -4)
        .then(boardInfo => {
          board_id = boardInfo.id;
          console.log('board received:', boardInfo.data);
        })

        .catch(error => {
          console.log('ERROR grabbing board id with repo url:', error.data);
        })
    });
}

/** DISPLAY ALL MY TICKETS **/
// let displayAllMyTickets = () => {
//   axios.get('/cli/tickets', {api_key: api_key, board_id: })
//     .then(tickets => {
//       console.log('Here are your Tickets:', tickets);
//     })

//     .catch(error => {
//       console.log('Error displaying all tickets');
//     });
// }

app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');

  verifyAPIKey();

});



// readJSON('./package.json', console.error, true)
//   .then(response => {
//     console.log(response.repository.url.slice(4, -4));
//   });
