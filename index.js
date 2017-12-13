#!/usr/bin/env node

var chalk = require('chalk');
var clear = require('clear');
var CLI = require('clui');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var path = require('path');
var fs = require('fs');
var Spinner = CLI.Spinner;
var options = {};

var currentPath = path.resolve(process.cwd());

clear();
var minimist = require('minimist')(process.argv.slice(2));
console.log(
  chalk.yellow(
    figlet.textSync('SCAFFOLD', { horizontalLayout: 'full' })
  )
);

mainSetup(function (primaryArgs) {
  options = primaryArgs;
  authSetup(primaryArgs.auth, function (secondaryArgs) {
    if (options.auth === 'true') {
      options.auth = secondaryArgs;
    } else {
      options = secondaryArgs;
    }
    createConfigFile(JSON.stringify(options));
  });
});

function mainSetup(callback) {
  var questions = [
    {
      name: 'name',
      type: 'input',
      default: minimist._[0] || path.basename(process.cwd()),
      message: 'Enter your project\'s name: ',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your project\'s name';
        }
      }
    },
    {
      name: 'ecmascript',
      type: 'list',
      choices: ['es6', 'es5'],
      message: 'Enter your ECMASCRIPT version: ',
      default: 'es5'
    },
    {
      name: 'auth',
      type: 'list',
      choices: ['true', 'false'],
      message: 'Do you want to use authentication? ',
      default: 'false'
    }
  ];
  inquirer.prompt(questions).then(callback);
}

function authSetup(useAuth, callback) {
  if (useAuth === 'true') {
    var questions = [
      {
        name: 'type',
        type: 'list',
        choices: ['local', 'jwt'],
        default: 'local',
        message: 'Which kind of authentication do you prefer? '
      }
    ];
    inquirer.prompt(questions).then(callback);
  } else {
    options.auth = null;
    callback(options);
  }
}

var createConfigFile = function (data) {
  var status = new Spinner("creating config file ...");
  status.start();
  try {
    fs.writeFileSync(currentPath + '/config.json', data);
    status.stop();
  } catch (error) {
    throw new Error("error occured while saving file. please try again." + error);
  }
};