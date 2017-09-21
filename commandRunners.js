const commandPrompts = require('./commandPrompts.js');
const Panels = require('./actions/Panels');

/** SWITCH STATEMENT TO IDENTIFY THE COMMAND TO RUN BASED ON USER INPUT **/
const commandRunner = (command) => {
  switch (command) {
    case 'Display Panels':
      return Panels.displayBoardPanels();
    case 'Display Tickets':
      return commandPrompts.ticketDisplayCommandPrompt();
    case 'Create Ticket':
      return commandPrompts.createTicketPrompt();
    case 'Edit Ticket':
      return commandPrompts.updateTicketPrompt();
    case 'Close Ticket':
      return commandPrompts.closeTicketPrompt();
    default:
      console.log('That operation does not exist! Try again!');
      commandPrompts.commandPrompt();
  };
};

/** SWITCH STATEMENT SPECIFICALLY FOR TICKET DISPLAY OPTIONS **/
const ticketDisplayCommandRunner = (command) => {
  switch (command) {
    case 'Display My Tickets':
      return commandPrompts.myTicketsPrompt();
    case 'Display Panel Tickets':
      return commandPrompts.panelTicketsPrompt();
    case 'Display My Panel Tickets':
      return commandPrompts.myPanelTicketsPrompt();
    default:
      console.log('Something went wrong when loading ticket display options!')
      commandPrompts.commandPrompt();
  }
};

module.exports.commandRunner = commandRunner;
module.exports.ticketDisplayCommandRunner = ticketDisplayCommandRunner;