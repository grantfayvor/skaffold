var PassportLocalService = require('hermes-auth').PassportLocalService;
export var authenticationService = new PassportLocalService();

app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());