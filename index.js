require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

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
app.post('/api/shorturl/', function(req, res) {

  const original_url = req.body.url;
  const randomNumber = Math.floor(Math.random() * 1000) + 1;
  const url_checked = original_url.split('/');
  
  if(url_checked[0] != 'https:'){
    return res.json({
      error:'invalid url'
    })
  }

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

app.get('/api/shorturl/:short_url?' , (req,res) => {
  const short_url_check = req.params.short_url;
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
