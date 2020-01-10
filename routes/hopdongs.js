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




// SHOW EDIT USER FORM
router.get('/edit/(:id)', function(req, res, next){
   
    res.render('hopdongs/edit', {
        title: 'Thanh lý hợp đồng',
        IDThanhLyHD:'',
        IDHopDong:'',
        NgayThanhLy:'',
        AnhGiayTo:'',
        AnhCSVC:'',
        TrangThai:''
         
    })
      
    })
     
    // EDIT USER POST ACTION
    router.post('/update/:id', function(req, res, next) {
        req.assert('SoPhong', 'Điền số phòng').notEmpty()           //Validate name
        req.assert('SoTang', 'Điền số tầng').notEmpty()  //Validate email
        req.assert('SoPhong', 'Điền tòa nhà').notEmpty()           //Validate name
        req.assert('SoPhong', 'Điền loại căn hộ').notEmpty()           //Validate name
        
        var errors = req.validationErrors()
         
        if( !errors ) {   
     
            var user = {
                SoPhong: req.sanitize('SoPhong').trim(),
                SoTang: req.sanitize('SoTang').trim(),
                ToaNha: req.sanitize('ToaNha').trim(),
                LoaiCanHo: req.sanitize('LoaiCanHo').trim(),
                TrangThai: req.sanitize('TrangThai').trim()
            }
             
    connection.query('UPDATE canho SET ? WHERE IDCanHo = ' + req.params.id, user, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                         
                        // render to views/user/add.ejs
                        res.render('canhos/edit', {
                            title: 'Sửa thông tin căn hộ',
                            IDCanHo: rows[0].IDCanHo,
                            SoPhong: rows[0].SoPhong,
                            SoTang: rows[0].SoTang,
                            ToaNha: rows[0].ToaNha,
                            LoaiCanHo:rows[0].LoaiCanHo,
                            TrangThai:rows[0].TrangThai
                        })
                    } else {
                        req.flash('success', 'Cập nhật thông tin căn hộ thành công!');
                        res.redirect('/canhos');
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
            res.render('canhos/edit', { 
                title: 'Sửa thông tin căn hộ',            
                IDCanHo: req.params.IDCanHo, 
                SoPhong: req.body.SoPhong,
                SoTang: req.body.SoTang,
                ToaNha: req.body.ToaNha,
                LoaiCanHo: req.body.LoaiCanHo,
                TrangThai:req.body.TrangThai
            })
        }
    })



module.exports = router;