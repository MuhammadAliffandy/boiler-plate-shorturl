require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const dns = require('dns');
const mongoose = require('mongoose');
const UrlModel = require('./urlModel')

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Koneksi MongoDB gagal:', err);
});

db.once('open', () => {
  console.log('Berhasil terhubung ke MongoDB');
});



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl/', (req, res , next) => {

  const original_url = req.body.url;
  const hostname = new URL(original_url).hostname;
  const url_check = original_url.split('/')[0]

  if(url_check != 'https:' && url_check != 'http:' ){
    return res.json({ error:'invalid url'});
  }

  dns.lookup(hostname, (err, address, family) => {
    if (err) {
      return res.json({ error:'invalid url'});
    }
  
    next()
  })

} , (req, res) => {

  const original_url = req.body.url;
  const randomNumber = Math.floor(Math.random() * 1000) + 1;


  if(req.body == null){
    return res.json({
      error:'invalid url'
    })
  }

  const newUser = new UrlModel({
    originalUrl : original_url,
    shortUrl : randomNumber, 
  });
  
  newUser.save()
  .then(() => console.log('User created'))
  .catch((err) => console.log(err));
  

  return res.json({
    original_url: original_url,
    short_url: randomNumber ,
  })

});

app.get('/api/shorturl/:shorturl?' , async (req,res) => {
  const short_url_check = req.params.shorturl;
  if(short_url_check != undefined){

    const results = await UrlModel.findOne({shortUrl : short_url_check});

    if (results == null) {
      return res.json({message: 'invalid short url'})
    } else {
      return res.status(302).redirect(results.originalUrl)
    }

    

  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
