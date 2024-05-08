"use client"
import React, { useEffect } from 'react';
import Web3 from 'web3';
import configuration from '../../build/contracts/Token.json';
const Transaction = () => {
  const CONTRACT_ADDRESS = configuration.networks['5777'].address;
  const CONTRACT_ABI = configuration.abi;

  let web3;
  let contract;
  let account;

  useEffect(() => {
    initializeWeb3();
  }, []);

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
        await startTransaction();
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
      await startTransaction();
    }
    // Non-dapp browsers
    else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const startTransaction = async () => {
    try {
      // Your transaction code goes here
      // Example:
      // const tx = await contract.methods.someMethod().send({ from: account });
      // console.log(tx);
    } catch (error) {
      console.error(error);
    }
  };

  return <div>Transaction Component</div>;
};

export default Transaction;
