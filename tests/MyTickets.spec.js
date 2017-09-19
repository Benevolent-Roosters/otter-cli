const expect = require('chai').expect;
const sinon = require('sinon');

let myTickets = require('../actions/MyTickets');
let verifyUser = require('../actions/verifyUser');


let globalVars;
let user_id;
let github_handle;
let api_key;
let board_id;

describe('displayAllMyTickets()', () => {
  let sandbox;
  let server;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    server = sandbox.useFakeServer();
    verifyUser.verifyAPIKey();
  })

  afterEach(() => {
    server.restore();
    sandbox.restore();
  })

  it('should return all of a users tickets on a board', () => {
    myTickets.displayAllMyTickets()
      .then(() => {
        expect()
      })
  })
});
