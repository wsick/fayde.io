var express = require('express'),
    cors = require('cors'),
    app = express(),
    formidable = require('formidable');

app.use(cors());

app.get('/', function (req, res) {
    res.json({name: "uploader"});
});

app.post('/api/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/uploads';
    form.encoding = 'binary';

    form.addListener('file', function (name, file) {
        console.log('file:', name, file);
    });

    form.addListener('end', function () {
        console.log('file completed');
        res.end();
    });

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        } else {
            console.log('parse', fields, files);
        }
    });
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});