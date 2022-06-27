const express = require('express');
const formidable = require('formidable');

const app = express();
let simpleCache = {}

app.get('/', (req, res) => {
  res.send(`
    <h1>Upload</h1>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
    <h1>Download</h1>
    <form action="/api/download" enctype="multipart/form-data" method="post">
      <div>Filename: <input type="text" name="filename" /></div>
      <input type="submit" value="Download" />
    </form>
  `);
});

app.post('/api/upload', (req, res, next) => {
  const form = formidable({});

  form.uploadDir = __dirname;
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    simpleCache[files.someExpressFiles.originalFilename] = files.someExpressFiles.filepath;
    res.sendStatus(200);
  });
});

app.post('/api/download', (req, res, next) => {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.download(simpleCache[fields.filename], fields.filename)
  });
})

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});
