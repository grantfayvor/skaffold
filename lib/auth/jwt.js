var PassportJWTService = require('kleek-auth').AuthenticationService.PassportJWTService;

var authenticationService = new PassportJWTService();

app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());

exports.authenticationService = authenticationService;