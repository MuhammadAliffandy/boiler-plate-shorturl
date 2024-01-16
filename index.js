require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const dns = require('dns');

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

  res.cookie('originalURL', original_url, { maxAge: 900000, httpOnly: true });
  res.cookie('shortURL', randomNumber, { maxAge: 900000, httpOnly: true });

  return res.json({
    original_url: original_url,
    short_url: randomNumber ,
  })

});

app.get('/api/shorturl/:shorturl?' , (req,res) => {
  const short_url_check = req.params.shorturl;
  if(short_url_check != undefined){
    const ori = req.cookies.originalURL;
    const shrt = req.cookies.shortURL;

    if(parseInt(short_url_check) == shrt ){
      return res.redirect(ori)
    }else{
      return res.json({message: 'invalid short url'})
    }

  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
