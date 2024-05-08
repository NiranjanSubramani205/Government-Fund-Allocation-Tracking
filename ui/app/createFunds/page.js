"use client"
import React, { useState ,useEffect} from 'react';
import FundManagerContract from '../../../build/contracts/Funds.json';
import Web3 from 'web3';

const CreateFundPage = () => {
  const [money, setMoney] = useState(0);
  const [numberOfBeneficiaries, setNumberOfBeneficiaries] = useState(0);
  const [tag, setTag] = useState('');
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

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
        } else {
          console.error('MetaMask not found');
        }
      } catch (error) {
        console.error(error);
      }
    };
    initialize();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contract.methods.createFund(money, numberOfBeneficiaries, tag).send({ from: accounts[0] });
      alert('Fund created successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to create fund.');
    }
  };

  return (
    <div>
      <h1>Create Fund</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Money:</label>
          <input type="number" value={money} onChange={(e) => setMoney(e.target.value)} className='text-black' required />
        </div>
        <div>
          <label>Number of Beneficiaries:</label>
          <input type="number" value={numberOfBeneficiaries} onChange={(e) => setNumberOfBeneficiaries(e.target.value)} className='text-black' required />
        </div>
        <div>
          <label>Tag:</label>
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className='text-black' required />
        </div>
        <button type="submit">Create Fund</button>
      </form>
    </div>
  );
};

export default CreateFundPage;
