const commandPrompts = require('./commandPrompts.js');
const MyTickets = require('./actions/MyTickets');
const PanelTickets = require('./actions/PanelTickets');
const MyPanelTickets = require('./actions/MyPanelTickets');
const displayPanels = require('./actions/displayPanels');

/** SWITCH STATEMENT TO IDENTIFY THE COMMAND TO RUN BASED ON USER INPUT **/
const commandRunner = (command) => {
  switch (command) {
    case 'Display Panels':
      return displayPanels.displayBoardPanels();
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
      return MyTickets.displayAllMyTickets();
    case 'Display Panel Tickets':
      return PanelTickets.displayAllPanelTickets();
    case 'Display My Panel Tickets':
      return MyPanelTickets.displayAllMyPanelTickets();
    default:
      console.log('Something went wrong when loading ticket display options!')
      commandPrompts.commandPrompt();
  }
};

module.exports.commandRunner = commandRunner;
module.exports.ticketDisplayCommandRunner = ticketDisplayCommandRunner;