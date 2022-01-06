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

  const addInMemberList = async() => {
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
    } catch(e: any) {
      console.log(e);
    }
  }

  const removeFromMemberList = async() => {
    try {
      if (window.ethereum) {
        await connectWallet();
      }
      let web3 = new Web3(window.ethereum);
      const getContract = new web3.eth.Contract(
        GETContract as AbiItem[],
        contractAddress
      );
      console.log(memberAddresses);
      memberAddresses.forEach(async (item: any) => {
        let isInList = false;
        let memberList = "";
        switch(memberLevel) {
          case 0:
            isInList = await getContract.methods.isInSuperList(item).call();
            memberList = "Super";
            break;

          case 1:
            isInList = await getContract.methods.isInSpecialList(item).call();
            memberList = "Special";
            break;  

          case 2:
            isInList = await getContract.methods.isInStandardList(item).call();
            memberList = "Standard";
            break;
          
          default:
            break;
        }

        if (!isInList) {
          alert(item + "is not in the" + memberList + "member list!");
          continue;
        } else {
          const response = await getContract.methods.removeFromMemberList(item, memberLevel).send({from: walletAddress});
        }
      });
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
    const content = fileReader.result;
    console.log(content);
    const addresses = content.split('\n');
    const addressList = addresses.map((address: any) => address.trim())
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
      <div className="wallet-connect">
        <button onClick={connectWallet} className='cta-button connect-wallet-button'>
          Connect Wallet
        </button>
      </div>
      <div className="file-load">
        <input
          type='file'
          id='file'
          className='input-file'
          accept='.txt'
          onChange={(e: any) => {
              handleFileChosen(e.target.files[0])
          }}
        />
        <Dropdown 
          placeholderClassName='dropdown-placeholder'
          options={options} 
          onChange={level => {
            setMemberLevel(parseInt(level.value));
          }}
          value={defaultOption}
          placeholder="Select an Level of the list" 
        />
      </div>
      <div>
        <button onClick={addInMemberList} className='cta-button add-member-button'>
          Add to member list
        </button>
      </div>
      <div>
        <button onClick={removeFromMemberList} className='cta-button add-member-button'>
          Remove from the list
        </button>

      </div>
      <p>{memberLevel}</p>
    </div>
  );

}

export default App;
