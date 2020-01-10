var express = require('express');
var connection  = require('../lib/db');
var router = express.Router();

 
/* GET home page. */
router.get('/', function(req, res, next) {
      
 connection.query('SELECT * FROM CanHo ORDER BY IDCanHo desc',function(err,rows)     {
 
        if(err){
         req.flash('error', err); 
         res.render('canhos',{page_title:"Quan ly Can Ho",data:''});   
        }else{
            
            res.render('canhos',{page_title:"Quan ly Can Ho",data:rows});
        }
                            
         });
        
    });
 
 
// SHOW ADD USER FORM
router.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('canhos/add', {
        title: 'Thêm Căn hộ mới',
        SoPhong: '',
        SoTang: '',
        ToaNha: '',
        LoaiCanHo: '',        
    })
})
 
// ADD NEW USER POST ACTION
router.post('/add', function(req, res, next){    
    req.assert('SoPhong', 'Điền số phòng').notEmpty()           //Validate name
    req.assert('SoTang', 'Điền số tầng').notEmpty()  //Validate email
    req.assert('ToaNha', 'Điền tòa nhà').notEmpty()           //Validate name
    req.assert('LoaiCanHo', 'Điền loại căn hộ').notEmpty()           //Validate name

    var errors = req.validationErrors()
     
    if( !errors ) {   //No errors were found.  Passed Validation!
         
     
        var user = {
            SoPhong: req.sanitize('SoPhong').escape().trim(),
            SoTang: req.sanitize('SoTang').escape().trim(),
            ToaNha: req.sanitize('ToaNha').escape().trim(),
            LoaiCanHo: req.sanitize('LoaiCanHo').escape().trim()

        }
         
     connection.query('INSERT INTO canho SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                     
                    // render to views/user/add.ejs
                    res.render('canhos/add', {
                        title: 'Thêm căn hộ mới',
                        SoPhong: user.SoPhong,
                        SoTang: user.SoTang,
                        ToaNha: user.ToaNha,
                        LoaiCanHo: user.LoaiCanHo                    
                    })
                } else {                
                    req.flash('success', 'Thêm căn hộ thành công!');
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
        res.render('canhos/add', { 
            title: 'Thêm căn hộ',
            SoPhong: req.body.SoPhong,
            SoTang: req.body.SoTang,
            ToaNha: req.body.ToaNha,
            LoaiCanHo: req.body.LoaiCanHo

        })
    }
})
 
// SHOW EDIT USER FORM
router.get('/edit/(:id)', function(req, res, next){
   
connection.query('SELECT * FROM canho WHERE IDCanHo = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
             
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Không tìm thấy căn hộ ' + req.params.id)
                res.redirect('/canhos')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('canhos/edit', {
                    title: 'Sửa thông tin căn hộ', 
                    //data: rows[0],
                    IDCanHo: rows[0].IDCanHo,
                    SoPhong: rows[0].SoPhong,
                    SoTang: rows[0].SoTang,
                    ToaNha: rows[0].ToaNha,
                    LoaiCanHo:rows[0].LoaiCanHo                    
                })
            }            
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
            LoaiCanHo: req.sanitize('LoaiCanHo').trim()

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
                        LoaiCanHo:rows[0].LoaiCanHo        
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
            LoaiCanHo: req.body.LoaiCanHo
        })
    }
})
       
// DELETE USER
router.get('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
     
connection.query('DELETE FROM canho WHERE IDCanHo = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/canhos')
            } else {
                req.flash('success', 'Xóa căn hộ thành công! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/canhos')
            }
        })
   })
 
 
module.exports = router;