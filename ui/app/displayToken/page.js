"use client"
import React, { useState, useEffect } from 'react';
import FundManagerContract from '../../../build/contracts/Funds.json';
import configuration from '../../../build/contracts/Token.json';
import Web3 from 'web3';

const DisplayTokensForFundPage = () => {
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedFundIndex, setSelectedFundIndex] = useState(null);
  const [funds, setFunds] = useState([]);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
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

  const handleFundSelection = async (index) => {
    setSelectedFundIndex(index);
    if (index !== null && contract && accounts) {
      try {
        const fund = funds[index];
        const tokensForFund = [];
        const numberOfBeneficiaries = parseInt(fund.numberOfBeneficiaries);
        const tokenContractInstance = new web3.eth.Contract(configuration.abi, configuration.networks['5777'].address);
        for (let i = 0; i < numberOfBeneficiaries; i++) {
          const tokenId = await tokenContractInstance.methods.getAvailableTokenId().call();
          const token = await tokenContractInstance.methods.tokens(tokenId).call();
          tokensForFund.push(token);
        }
        setTokens(tokensForFund);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleTokenPurchase = async (tokenId) => {
    try {
      const tokenContractInstance = new web3.eth.Contract(configuration.abi, configuration.networks['5777'].address);
      await tokenContractInstance.methods.buyToken(tokenId).send({ from: accounts[0] });
      // Refresh tokens after purchase
      handleFundSelection(selectedFundIndex);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>My Tokens</h1>
      <select onChange={(e) => handleFundSelection(e.target.value)}>
        <option value={null}>Select Fund</option>
        {funds.map((fund, index) => (
          <option key={index} value={index}>{`Fund ${index}`}</option>
        ))}
      </select>
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>
            <strong>Token ID:</strong> {token.tokenId}, <strong>Owner:</strong> {token.owner}, <strong>Price:</strong> {token.price}
            <button onClick={() => handleTokenPurchase(token.tokenId)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayTokensForFundPage;
