const express = require('express');
const bodyParser = require('body-parser');
const apiServices = require('./api');
const sql = require('./sql');
const cors = require('cors')
const { exit } = require('process');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Primary API Routes
app.use('/api', apiServices);

/**
 * Use shared sql class and start connection.
 * If it fails exit with fatal exception.
 * If success print message about listening
 */
sql.initConnection().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}, error => {
  console.error('Unable to connect to MySQL', error);
  exit(1);
})

