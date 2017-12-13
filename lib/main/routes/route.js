var app = require('../index').app;

app.get('/', function (request, response) {
    return response.send("Welcome to your new scaffolded app. <3");
});