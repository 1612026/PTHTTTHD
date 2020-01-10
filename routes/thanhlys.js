var express = require('express');
var connection = require('../lib/db');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
//   });
router.get('/', function (req, res, next) {

    connection.query('SELECT * FROM ThanhLyHopDong ORDER BY TrangThai desc', function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('thanhlys', { page_title: "Quan ly Hop Dong da thanh ly", data: '' });
        } else {

            res.render('thanhlys', { page_title: "Quan ly Hop Dong da thanh ly", data: rows });
        }

    });

});


// SHOW ADD USER FORM
router.get('/doit/(:id)', function (req, res, next) {
    // render to views/user/add.ejs
    res.render('thanhlys/doit', {
        title: 'Thanh lý hợp đồng',
        IDHopDong: '',
        NgayThanhLy: '',
        AnhGiayTo: '',
        AnhCSVC: '',
        TrangThai: ''
    })
})

// ADD NEW USER POST ACTION
router.post('/update/:id', function (req, res, next) {
    req.assert('IDHopDong').notEmpty()           //Validate name
    req.assert('NgayThanhLy').notEmpty()           //Validate name
    req.assert('AnhGiayTo').notEmpty()           //Validate name
    req.assert('AnhCSVC').notEmpty()  //Validate email
    req.assert('TrangThai',).notEmpty()           //Validate name

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
                res.render('thanhly/doit', {
                    title: 'Thanh lý căn hộ',
                    IDHopDong: user.IDHopDong,
                    NgayThanhLy: user.NgayThanhLy,
                    AnhGiayTo: user.AnhGiayTo,
                    AnhCSVC: user.AnhCSVC,
                    TrangThai: user.TrangThai
                })
            } else {
                req.flash('success', 'Thêm căn hộ thành công!');
                res.redirect('/thanhlys');
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

router.post('/upload', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
  
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
  
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
  
        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
  });



module.exports = router;