/* eslint-disable no-console */
import { AptosClient, AptosAccount, FaucetClient, Types, TxnBuilderTypes, HexString } from 'aptos';
import { BCS } from 'aptos/dist/transaction_builder';

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
  // await client.waitForTransaction(transactionRes.hash);
};

export const initializeCoin = async (client: AptosClient, account: AptosAccount, name: string, symbol: string, decimals: string): Promise<void> => {
  const token = new TxnBuilderTypes.TypeTagStruct(
    TxnBuilderTypes.StructTag.fromString(`${account.address().toString()}::MoonCoin::MoonCoin`),
  );

  const serializer = new BCS.Serializer();
  serializer.serializeBool(false);

  const scriptFunctionPayload = new TxnBuilderTypes.TransactionPayloadScriptFunction(
    TxnBuilderTypes.ScriptFunction.natural(
      "0x1::managed_coin",
      "initialize",
      [token],
      [BCS.bcsSerializeStr("Moon Coin"), BCS.bcsSerializeStr("MOON"), BCS.bcsSerializeUint64(6), serializer.getBytes()],
    ),
  );

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(account.address()),
    client.getChainId(),
  ]);

  const rawTxn = new TxnBuilderTypes.RawTransaction(
    TxnBuilderTypes.AccountAddress.fromHex(account.address()),
    BigInt(sequenceNumber),
    scriptFunctionPayload,
    BigInt(1000),
    BigInt(1),
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new TxnBuilderTypes.ChainId(chainId),
  );

  const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
  const pendingTxn = await client.submitSignedBCSTransaction(bcsTxn);

  console.log(pendingTxn.hash);
  // const resources = await client.getAccountResources(account.address());
  // let payload: Types.TransactionPayload = {
  //   type: "script_function_payload",
  //   function: `0x1::ManagedCoin::initialize`,
  //   type_arguments: [`0x${account.address().toString().slice(-64)}::MoonCoin::MoonCoin`],
  //   arguments: [
  //     Buffer.from(name, "utf-8").toString("hex"),
  //     Buffer.from(symbol, "utf-8").toString("hex"),
  //     decimals,
  //     false,
  //   ],
  // };
  
  // const txnRequest = await client.generateTransaction(account.address(), payload);
  // const signedTxn = await client.signTransaction(account, txnRequest);
  // const transactionRes = await client.submitTransaction(signedTxn);
  // return await client.waitForTransaction(transactionRes.hash);
};

export const register = async (client: AptosClient, account: AptosAccount,  coinAddress: string): Promise<void> => {
  const token = new TxnBuilderTypes.TypeTagStruct(
    TxnBuilderTypes.StructTag.fromString(`${account.address().hex()}::MoonCoin::MoonCoin`),
  );

  const scriptFunctionPayload = new TxnBuilderTypes.TransactionPayloadScriptFunction(
    TxnBuilderTypes.ScriptFunction.natural("0x1::coin", "register", [token], []),
  );

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(account.address()),
    client.getChainId(),
  ]);

  const rawTxn = new TxnBuilderTypes.RawTransaction(
    TxnBuilderTypes.AccountAddress.fromHex(account.address()),
    BigInt(sequenceNumber),
    scriptFunctionPayload,
    BigInt(1000),
    BigInt(1),
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new TxnBuilderTypes.ChainId(chainId),
  );

  const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
  const pendingTxn = await client.submitSignedBCSTransaction(bcsTxn);

  console.log(pendingTxn.hash);
};

export const mint = async (client: AptosClient, account: AptosAccount,  coinAddress: string, receiverAddress: HexString, amount: number): Promise<void> => {
  const token = new TxnBuilderTypes.TypeTagStruct(
    TxnBuilderTypes.StructTag.fromString(`0x${coinAddress}::MoonCoin::MoonCoin`),
  );

  const scriptFunctionPayload = new TxnBuilderTypes.TransactionPayloadScriptFunction(
    TxnBuilderTypes.ScriptFunction.natural(
      "0x1::managed_coin",
      "mint",
      [token],
      [BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(receiverAddress.hex())), BCS.bcsSerializeUint64(amount)],
    ),
  );

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(account.address()),
    client.getChainId(),
  ]);

  const rawTxn = new TxnBuilderTypes.RawTransaction(
    TxnBuilderTypes.AccountAddress.fromHex(account.address()),
    BigInt(sequenceNumber),
    scriptFunctionPayload,
    BigInt(1000),
    BigInt(1),
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new TxnBuilderTypes.ChainId(chainId),
  );

  const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
  const pendingTxn = await client.submitSignedBCSTransaction(bcsTxn);
  console.log(pendingTxn.hash);
  // let payload: Types.TransactionPayload = {
  //   type: "script_function_payload",
  //   function: `0x1::ManagedCoin::mint`,
  //   type_arguments: [`0x${coinAddress}::MoonCoin::MoonCoin`],
  //   arguments: [receiverAddress, amount.toString()],
  // };
  
  // const txnRequest = await client.generateTransaction(account.address(), payload);
  // const signedTxn = await client.signTransaction(account, txnRequest);
  // const transactionRes = await client.submitTransaction(signedTxn);
  // return await client.waitForTransaction(transactionRes.hash);
};



