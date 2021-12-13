const path = require('path');

const express = require('express');
const session = require('express-session');
const csrf = require('csurf');
const sessionConfig = require('./config/session')
const db = require('./data/database');
const authRoutes = require('./routes/auth');                                            //import auth.js file
const blogRoutes = require('./routes/blog');


const mongoDbSessionStore = sessionConfig.createSessionStore(session);

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));
app.use(csrf());

app.use(async function(req, res, next) {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next();
  }

  res.locals.isAuth = isAuth;

  next();
});
app.use(authRoutes);                                                                //use the auth.js file routes
app.use(blogRoutes);


app.use(function(error, req, res, next) {
  res.render('500');
})

db.connectToDatabase().then(function () {
  app.listen(3000);
});
