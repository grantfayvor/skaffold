var PassportJWTService = require('hermes-auth').PassportJWTService;

var authenticationService = new PassportJWTService();

app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());