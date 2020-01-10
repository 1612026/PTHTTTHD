var express = require('express');
var connection = require('../lib/db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
// router.get('/', function (req, res, next) {

//     connection.query('SELECT * FROM HopDong ORDER BY IDHopDong desc', function (err, rows) {

//         if (err) {
//             req.flash('error', err);
//             res.render('hopdongs', { page_title: "Quan ly Hop Dong", data: '' });
//         } else {

//             res.render('hopdongs', { page_title: "Quan ly Hop Dong", data: rows });
//         }

//     });

// });


module.exports = router;