#!/usr/bin/env node

const packageInfo = require('../package.json');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

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
  .action((str: Object) => {
    console.log(str);
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
