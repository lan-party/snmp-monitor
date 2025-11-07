const { createServer } = require('https');
var fs = require('fs');
const { parse } = require('url');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const port = 8444;
const app = next({ dev });
const handle = app.getRequestHandler();

var options = {
  key: fs.readFileSync(process.env.KEY_FILE),
  cert: fs.readFileSync(process.env.CERT_FILE),
  ca: [fs.readFileSync(process.env.CERT_FILE)]
};

app.prepare().then(() => {
  createServer(options, (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === '/a') {
      app.render(req, res, '/a', query);
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`);
  })
});