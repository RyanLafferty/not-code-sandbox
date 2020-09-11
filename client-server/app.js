const express = require('express');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8080;

app.use(compression());
app.use('/', express.static(`${__dirname}/dist`));

app.get('/*', (_req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
