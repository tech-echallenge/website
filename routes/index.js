var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/summarise', (req, res, next) => {
  console.log(req.body.text);

  // TODO: Send text to APIs, etc...

  res.send("Post done!");
});

module.exports = router;
