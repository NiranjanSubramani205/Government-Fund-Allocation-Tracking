"use client"
import React, { useState, useEffect } from 'react';
import FundManagerContract from '../../../build/contracts/Funds.json';
import Web3 from 'web3';

const DisplayFundsPage = () => {
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Connect to MetaMask
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          const contractInstance = new web3.eth.Contract(FundManagerContract.abi, FundManagerContract.networks['5777'].address);
          setAccounts(accounts);
          setContract(contractInstance);
          const creatorToFunds = await contractInstance.methods.getFundsByCreator(accounts[0]).call();
          const funds = await Promise.all(creatorToFunds.map(index => contractInstance.methods.funds(index).call()));
          setFunds(funds);
        } else {
          console.error('MetaMask not found');
        }
      } catch (error) {
        console.error(error);
      }
    };
    initialize();
  }, []);

  return (
    <div>
      <h1>My Funds</h1>
       
      <ul>
      {funds.map((fund, index) => (
          <li key={index}>
            <strong>Money:</strong> {Web3.utils.fromWei(fund.money.toString(), 'ether')} Eth,
            <strong>Beneficiaries:</strong> {fund.numberOfBeneficiaries.toString()},
            <strong>Tag:</strong> {fund.tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayFundsPage;
