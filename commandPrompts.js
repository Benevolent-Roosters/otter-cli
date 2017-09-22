const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const runner = require('./commandRunners.js');
const createTicket = require('./actions/createTicket');
const updateTicket = require('./actions/updateTicket');
const verifyUser = require('./actions/verifyUser');
const Panels = require('./actions/Panels');
const PanelTickets = require('./actions/PanelTickets');
const MyPanelTickets = require('./actions/MyPanelTickets');

/** GLOBAL VARIABLES **/
let globalVars;
let user_id;
let github_handle;
let board_id;

/** SET GLOBAL VARIABLES **/
const setGlobalVariables = () => {
  globalVars = verifyUser.exportGlobals();
  user_id = globalVars.user_id;
  github_handle = globalVars.github_handle;
  board_id = globalVars.board_id;
};

/** VERIFY INITIAL COMMAND PROMPT QUESTION INFO **/
const commandPromptQuestions = {
  type: 'list',
  name: 'command',
  message: 'Select an operation',
  choices: ['Display Panels', 'Display Tickets', 'Create Ticket', 'Edit Ticket', 'Close Ticket']
};

/** VERIFY DISPLAY TICKET COMMAND PROMPT QUESTION INFO **/
const commandDisplayTicketsOptions = {
  type: 'list',
  name: 'displayTicketsOptions',
  message: 'Select a display option',
  choices: ['Display My Tickets', 'Display Panel Tickets', 'Display My Panel Tickets']
};

/** TAKE IN USER INPUTTED COMMAND AND PASS THROUGH SWITCH STATEMENT **/
const commandPrompt = () => {
  prompt(commandPromptQuestions)
    .then(answers => {
      runner.commandRunner(answers.command);
    })

    .catch(error => {
      console.log('There was an error with this command: ', error);
      commandPrompt();
    });
};

/** TAKE USER INPUTTED DISPLAY TICKET COMMAND AND PASS THROUGH SWITCH STATEMENT **/
module.exports.ticketDisplayCommandPrompt = () => {
  prompt(commandDisplayTicketsOptions)
    .then(answers => {
      runner.ticketDisplayCommandRunner(answers.displayTicketsOptions);
    })

    .catch(error => {
      console.log('There was an error with this command: ', error);
      commandPrompt();
    });
};

module.exports.panelTicketsPrompt = () => {
  Panels.fetchBoardPanels()
    .then((panels) => {
      return prompt({type: 'list', name: 'ticketPanel', message: 'Select Panel:', choices: panels.map((panel) => `${panel.id}| ${panel.name}`)});
    })
    .then(answer => {
      PanelTickets.displayAllPanelTickets(answer.ticketPanel.split('|')[0]);
    });
};

module.exports.myPanelTicketsPrompt = () => {
  Panels.fetchBoardPanels()
    .then((panels) => {
      return prompt({type: 'list', name: 'ticketPanel', message: 'Select Panel:', choices: panels.map((panel) => `${panel.id}| ${panel.name}`)});
    })
    .then(answer => {
      MyPanelTickets.displayMyPanelTickets(answer.ticketPanel.split('|')[0]);
    });
};

/** BUILD NEW TICKET OBJECT FROM USER INPUT **/
module.exports.createTicketPrompt = () => {
  !globalVars ? setGlobalVariables() : '';
  let newTicket = {creator_id: user_id};

  Panels.fetchBoardPanels()
    .then((panels) => {
      return prompt({type: 'list', name: 'ticketPanel', message: 'Select Panel:', choices: panels.map((panel) => `${panel.id}| ${panel.name}`)});
    })
    .then(answer => {
      newTicket.panel_id = parseInt(answer.ticketPanel.split('|')[0]);
      return prompt({type: 'input', name: 'ticketTitle', message: 'Title:'});
    })
    .then(answer => {
      newTicket.title = answer.ticketTitle;
      return prompt({type: 'input', name: 'ticketDescription', message: 'Description:'});
    })
    .then(answer => {
      newTicket.description = answer.ticketDescription;
      return prompt({type: 'list', name: 'ticketType', message: 'Type:', choices: ['bug', 'devops', 'feature']});
    })
    .then(answer => {
      newTicket.type = answer.ticketType;
      return prompt({type: 'list', name: 'ticketStatus', message: 'Status:', choices: ['not started', 'in progress', 'complete']});
    })
    .then(answer => {
      newTicket.status = answer.ticketStatus;
      return prompt({type: 'list', name: 'ticketPriority', message: 'Priority:', choices: ['1', '2', '3']});
    })
    .then(answer => {
      newTicket.priority = parseInt(answer.ticketPriority);
      return prompt({type: 'input', name: 'ticketAssignee', message: 'Assignee Handle:', default: github_handle});
    })
    .then(answer => {
      newTicket.assignee_handle = answer.ticketAssignee;
      return prompt({type: 'confirm', name: 'ticketConfirm', message: 'Everything look okay?'});
    })
    .then(answer => {
      if (answer.ticketConfirm) {
        createTicket.createTicket(newTicket);
      }
      if (!answer.ticketConfirm) {
        console.log('Ticket abandoned! Sad!');
        commandPrompt();
      }
    })

    .catch(error => {
      console.log('Error creating ticket: ', error);
      commandPrompt();
    });
};

