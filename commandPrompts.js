const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
let runner = require('./commandRunners.js');

/** VERIFY INITIAL COMMAND PROMPT QUESTION INFO **/
const commandPromptQuestions = {
  type: 'list',
  name: 'command',
  message: 'What operation do you want to perform next?',
  choices: ['Display Panels', 'Display Tickets', 'Create Ticket', 'Edit Ticket']
};

/** VERIFY DISPLAY TICKET COMMAND PROMPT QUESTION INFO **/
const commandDisplayTicketsOptions = {
  type: 'list',
  name: 'displayTicketsOptions',
  message: 'Choose a category to perform an action',
  choices: ['Display My Tickets', 'Display Panel Tickets', 'Display My Panel Tickets']
};

/** TAKE IN USER INPUTTED COMMAND AND PASS THROUGH SWITCH STATEMENT **/
let commandPrompt = () => {
  prompt(commandPromptQuestions)
    .then(answers => {
      runner.commandRunner(answers.command);
    })

    .catch(error => {
      console.log('There was an error with this command! Try again');
      commandPrompt();
    })
};

/** TAKE USER INPUTTED DISPLAY TICKET COMMAND AND PASS THROUGH SWITCH STATEMENT **/
let ticketDisplayCommandPrompt = () => {
  prompt(commandDisplayTicketsOptions)
    .then(answers => {
      runner.ticketDisplayCommandRunner(answers.displayTicketsOptions);
    })

    .catch(error => {
      console.log('ERROR');
      commandPrompt();
    })
};

module.exports.commandPrompt = commandPrompt;
module.exports.ticketDisplayCommandPrompt = ticketDisplayCommandPrompt;