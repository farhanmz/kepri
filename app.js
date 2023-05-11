const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Connection URL
const url = 'mongodb://127.0.0.1:27017/kepri';

const mongoschema = new mongoose.Schema({
  id_category:String,
  name:String,
  description:String,
  jenis_kontrak:String,
  latitude:Number,
  longitude:Number,
  nilai_kontrak:Number,
  notes:String,
  paket_code:String,
  paket_emon:String,
  penyedia:String,
  progres_deviasi_fisik:String,
  progres_deviasi_keu_fisik:String,
  progres_deviasi_keuangan:String,
  progres_realisasi_fisik:String,
  progres_realisasi_keuangan:String,
  progres_rencana_fisik:String,
  progres_rencana_keuangan:String,
  status:String,
  sumber_dana:String,
  tgl_kontrak:Date,
  tgl_pengumuman:Date,
  img:String,
  tgl_pho:Date
  }, {
    collection:'paket_pekerjaan'
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String
  }, {
    collection:'user'
});

// Connection to database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch((error) => console.log('Database connection error',error));

const User = mongoose.model('User', mongoschema);
const User1 = mongoose.model('User1', userSchema);

// middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// routes
app.get('/', async(req,res) => {
  try{
    const map3 = await User.find();
    console.log(map3)
    const userId = req.session.userId;
    if (!userId) {
      return res.redirect('/login');
    }
    const user = await User1.findById(userId);
    res.render('map', {map4:map3, user:user});
  } catch (error) {
    console.error('Error fetching details:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/signup', async (req, res) => {
  const { name,email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User1({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    req.session.userId = user._id;
    res.redirect('/users');
  } catch (error) {
    console.log(error);
    res.redirect('/signup');
  }
});

app.get('/login', function(req, res) {
  res.render('login', { success_msg: req.flash('success_msg') });
});
  
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User1.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      return res.redirect('/users');
    }
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.redirect('/login');
  }
});

app.get('/users', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await User1.findById(req.session.userId);
    const map3 = await User.find();
    res.render('users', { user:user,map4:map3 });
  } catch (error) {
    console.log(error);
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/details', async(req,res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  try{
    const user = await User1.findById(req.session.userId);
    const q = req.query.q; // get the query parameter q
    const details = await User.findOne({ _id: q }); // find the document with the corresponding ID
    res.render('details', {details:details,q:q,user:user});
  } catch (error) {
    console.error('Error fetching details:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/map', async(req,res) => {
  try{
    const map3 = await User.find();
    console.log(map3)
    res.render('map', {map4:map3});
  } catch (error) {
    console.error('Error fetching details:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/login', async(req,res) => {
  try{
    const login = await User.find();
    console.log(login)
    res.render('login', {login:login});
  } catch (error) {
    console.error('Error fetching details:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/signup', async(req,res) => {
  try{
    const signup = await User.find();
    console.log(signup)
    res.render('signup', {signup:signup});
  } catch (error) {
    console.error('Error fetching details:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profil', function(req, res) {
  res.render('profil');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
