const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createProfile } = require('../controllers/profileController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// @route   POST api/profile
// @desc    Create a new profile
// @access  Public
router.post(
  '/',
  upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }]),
  createProfile
);

module.exports = router;
