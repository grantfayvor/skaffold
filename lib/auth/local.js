var PassportLocalService = require('kleek-auth').PassportLocalService;
export var authenticationService = new PassportLocalService();

app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());