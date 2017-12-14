var kleek = require('kleek-main');

exports.app = app = kleek.app;

require('/routes/route');

// app.use(csrfProtection); put back when all is ready