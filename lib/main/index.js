var skaffold = require('skaffold-ecommerce');

exports.app = app = skaffold.app;

require('/routes/route');

// app.use(csrfProtection); put back when all is ready