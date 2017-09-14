'use strict';
const express = require('express');
const request = require('request');
// const prompt = require('prompt');
// const readline = require('readline');
// const linebyline = require('linebyline');
var axios = require('axios');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();


const app = express();

const PORT = process.env.port || 5000;

let api_key;

// app.use(middleware.morgan('dev'));
// app.use(middleware.bodyParser.urlencoded({extended: false}));
// app.use(middleware.bodyParser.json());

// app.use(express.static(path.join(__dirname, '../public')));

// app.use('/', routes.auth);
// app.use('/api', middleware.auth.verifyElse401, routes.api);


/** SWITCH STATEMENT TO IDENTIFY THE COMMAND TO RUN BASED ON USER INPUT **/
let commandRunner = (command) => {
  switch (command) {
    case 'Create Panel':
      return createPanel();
    default:
      console.log('That operation does not exist! Try again!');
  };
};

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
      api_key = response.data.api_key;
      console.log(response.data);
      commandPrompt();
      //process.stdout.write(response.data);
    })
    .catch(error => {
      process.stdout.write('OOOOPS\n');
      verifyAPIKey();
    });
  });
};

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

// let commandDisplayTicketsOptions = {
//   type: 'list',
//   name: 'displayTicketOptions',
//   message: 'Choose a category to perform an action',
//   choices: ['Panels', 'Tickets']
// }

// let commandDisplayTicketsPrompt = () => {
//   prompt(commandCategoryQuestions)
//     .then(answers => {
//       commandPrompt(answers.commandCategory);
//     })

//     .catch(error => {
//       console.log('ERROR');
//     })
// }

/** TODO: CONSIDER VALIDATING DUE DATE WITH REGEX **/
// let createPanelQuestions = [
//   {
//    type: 'input',
//    name: 'name',
//    message: "New panel name:"
//   },
//   {
//     type: 'input',
//     name: 'due_date',
//     message: 'Panel due date (YYYY-MM-DD):'
//   },
//   {
//     type: 'input',
//     name: 'board_id',
//     message: 'For which board?'
//   }
// ];

// /** CREATE A PANEL FOR A SPECIFIC BOARD **/
// let createPanel = () => {
//   prompt(createPanelQuestions).then(answers => {

//     axios.post('http://localhost:3000/api/panels', answers)
//       .then(response => {
//         console.log('Panel was Created!');
//         commandPrompt();
//       })

//       .catch(error => {
//         console.log('OOOPS! There was an Error creating that panel! Try again!');
//       });
//   });
// }

app.listen(PORT, () => {
  console.log('Welcome to Otter-CLI! Please enter your API key below to continue!');

  verifyAPIKey();

});