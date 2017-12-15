var skaffold = require('skaffold-main');

exports.app = app = skaffold.app;

require('/routes/route');

// app.use(csrfProtection); put back when all is ready