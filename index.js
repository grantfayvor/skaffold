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
        figlet.textSync('SKaFFOLD', { horizontalLayout: 'full' })
    )
);

mainSetup(function (primaryArgs) {
    options = primaryArgs;
    databaseSetUp(function (databaseArgs) {
        options.database = databaseArgs;
        authSetup(options.auth, function (authArgs) {
            if (options.auth === 'yes') {
                options.auth = authArgs;
            } else {
                options = authArgs;
            }
            var promise = new Promise(function (resolve, reject) {
                status.start();
            })
                .then(updatePackageJson(options))
                .then(createConfigFile(JSON.stringify(options)))
                .then(makeDirectories())
                .then(copyIndexFiles())
                .then(copyRouteFile())
                .then(copyModels());

        });
    });
});

function mainSetup(callback) {
    var questions = [
        {
            name: 'name',
            type: 'input',
            default: processArgv._[0] || path.basename(process.cwd()),
            message: 'Enter your projects name: ',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your projects name';
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
            name: 'database',
            type: 'list',
            choices: ['yes'],
            message: 'Press enter at this point for database.',
            default: 'yes'
        },
        {
            name: 'auth',
            type: 'list',
            choices: ['yes', 'no'],
            message: 'Do you want to use authentication? ',
            default: 'no'
        }
    ];
    inquirer.prompt(questions).then(callback);
}

function databaseSetUp(callback) {
    var questions = [
        {
            name: 'host',
            type: 'input',
            message: 'Enter your sql connection host: ',
            default: '127.0.0.1'
        },
        {
            name: 'port',
            type: 'input',
            message: 'Enter your sql connection port: ',
            default: '3306'
        },
        {
            name: 'name',
            type: 'input',
            message: 'Enter your database name: ',
            default: processArgv._[0] || path.basename(process.cwd())
        },
        {
            name: 'username',
            type: 'input',
            message: 'Enter your sql connection username: ',
            default: 'root'
        },
        {
            name: 'password',
            type: 'input',
            message: 'Enter your sql connection password: ',
            default: ''
        }
    ];

    inquirer.prompt(questions).then(callback);
}

function authSetup(useAuth, callback) {
    if (useAuth === 'yes') {
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
        delete options.auth;
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
    var package = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    if (package.dependencies) {
        package.dependencies["skaffold-ecommerce"] = "^1.0.0";
    } else {
        package.dependencies = {
            "skaffold-ecommerce": "^1.0.0"
        };
    }
    if (options.auth) {
        package.dependencies["skaffold-auth"] = "^1.0.0";
    }
    try {
        fs.writeFileSync(currentPath + '/package.json', JSON.stringify(package));
    } catch (error) {
        throw new Error('could not update the package.json. try repeating this process as an administrator. ' + error);
    }
}

var makeDirectories = function () {
    fs.mkdirSync(currentPath + '/models');
    fs.mkdirSync(currentPath + '/routes');
    fs.mkdirSync(currentPath + '/public');
    fs.mkdirSync(currentPath + '/views');
}

var copyIndexFiles = function () {
    try {
        var indexData = fs.readFileSync(__dirname + '/lib/main/index.js', 'utf8');
        var authData = '';
        if (options.auth) {
            authData = getAuthData();
        }
        var routeData = fs.readFileSync(__dirname + '/lib/main/routes/index.js', 'utf8');
        fs.writeFileSync(currentPath + '/index.js', indexData + '\n\n' + authData + '\n\n' + routeData);
        fs.writeFileSync(currentPath + '/public/style.css', ' ');
        fs.writeFileSync(currentPath + '/views/index.html', 'Welcome! Do well to edit your index page');
    } catch (error) {
        throw new Error("error occured while trying to copy index file. please try again. " + error);
    }
}

var copyRouteFile = function () {
    try {
        var routeData = fs.readFileSync(__dirname + '/lib/main/routes/route.js', 'utf8');
        var authRouteData = {};
        if (options.auth) {
            authRouteData = getAuthRouteData();
            fs.writeFileSync(currentPath + '/routes/route.js', authRouteData);
        } else {
            fs.writeFileSync(currentPath + '/routes/route.js', routeData /* + '\n\n' + authRouteData */);
        }
    } catch (error) {
        throw new Error("error occured while trying to copy route file. please try again. " + error);
    }
}

var copyModels = function () {
    try {
        var model = fs.readFileSync(__dirname + '/lib/main/models/product.json', 'utf8');
        fs.writeFileSync(currentPath + '/models/product.json', model);
        model = fs.readFileSync(__dirname + '/lib/main/models/category.json', 'utf8');
        fs.writeFileSync(currentPath + '/models/category.json', model);
        model = fs.readFileSync(__dirname + '/lib/main/models/user.json', 'utf8');
        fs.writeFileSync(currentPath + '/models/user.json', model);
        setTimeout(function () {
            status.stop();
        }, 100);
    } catch (error) {
        throw new Error("error occured while trying to copy model file. Please try again. " + error);
    }
}

var getAuthData = function () {
    var authData = '\n';
    try {
        if (options.auth.type === 'jwt') {
            authData = fs.readFileSync(__dirname + '/lib/auth/jwt.js', 'utf8');
        } else {
            authData = fs.readFileSync(__dirname + '/lib/auth/local.js', 'utf8');
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
        authData = fs.readFileSync(__dirname + '/lib/auth/routes/route.js', 'utf8');
        return authData;
    } catch (error) {
        throw new Error("error occured while trying to copy authentication file. please try again. " + error);
        return authData;
    }
}