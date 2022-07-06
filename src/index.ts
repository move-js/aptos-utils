#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

import * as fs from 'fs';
import { deployMoonCoin, fundAccount, initializeCoin, register, mint } from './txs';
import { AptosAccount, AptosClient } from 'aptos';

const REST_URL = 'https://fullnode.devnet.aptoslabs.com';
const FAUCET_URL = 'https://faucet.devnet.aptoslabs.com';

clear();

console.log(
  chalk.grey(
    figlet.textSync('aptos utils', { horizontalLayout: 'full' })
  )
);

program
  .name('aptos-utils')
  .version('0.0.1')
  .description('CLI for aptos-utils');

/**
 * Need to write a .config.json file at root, store private key
 */
program.command('init')
  .description('Initial config file')
  .option('-N, --network <name>', 'Network')
  .action(async (str: { network: string }) => {
    await fs.writeFileSync(`${process.cwd()}/aptos-utils.json`, JSON.stringify({
      private_key: "",
      rest_url: "",
      faucet_url: ""
    }));
    const acountPath = `${process.cwd()}/aptos-utils.json`;
    // @ts-ignore
    const info = JSON.parse(await fs.readFileSync(acountPath));

    const account = new AptosAccount();
    const key = account.toPrivateKeyObject();
    info.private_key = key.privateKeyHex;
    info.rest_url = str.network === 'devnet' ? REST_URL : null;
    info.faucet_url = str.network === 'devnet' ? FAUCET_URL : null;
    await fs.writeFileSync(acountPath, JSON.stringify(info, null, 2));
    console.log(`Initialized account. ☼☽`);
  });

/**
 * Coin command
 */

program.command('create-coin')
  .description('Communicate with Coin module store in AptosFramework::Coin')
  .option('-N, --name <name>', 'Name of coin')
  .option('-S, --symbol <symbol> ', 'Symbol of coin')
  .option('-D, --decimals <decimals> ', 'Decimals of coin')
  .action(async (str: { name?: string, symbol?: string, decimals?: string }) => {
    const { private_key, rest_url, faucet_url } = require(`${process.cwd()}/aptos-utils.json`);

    const client = new AptosClient(rest_url || REST_URL);
    const privateKey = Uint8Array.from(
      (private_key
        .match(/.{1,2}/g) ?? [''])
        .map((byte: any) => parseInt(byte, 16))
    );
  
    const account = new AptosAccount(Uint8Array.from(privateKey));

    await fundAccount(account.address().toString(), rest_url || REST_URL, faucet_url || FAUCET_URL);

    await deployMoonCoin(client, account);

    await initializeCoin(client, account, str.name || 'MoonCoin', str.symbol || 'MOON', str.decimals || '6');
  });

program.command('register')
  .description('Register to receive new coin')
  .option('-C, --coinAddress <coinAddress> ', 'Coin address')
  .action(async (str: { coinAddress: string }) => {
    const { private_key, rest_url, faucet_url } = require(`${process.cwd()}/aptos-utils.json`);

    const client = new AptosClient(rest_url || REST_URL);
    const privateKey = Uint8Array.from(
      (private_key
        .match(/.{1,2}/g) ?? [''])
        .map((byte: any) => parseInt(byte, 16))
    );
  
    const account = new AptosAccount(Uint8Array.from(privateKey));

    await fundAccount(account.address().toString(), rest_url || REST_URL, faucet_url || FAUCET_URL);
    await register(client, account, str.coinAddress)

  });


program.command('mint-coin')
  .description('Mint coin')
  .option('-C, --coinAddress <coinAddress> ', 'Coin address')
  .option('-R, --receiverAddress <receiverAddress> ', 'Receiver address')
  .option('-A, --amount <amount> ', 'Amount of coin')
  .action(async (str: { coinAddress: string, receiverAddress: string, amount: number }) => {
    const { private_key, rest_url, faucet_url } = require(`${process.cwd()}/aptos-utils.json`);

    const client = new AptosClient(rest_url || REST_URL);
    const privateKey = Uint8Array.from(
      (private_key
        .match(/.{1,2}/g) ?? [''])
        .map((byte: any) => parseInt(byte, 16))
    );
  
    const account = new AptosAccount(Uint8Array.from(privateKey));

    await fundAccount(account.address().toString(), rest_url || REST_URL, faucet_url || FAUCET_URL);
    await mint(client, account, str.coinAddress, str.receiverAddress, str.amount)

  });


program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}



