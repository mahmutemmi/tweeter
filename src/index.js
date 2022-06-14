const port = 3000;
const express = require('express');
const utils = require('./utils');

utils.ensureParentFoldersExists();
const app = express();
app.use(express.json());
require('./routes.js')(app);
app.listen(port);
console.log(`server listening on port ${port}`);