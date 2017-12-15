var PassportJWTService = require('skaffold-auth').AuthenticationService.PassportJWTService;

var authenticationService = new PassportJWTService();

app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());

exports.authenticationService = authenticationService;