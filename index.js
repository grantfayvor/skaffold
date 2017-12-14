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
var status = new Spinner("setting up project ...");

clear();
var processArgv = require('minimist')(process.argv.slice(2));
console.log(
    chalk.yellow(
        figlet.textSync('HERMES', { horizontalLayout: 'full' })
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
        var promise = new Promise(function (resolve, reject) {
            status.start();
        })
            .then(updatePackageJson(options))
            .then(createConfigFile(JSON.stringify(options)))
            .then(copyIndexFile())
            .then(copyRouteFile());

    });
});

function mainSetup(callback) {
    var questions = [
        {
            name: 'name',
            type: 'input',
            default: processArgv._[0] || path.basename(process.cwd()),
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
    try {
        fs.writeFileSync(currentPath + '/config.json', data);
    } catch (error) {
        throw new Error("error occured while saving file. please try again. " + error);
    }
};

var updatePackageJson = function (options) {
    var package = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    package.dependencies = {
        "hermes-main": "1.0.0"
    }
    if (options.auth !== null) {
        package.dependencies = {
            "hermes-main": "1.0.0",
            "hermes-auth": "1.0.0"
        }
    }
    try {
        fs.writeFileSync(currentPath + '/package.json', JSON.stringify(package));
    } catch (error) {
        throw new Error('could not update the package.json. try repeating this process as an administrator. ' + error);
    }
}

var copyIndexFile = function () {
    try {
        var indexData = fs.readFileSync(__dirname + '/lib/main/index.js', 'utf-8');
        var authData = '';
        if (options.auth !== null) {
            authData = getAuthData();
        }
        fs.writeFileSync(currentPath + '/index.js', indexData + '\n\n' + authData);
        fs.mkdirSync(currentPath + '/public');
        fs.writeFileSync(currentPath + '/public/style.css', ' ');
        fs.mkdirSync(currentPath + '/views');
        fs.writeFileSync(currentPath + '/views/index.html', 'Welcome! Do well to edit your index page');
    } catch (error) {
        throw new Error("error occured while trying to copy index file. please try again. " + error);
    }
}

var copyRouteFile = function () {
    try {
        var routeData = fs.readFileSync(__dirname + '/lib/main/routes/route.js', 'utf-8');
        if (options.auth !== null) {
            authRouteData = getAuthRouteData();
        }
        fs.mkdirSync(currentPath + '/routes');
        fs.writeFileSync(currentPath + '/routes/route.js', routeData + '\n\n' + authRouteData);
        setTimeout(function () {
            status.stop();
        }, 50);
    } catch (error) {
        throw new Error("error occured while trying to copy route file. please try again. " + error);
    }
}

var getAuthData = function () {
    var authData = '\n';
    try {
        if (options.auth.type === 'jwt') {
            authData = fs.readFileSync(__dirname + '/lib/auth/jwt.js', 'utf-8');
        } else {
            authData = fs.readFileSync(__dirname + '/lib/auth/local.js', 'utf-8');
        }
        return authData;
    } catch (error) {
        throw new Error("error occured while trying to copy authentication file. please try again. " + error);
        return authData;
    }
}

var getAuthRouteData = function () {
    var authData = '\n';
    try {
        authData = fs.readFileSync(__dirname + '/lib/auth/routes/route.js', 'utf-8');
        return authData;
    } catch (error) {
        throw new Error("error occured while trying to copy authentication file. please try again. " + error);
        return authData;
    }
}