/** BUILD NEW TICKET OBJECT FROM USER INPUT; USE ORIGINAL TICKET VALUES AS DEFAULTS **/
module.exports.updateTicketPrompt = () => {
  !globalVars ? setGlobalVariables() : '';
  let newTicket = {};
  let oldTicket;

  prompt({type: 'input', name: 'ticketId', message: 'Ticket ID:'})
    .then(answer => {
      newTicket.id = answer.ticketId;
      return updateTicket.fetchTicket(answer.ticketId);
    })
    .then(ticket => {
      oldTicket = ticket;
      newTicket.panel_id = ticket.panel_id.toString();
      return prompt({type: 'input', name: 'ticketTitle', message: 'Title:', default: oldTicket.title});
    })
    .then(answer => {
      newTicket.title = answer.ticketTitle;
      return prompt({type: 'input', name: 'ticketDescription', message: 'Description:', default: oldTicket.description});
    })
    .then(answer => {
      newTicket.description = answer.ticketDescription;
      return prompt({type: 'list', name: 'ticketType', message: 'Type:', choices: ['bug', 'devops', 'feature'], default: oldTicket.type});
    })
    .then(answer => {
      newTicket.type = answer.ticketType;
      return prompt({type: 'list', name: 'ticketStatus', message: 'Status:', choices: ['not started', 'in progress', 'complete'], default: oldTicket.status});
    })
    .then(answer => {
      newTicket.status = answer.ticketStatus;
      return prompt({type: 'list', name: 'ticketPriority', message: 'Priority:', choices: ['1', '2', '3'], default: oldTicket.priority});
    })
    .then(answer => {
      newTicket.priority = parseInt(answer.ticketPriority);
      return prompt({type: 'input', name: 'ticketAssignee', message: 'Assignee Handle:', default: github_handle, default: oldTicket.assignee_handle});
    })
    .then(answer => {
      newTicket.assignee_handle = answer.ticketAssignee;
      return prompt({type: 'confirm', name: 'ticketConfirm', message: 'Everything look okay?'});
    })
    .then(answer => {
      if (answer.ticketConfirm) {
        updateTicket.updateTicket(newTicket);
      }
      if (!answer.ticketConfirm) {
        console.log('Ticket abandoned! Sad!');
        commandPrompt();
      }
    })

    .catch(error => {
      console.log('Error updating ticket: ', error);
      // TO FIX: Displays duplicate prompts
      commandPrompt();
    });
};

module.exports.closeTicketPrompt = () => {

  !globalVars ? setGlobalVariables() : '';

  prompt({type: 'input', name: 'ticketId', message: 'Ticket ID:'})
    .then(answer => {
      return updateTicket.fetchTicket(answer.ticketId);
    })
    .then(ticket => {
      if (ticket.status === 'complete') {
        throw 'Ticket already closed!';
      }
      // delete updated_at field to prevent rejection by server
      delete ticket.updated_at;
      delete ticket.created_at;
      ticket.status = 'complete';
      return updateTicket.updateTicket(ticket);
    })
    .catch(error => {
      console.log('Error closing ticket: ', error);
      commandPrompt();
    });
};

module.exports.commandPrompt = commandPrompt;
