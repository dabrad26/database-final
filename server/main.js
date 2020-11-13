const express = require('express');
const bodyParser = require('body-parser');
const apiServices = require('./api');
const sql = require('./sql');
const { exit } = require('process');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/api', apiServices);

sql.initConnection().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}, error => {
  console.error('Unable to connect to MySQL', error);
  exit(0);
})

