let commandPrompts = require('./commandPrompts.js');
let MyTickets = require('./actions/MyTickets');
let PanelTickets = require('./actions/PanelTickets');
let MyPanelTickets = require('./actions/MyPanelTickets');

/** SWITCH STATEMENT TO IDENTIFY THE COMMAND TO RUN BASED ON USER INPUT **/
let commandRunner = (command) => {
  switch (command) {
    case 'Display Tickets':
      return commandPrompts.ticketDisplayCommandPrompt();
    default:
      console.log('That operation does not exist! Try again!');
  };
};

/** SWITCH STATEMENT SPECIFICALLY FOR TICKET DISPLAY OPTIONS **/
let ticketDisplayCommandRunner = (command) => {
  switch (command) {
    case 'Display My Tickets':
      return MyTickets.displayAllMyTickets();
    case 'Display Panel Tickets':
      return PanelTickets.displayAllPanelTickets();
    case 'Display My Panel Tickets':
      return MyPanelTickets.displayAllMyPanelTickets();
    default:
      console.log('Something went wrong when displaying tickets!')
  }
};

module.exports.commandRunner = commandRunner;
module.exports.ticketDisplayCommandRunner = ticketDisplayCommandRunner;