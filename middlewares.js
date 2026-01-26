const ExpressError = require('./utils/ExpressError');
const {campgroundSchema} = require('./schemas');
const Campground = require('./models/campground');
const {reviewSchema} = require('./schemas');
const Review = require('./models/review');


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to continue!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
      const message = error.details.map(el => el.message).join(',');
      throw new ExpressError(message, 400);
    } else {
      next();
    }
}

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
      const message = error.details.map(el => el.message).join(',');
      throw new ExpressError(message, 400);
    } else {
      next();
    }
}

module.exports.pagination = (req, res, next) => {
  let limit = parseInt(req.query.limit, 10) || 10; // Default limit is 10
  let page = parseInt(req.query.page, 10) || 1; // Default page is 1

  if (limit < 1) limit = 10; // Minimum limit is 10
  if (limit > 100) limit = 100; // Maximum limit is 100

  if (page < 1) page = 1; // Minimum page is 1

  req.query.limit = limit;
  req.query.page = page;
  req.query.skip = (page - 1) * limit; // Calculate skip for pagination

  next();
};

