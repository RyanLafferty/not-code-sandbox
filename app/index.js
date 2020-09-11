const express = require('express');
const fs = require('fs');
const cors = require('cors');
const exec = require('child_process').exec;

// constants
const FILE_EXTENSIONS = {
  javascript: 'js',
  ruby: 'rb',
  python: 'py',
  go: 'go',
};

const RUN_COMMANDS = {
  javascript: 'node',
  ruby: 'ruby',
  python: 'python',
  go: 'go run',
};

// environment
const SANDBOX_DIR = process.env.SANDBOX_DIR || './sandbox';

// CORS
const allowedOrigins = [
  'http://localhost:8080',
];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200
};

// express server
const app = express();
const port = process.env.PORT || 8080;

// express plugins
app.use(cors(corsOptions));
app.use(express.json());

// express routes
app.post('/submit', (req, res) => {
  const lang = req.body.data.lang;
  const runCommand = RUN_COMMANDS[lang];
  const testFilePath = `${SANDBOX_DIR}/test.${FILE_EXTENSIONS[lang]}`;

  // write code to file
  fs.writeFile(testFilePath, req.body.data.code, err => {
    if (err) {
      console.error('Could not write test file: ', err);
      throw err;
    }
  });

  // run code
  exec(`${runCommand} ${testFilePath}`, (error, stdout, stderr) => {
    if(error || stderr) {
      console.error('Error encountered when running the test file: ', error);
      console.error('stderr: ', stderr);

      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({data: { error, stderr}}));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({data: { output: stdout }}));
    }

    // delete file
    fs.unlink(testFilePath, (err) => {
      if (err) {
        console.error('Could not delete test file: ', err);
      }
    });
  });
});

// start express server
app.listen(port, () => {
  console.log(`not-code-sandbox-api listening at http://localhost:${port}`);
});
