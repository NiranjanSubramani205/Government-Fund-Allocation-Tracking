const Token = artifacts.require('Token');
const assert = require('assert');

contract('Token', (accounts) => {
  const BUYER = accounts[1];
  const TICKET_ID = 0;

  it('should allower a user to buy a Token', async () => {
    const instance = await Token.deployed();
    const originalTicket = await instance.tokens(
      TICKET_ID
    );
    await instance.buyToken(TICKET_ID, {
      from: BUYER,
      value: originalTicket.price,
    });
    const updatedTicket = await instance.tokens(TICKET_ID);
    assert.equal(
      updatedTicket.owner,
      BUYER,
      'the buyer should now own this ticket'
    );
  });
});