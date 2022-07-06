/* eslint-disable no-console */
import { AptosClient, AptosAccount, FaucetClient, Types } from 'aptos';

export const fundAccount = async (address: string, nodeUrl: string, faucetUrl: string) => {
  const faucetClient = new FaucetClient(nodeUrl, faucetUrl);
  await faucetClient.fundAccount(address, 5000);
};

export const deployMoonCoin = async (client: AptosClient, account: AptosAccount) => {
  const payload: Types.TransactionPayload = {
    type: 'module_bundle_payload',
    modules: [{ bytecode:
      '0x' +
      'a11ceb0b0500000005010002020204070615081b200a3b05000000000000084d6f6f6e436f696e0b64756d6d795f6669656c64' +
      account.address().toString().slice(-64) +
      '000201010100'
    }],
  };
  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  await client.waitForTransaction(transactionRes.hash);
};

export const initializeCoin = async (client: AptosClient, account: AptosAccount, name: string, symbol: string, decimals: string): Promise<void> => {
  const resources = await client.getAccountResources(account.address());
  let payload: Types.TransactionPayload = {
    type: "script_function_payload",
    function: `0x1::ManagedCoin::initialize`,
    type_arguments: [`0x${account.address().toString().slice(-64)}::MoonCoin::MoonCoin`],
    arguments: [
      Buffer.from(name, "utf-8").toString("hex"),
      Buffer.from(symbol, "utf-8").toString("hex"),
      decimals,
      false,
    ],
  };
  console.log(payload);
  
  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  console.log(transactionRes)
  return await client.waitForTransaction(transactionRes.hash);
};

export const register = async (client: AptosClient, account: AptosAccount,  coinAddress: string): Promise<void> => {
  let payload: Types.TransactionPayload = {
    type: "script_function_payload",
    function: `0x1::Coin::register`,
    type_arguments: [`0x${coinAddress}::MoonCoin::MoonCoin`],
    arguments: [],
  };
  console.log(payload);
  
  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  return await client.waitForTransaction(transactionRes.hash);
};

export const mint = async (client: AptosClient, account: AptosAccount,  coinAddress: string, receiverAddress: string, amount: number): Promise<void> => {

  let payload: Types.TransactionPayload = {
    type: "script_function_payload",
    function: `0x1::ManagedCoin::mint`,
    type_arguments: [`0x${coinAddress}::MoonCoin::MoonCoin`],
    arguments: [receiverAddress, amount.toString()],
  };
  console.log(payload);
  
  const txnRequest = await client.generateTransaction(account.address(), payload);
  const signedTxn = await client.signTransaction(account, txnRequest);
  const transactionRes = await client.submitTransaction(signedTxn);
  return await client.waitForTransaction(transactionRes.hash);
};



