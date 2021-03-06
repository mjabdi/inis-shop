const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const apiRouter = require('./routes/api-router');

const apiSecurity = require('./middleware/api-security');
const mongodb = require('./mongodb');
const cors = require('cors');

const app = express();

mongodb();

app.use(cors({
  credentials: true,
}));

app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', apiSecurity() , apiRouter);

app.get('/*', function (req, res) {
    res.status(404).send('invalid endpoint');
    res.end();
 });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
