const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 80;

const dict = {};

app.use(bodyParser.text());

app.get('/', (req, res) => {
  res.send('Running.');
});

app.get('/:key', (req, res) => {
	res.send(dict[req.params.key]);
});

app.post('/:key', (req, res) => {
	dict[req.params.key] = req.body;
	res.send('OK');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

