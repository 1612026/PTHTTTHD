var express = require('express');
var connection = require('../lib/db');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
//   });
router.get('/', function (req, res, next) {

    connection.query('SELECT * FROM HopDong ORDER BY TrangThai desc', function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('hopdongs', { page_title: "Quan ly Hop Dong", data: '' });
        } else {

            res.render('hopdongs', { page_title: "Quan ly Hop Dong", data: rows });
        }

    });

});


// SHOW ADD USER FORM
router.get('/add', function(req, res, next){    
  // render to views/user/add.ejs
  res.render('hopdongs/add', {
      title: 'Thêm hợp đồng mới',
      TenHopDong: '',
        IDCanHo: '',
        IDCuDan: '',
        NgayHieuLuc: '',
        ThoiGian: '',
        TrangThai: ''     
  })
})

// ADD NEW USER POST ACTION
router.post('/add', function(req, res, next){    
  req.assert('TenHopDong', 'Loại hợp đồng').notEmpty()           //Validate name
  req.assert('IDCanHo', 'ID căn hộ').notEmpty()  //Validate email
  req.assert('IDCuDan', 'ID chủ sỡ hữu').notEmpty()           //Validate name
  req.assert('NgayHieuLuc', 'Ngày hiệu lực hợp đồng').notEmpty()           //Validate name
  req.assert('ThoiGian', 'Thời gian hợp đồng có hiệu lực').notEmpty()           //Validate name
  req.assert('TrangThai', 'Trạng Thái hợp đồng').notEmpty()           //Validate name

  var errors = req.validationErrors()
   
  if( !errors ) {   //No errors were found.  Passed Validation!
       
   
      var user = {
        TenHopDong: req.sanitize('TenHopDong').escape().trim(),
        IDCuDan: req.sanitize('IDCuDan').escape().trim(),
        IDCanHo: req.sanitize('IDCanHo').escape().trim(),
        NgayHieuLuc: req.sanitize('NgayHieuLuc').escape().trim(),
        TrangThai: req.sanitize('TrangThai').escape().trim(),
        ThoiGian: req.sanitize('ThoiGian').escape().trim()

      }
       
   connection.query('INSERT INTO hopdong SET ?', user, function(err, result) {
              //if(err) throw err
              if (err) {
                  req.flash('error', err)
                   
                  // render to views/user/add.ejs
                  res.render('hopdongs/add', {
                      title: 'Thêm hợp đồng mới',
                      TenHopDong: user.TenHopDong,
                      IDCuDan: user.IDCuDan,
                      IDCanHo: user.IDCanHo,
                      NgayHieuLuc: user.NgayHieuLuc,
                      TrangThai: user.TrangThai,
                      ThoiGian: user.ThoiGian                    
                    
                    
                  })
              } else {                
                  req.flash('success', 'Thêm căn hộ thành công!');
                  res.redirect('/hopdongs');
              }
          })
  }
  else {   //Display errors to user
      var error_msg = ''
      errors.forEach(function(error) {
          error_msg += error.msg + '<br>'
      })                
      req.flash('error', error_msg)        
       
      /**
       * Using req.body.name 
       * because req.param('name') is deprecated
       */ 
      res.render('hopdongs/add', { 
          title: 'Thêm căn hộ',
          TenHopDong: req.body.TenHopDong,
          IDCanHo: req.body.IDCanHo,
          IDCuDan: req.body.IDCuDan,
          NgayHieuLuc: req.body.NgayHieuLuc,
          ThoiGian: req.body.ThoiGian,
          TrangThai: req.body.TrangThai

      })
  }
})

module.exports = router;