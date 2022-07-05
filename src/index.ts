#!/usr/bin/env node

const packageInfo = require('../package.json');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

import { deployMoonCoin, fundAccount, initializeCoin } from './txs';
import { private_key, rest_url, faucet_url } from '../aptos.json';
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
  .name(packageInfo.name)
  .version(packageInfo.version)
  .description(packageInfo.description);

/**
 * Need to write a .config.json file at root, store private key
 */
program.command('init')
  .description('Initial config file')
  .action(() => {
    console.log("a");
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
    const client = new AptosClient(rest_url || REST_URL);
    const privateKey = Uint8Array.from(
      (private_key
        .match(/.{1,2}/g) ?? [''])
        .map((byte) => parseInt(byte, 16))
    );
  
    const account = new AptosAccount(Uint8Array.from(privateKey));
    console.log(account.address().toString());

    await fundAccount(account.address().toString(), rest_url || REST_URL, faucet_url || FAUCET_URL);

    await deployMoonCoin(client, account);

    await initializeCoin(client, account, str.name || 'MoonCoin', str.symbol || 'MOON', str.decimals || '6');
  });

program.command('mint-coin')
  .description('Communicate with Coin module store in AptosFramework::Coin')
  .option('-N, --name <name>', 'Name of coin')
  .option('-S, --symbol <symbol> ', 'Symbol of coin')
  .option('-D, --decimals <decimals> ', 'Decimals of coin')
  .action((str: Object) => {
    console.log(str);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
