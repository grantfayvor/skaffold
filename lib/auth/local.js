var PassportLocalService = require('skaffold-auth').AuthenticationService.PassportLocalService;
var authenticationService = new PassportLocalService();

app.use(authenticationService._passport.initialize());
app.use(authenticationService._passport.session());

exports.authenticationService = authenticationService;