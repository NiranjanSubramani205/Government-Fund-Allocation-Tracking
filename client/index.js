import Web3 from 'web3';
import configuration from '../build/contracts/Token.json';
import 'bootstrap/dist/css/bootstrap.css';
import ticketImage from './images/ticket.png';

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

let web3;
let contract;
let account;

const accountEl = document.getElementById('account');
const ticketsEl = document.getElementById('tickets');
const TOTAL_TICKETS = 10;
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

const initializeWeb3 = async () => {
  // Modern dapp browsers
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Accounts now exposed
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      accountEl.innerText = account;
      await refreshTickets();
    } catch (error) {
      console.error(error);
    }
  }
  // Legacy dapp browsers
  else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
    // Accounts always exposed
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    accountEl.innerText = account;
    await refreshTickets();
  }
  // Non-dapp browsers
  else {
    alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

const buyTicket = async (ticket) => {
  try {
    await contract.methods
      .buyToken(ticket.id)
      .send({ from: account, value: ticket.price });
    await refreshTickets();
  } catch (error) {
    console.error(error);
  }
};

const refreshTickets = async () => {
  ticketsEl.innerHTML = '';
  for (let i = 0; i < TOTAL_TICKETS; i++) {
    const ticket = await contract.methods.tokens(i).call();
    ticket.id = i;
    if (ticket.owner === EMPTY_ADDRESS) {
      const ticketEl = createElementFromString(
        `<div class="ticket card" style="width: 18rem;">
          <img src="${ticketImage}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Ticket</h5>
            <p class="card-text">${
              ticket.price / 1e18
            } Eth</p>
            <button class="btn btn-primary">Buy Ticket</button>
          </div>
        </div>`
      );
      ticketEl.onclick = () => buyTicket(ticket);
      ticketsEl.appendChild(ticketEl);
    }
  }
};

initializeWeb3();
