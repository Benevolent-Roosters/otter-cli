# otter-cli
Command line interface for use with Otter.IO

## Installation

`npm install otterio-cli`

The CLI will prompt you for an API key, which can be found on your profile page. 
This can be accessed by clicking on your profile picture in the Otter.IO client.
Within your package.json, add your Github Repo URL like so:

`"repository": {
  "type": "git",
  "url": "git+YOUR_REPO_URL_HERE.git"
}`

## Usage
  After installation, open the command line to a repo you've linked to Otter.IO. Run 'otter cli' to initate the CLI and start editing some boards, ya goof! 

## Operations

#### Display Panels
- Displays information for each of the board’s panels in order of due date, from earliest to latest.

#### Display Panel Tickets
- Displays information for the tickets in a specific panel. Requires an input of Panel ID. To find the Panel ID, use the Display Panels command.

#### Display My Tickets
- Displays information for all of the tickets in the board to which the current user is assigned.

#### Display My Panel Tickets
- Displays information for the tickets in a specific panel to which the current user is assigned. Requires an input of Panel ID. To find the Panel ID, use the Display Panels command.

#### Create Ticket
- Create a ticket with any of the predefined properties.

#### Update Ticket
- Updates one or more fields in an existing ticket. Requires an input of Ticket ID to update. To find the Ticket ID, use the Display My Tickets command.

#### Close Ticket
- Mark a ticket via ID as completed. Requires an input of Ticket ID to close. To find the Ticket ID, use the Display My Tickets command.



