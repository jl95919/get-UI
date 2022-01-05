import React, { useState, useEffect, ChangeEventHandler } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { AbiItem, toWei } from 'web3-utils';
import GETContract from "./contracts/GETUSD.json";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  // const [presaleldAmount, setPresaledAmount] = useState(0);
  // const [remainAmount, setRemainAmount] = useState(0);
  
  const contractAddress = "0x9070B857b6fA74Dd90Aa5a3e99737F2B1d3F9Fad";

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
      const response = await getContract.methods.name().call();
      console.log(response);
      // console.log(response);
    } catch(e: any) {
      console.log(e);
    }

  }

  // const airdrop = async() => {
  //   try {
  //     if (window.ethereum) {
  //       await connectWallet();
  //     }
  //     let web3 = new Web3(window.ethereum);
  //     console.log(contractAddress);
  //     const presaleContract = new web3.eth.Contract(
  //       PresaleContract as AbiItem[],
  //       contractAddress
  //     );
  //     const response: boolean = await presaleContract.methods.airdrop().send({ from: walletAddress });
  //     console.log(response);
  //   } catch(e: any) {
  //     console.log(e);
  //   }
  // }

  // const getPresaledAmount = async() => {
  //   try {
  //     let web3 = new Web3(window.ethereum);
  //     const presaleContract = new web3.eth.Contract(
  //       PresaleContract as AbiItem[],
  //       contractAddress
  //     );
  //     const response = await presaleContract.methods.getPresaledCnt().call();
  //     setPresaledAmount(response / 10 ** 18);
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

  // const getRemainPresalAmount = async() => {
  //   try {
  //     let web3 = new Web3(window.ethereum);
  //     const presaleContract = new web3.eth.Contract(
  //       PresaleContract as AbiItem[],
  //       contractAddress
  //     );
  //     const response = await presaleContract.methods.getRemainPresaleCnt().call();
  //     setRemainAmount(response / 10 ** 18);
  //   } catch(e) { 
  //     console.log(e);
  //   }

  // }

  // const buyToken = async() => {
  //   try {
  //     if (window.ethereum) {
  //       await connectWallet();
  //     }
  //     let web3 = new Web3(window.ethereum);

  //     const presaleContract = new web3.eth.Contract(
  //       PresaleContract as AbiItem[],
  //       contractAddress
  //     );

  //     const amount = buyAmount; 
  //     const price = 0.00001875 * amount;
  //     console.log(contractAddress);
  //     const response = await presaleContract.methods.prisale(amount).send({ 
  //       from: walletAddress,
  //       value: toWei(price.toString(), "ether"),
  //       gas: 300000,
  //     });
  //     console.log(response);
  //     console.log("buyToken end");
  //   } catch(e: any) {
  //     console.log(e);
  //   }
  // }

  // const handleAmountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setBuyAmount(Number(e.target.value));
  // };

  

  return (
    <div className="App">
      <button onClick={connectWallet} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
      <button onClick={test} className='cta-button'>
        Test
      </button>
    </div>
  );
}

export default App;
