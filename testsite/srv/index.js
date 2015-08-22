var express = require('express'),
    multer = require('multer'),
    cors = require('cors'),
    app = express(),
    upload = multer({dest: './uploads'});

app.use(cors());

app.get('/', function (req, res) {
    res.json({name: "uploader"});
});

app.post('/api/upload', upload.single('file'), function (req, res) {
    console.log(req.file);
    console.log("Hit upload endpoint.");
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});