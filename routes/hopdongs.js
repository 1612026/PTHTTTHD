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
router.get('/add', function (req, res, next) {
    // render to views/user/add.ejs
    res.render('hopdongs/add', {
        title: 'Thêm hợp đồng mới',
        TenHopDong: '',
        IDCuDan: '',
        IDCanHo: '',
        NgayHieuLuc: '',
        TrangThai: '',
        NgayChinhSua: '',
        NVThucHien: '',
        ThoiGian: ''
    })
})

// ADD NEW USER POST ACTION
router.post('/add', function (req, res, next) {
    req.assert('TenHopDong', '').notEmpty()           //Validate name
    req.assert('IDCuDan', '').notEmpty()           //Validate name
    req.assert('IDCanHo', '').notEmpty()  //Validate email
    //   req.assert('NgayHieuLuc', '').notEmpty() 
    req.assert('TrangThai', '').notEmpty()           //Validate name
    //   req.assert('NgayChinhSua', '').notEmpty()           //Validate name
    //   req.assert('NVThucHien', '').notEmpty()           //Validate name
    //   req.assert('ThoiGian', '').notEmpty()           //Validate name

    var errors = req.validationErrors()

    if (!errors) {   //No errors were found.  Passed Validation!


        var user = {
            TenHopDong: req.sanitize('TenHopDong').escape().trim(),
            IDCuDan: req.sanitize('IDCuDan').escape().trim(),
            IDCanHo: req.sanitize('IDCanHo').escape().trim(),
            //NgayHieuLuc: req.sanitize('NgayHieuLuc').escape().trim(),
            TrangThai: req.sanitize('TrangThai').escape().trim(),
            //ThoiGian: req.sanitize('ThoiGian').escape().trim()

        }

        connection.query('INSERT INTO HopDong SET ?', user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('hopdongs/add', {
                    title: 'Thêm hợp đồng mới',
                    TenHopDong: user.TenHopDong,
                    IDCuDan: user.IDCuDan,
                    IDCanHo: user.IDCanHo,
                    // NgayHieuLuc: user.NgayHieuLuc,
                    TrangThai: user.TrangThai,
                    //ThoiGian: user.ThoiGian                    


                })
            } else {
                req.flash('success', 'Thêm hợp đồng thành công!');
                res.redirect('/hopdongs');
            }
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */
        res.render('hopdongs/add', {
            title: 'Thêm hợp đồng mới',
            TenHopDong: req.body.TenHopDong,
            IDCanHo: req.body.IDCanHo,
            IDCuDan: req.body.IDCuDan,
            //NgayHieuLuc: req.body.NgayHieuLuc,
            TrangThai: req.body.TrangThai
            //ThoiGian: req.body.ThoiGian,

        })
    }
})




// SHOW EDIT USER FORM
router.get('/edit/(:id)', function (req, res, next) {

    connection.query('SELECT * FROM thanhlyhopdong', function (err, rows, fields) {
        res.render('hopdongs/edit', {
            title: 'Thanh lý hợp đồng',
            IDThanhLyHD: '',
            IDHopDong: '',
            NgayThanhLy: '',
            AnhGiayTo: '',
            AnhCSVC: '',
            TrangThai: ''

        })
    })


})

// EDIT USER POST ACTION
router.post('/update/:id', function (req, res, next) {
    req.assert('IDHopDong').notEmpty()           //Validate name
    req.assert('NgayThanhLy').notEmpty()           //Validate name
    req.assert('AnhGiayTo').notEmpty()           //Validate name
    req.assert('AnhCSVC').notEmpty()  //Validate email
    //req.assert('TrangThai',).notEmpty()           //Validate name

    var errors = req.validationErrors()

    if (!errors) {   //No errors were found.  Passed Validation!


        var user = {
            IDHopDong: req.sanitize('IDHopDong').escape().trim(),
            NgayThanhLy: req.sanitize('NgayThanhLy').escape().trim(),
            AnhGiayTo: req.sanitize('AnhGiayTo').escape().trim(),
            AnhCSVC: req.sanitize('AnhCSVC').escape().trim(),
            TrangThai: req.sanitize('TrangThai').escape().trim()
        }

        connection.query('INSERT INTO thanhlyhopdong SET ?', user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('canhos/thanhly', {
                    title: 'Thanh lý căn hộ',
                    IDHopDong: user.IDHopDong,
                    NgayThanhLy: user.NgayThanhLy,
                    AnhGiayTo: user.AnhGiayTo,
                    AnhCSVC: user.AnhCSVC,
                    TrangThai: user.TrangThai
                })
            } else {
                req.flash('success', 'Thêm căn hộ thành công!');
                res.redirect('/canhos');
            }
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */
        res.render('canhos/thanhly', {
            title: 'Thanh lý căn hộ',
            IDHopDong: req.body.IDHopDong,
            NgayThanhLy: req.body.NgayThanhLy,
            AnhGiayTo: req.body.AnhGiayTo,
            AnhCSVC: req.body.AnhCSVC,
            TrangThai: req.body.TrangThai

        })
    }
})



module.exports = router;