const Profile = require('../models/Profile');

exports.createProfile = async (req, res) => {
  try {
    const { name, email, mobile, education, skills, linkedin, role, experienceLevel, yearsOfExperience, github, portfolio, website } = req.body;

    const profileData = {
      name,
      email,
      mobile,
      education,
      skills,
      linkedin,
      role,
      experienceLevel,
      yearsOfExperience,
      github,
      portfolio,
      website
    };

    if (req.files.resume) {
      profileData.resume = req.files.resume[0].path;
    }
    if (req.files.profileImage) {
      profileData.profileImage = req.files.profileImage[0].path;
    }

    const newProfile = new Profile(profileData);
    const profile = await newProfile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
