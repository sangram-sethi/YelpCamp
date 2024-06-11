const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground, pagination} = require('../middleware');
const {storage} = require('../cloudinary/index');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer');
const upload = multer({ storage });
const app = express();
const paginate = require('express-paginate');

app.use(pagination);

router.route('/')
    .get(pagination ,catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm); 

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;