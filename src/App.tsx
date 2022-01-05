import React, { useState, useEffect, ChangeEventHandler } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { AbiItem, toWei } from 'web3-utils';
import GETContract from "./contracts/GETUSD.json";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function App() {
  const [walletAddress, setWalletAddress] = useState("");  
  const contractAddress = "0x9070B857b6fA74Dd90Aa5a3e99737F2B1d3F9Fad";
  const [memberAddresses, setMemberAddresses] = useState<any[]>([]);
  const [memberLevel, setMemberLevel] = useState(0);

  async function checkAccount() {
    let web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    setWalletAddress(accounts[0]);
  }

  const connectWallet = async() => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        checkAccount();
      } catch (err) {
        console.log('user did not add account...', err)
      }
    } else {
      checkAccount();
    }
  }

  const test = async() => {
    try {
      if (window.ethereum) {
        await connectWallet();
      }
      let web3 = new Web3(window.ethereum);
      console.log(contractAddress);
      const getContract = new web3.eth.Contract(
        GETContract as AbiItem[],
        contractAddress
      );
      console.log(memberAddresses);
      memberAddresses.forEach(async (item: any) => {
        const response = await getContract.methods.addInMemberList(item, memberLevel).send({from: walletAddress});
      });
      // const response = await getContract.methods.mint().call();
      // console.log(response);
      // console.log(response);
    } catch(e: any) {
      console.log(e);
    }
  }

  const options = [
    { value: '0', label: 'Super'},
    { value: '1', label: 'Special'},
    { value: '2', label: 'Standard'},
  ];
  const defaultOption = options[0];

  let fileReader: any;

  const handleFileRead = (e: any) => {
    console.log('abcd');
    const content = fileReader.result;
    const addresses = content.split('\n');
    const addressList = addresses.map((address: any) => address)
    // console.log(memberAddresses);
    // setMemberAddresses((prevState: any[]) => [...prevState, ...addressList])
    setMemberAddresses(addressList)
    // … do something with the 'content' …
  };
  
  const handleFileChosen = (file: any) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };


  return (
    <div className="App">
      <button onClick={connectWallet} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
      <button onClick={test} className='cta-button'>
        Test
      </button>
      <Dropdown 
        options={options} 
        onChange={level => {
          setMemberLevel(parseInt(level.value));
        }}
        value={defaultOption}
        placeholder="Select an Level of the list" 
      />
      <p>{memberLevel}</p>
      <input
        type='file'
        id='file'
        className='input-file'
        accept='.txt'
        onChange={(e: any) => {
            handleFileChosen(e.target.files[0])
        }}
      />
    </div>
  );

}

export default App;
