const path = require('path');
const express = require('express');
const app = express();
const cfg = require('./config.json');
const router = require('./router');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/doc', express.static('doc'));
app.use('/editor', express.static('editor'));
app.use('/api', express.static(path.resolve(cfg.apiPath)));

router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send({ code: 404, msg: 'Sorry cant find that!' });
  // var err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

app.listen(cfg.port, function () {
  console.log(`Swagger listening on port ${cfg.port}!`);
});
