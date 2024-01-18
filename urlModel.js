// urlModel.js
const mongoose = require('mongoose');

// Skema untuk koleksi "url"
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: Number,
});

// Model untuk koleksi "url"
const UrlModel = mongoose.model('url', urlSchema);

module.exports = UrlModel;
