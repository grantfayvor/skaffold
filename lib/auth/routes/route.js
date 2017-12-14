var authenticationService = require('../index').authenticationService;

app.post('/api/user/authenticate', authenticationService._passport.authenticate('local', authenticationService._behaviour), function (request, response) {
    response.send(request.user.profile);
});