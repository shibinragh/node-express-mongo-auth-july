const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var db;
mongoose.connect('mongodb://shibinragh:password123@ds233571.mlab.com:33571/node-crud-express-mongo');
var db = mongoose.connection;

const Schema = mongoose.Schema;
const UserDetail = new Schema({
    username: String,
    password: String
});
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!") );
app.get('/error', (req, res) => res.send("error logging in") );
passport.serializeUser( function(user, cb){
    cb(null, user.id);
});
passport.deserializeUser( function(id, cb){
    //User.findById( function(id, function(error, user){
    User.findById(id, function(err, user) {
        cb(error, user)
    });
});
passport.use(new LocalStrategy(function(username, password, done){
    UserDetails.findOne({username: username},function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false);
        }
        if(user.password != password ){
            return done(null, false)
        }
        return done(null, user)
    })
}));
app.post('/', passport.authenticate('local', { failureRedirect: '/error'}),function(req, res){
    res.redirect('/success?username='+req.user.username);
});
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/auth.html');
     //console.log (UserDetails.findOne({'username': 'jay'}) );
    //var cursor = db.collection('userInfo').findOne({username: 'jay'});
   // db.collection('userInfo').find().toArray(function(err, results) {
   // console.log(results)
    // send HTML file populated with quotes here
   // })
    //console.log( cursor );
});
//app.get('/', (req, res) => res.sendFile('auth.html',{ root: __dirname}));
 app.put('/update', function(req, res){
     console.log(req.body.username)
 });


const port = process.env.PORT || 3000;
app.listen(port, function(){ console.log('port' + port) });