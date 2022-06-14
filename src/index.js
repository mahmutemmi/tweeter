const port = 3000;
const express = require('express');
const app = express();
require('./routes.js')(app);
app.listen(port);
console.log(`server listening on port ${port}`);