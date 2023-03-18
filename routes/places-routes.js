const placesControllers = require("../controllers/place-controllers");
const { check } = require("express-validator");
const express = require('express');
const multer = require('multer');
// Set up the Multer middleware to handle the form data
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
cloudinary.config({
  cloud_name: "diipdxyiw",
  api_key: "694124595821739",
  api_secret: "l-bpaWBB11ZXZmCkvpV21cnQ5Kw"
});
router.get("/:placeid", placesControllers.GetPlaceById);
router.get("/user/:uid", placesControllers.GetPlaceByUserId);
router.post("/",upload.single('image'), async (req, res) => {
  const formData = new FormData();
  formData.append('file', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
    knownLength: req.file.size
  });
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data',
      }, params: {
        upload_preset: "xukwq0df"
    }
    }
  );
  
  // Get the uploaded image URL from the response
  const imageUrl = response.data.url;
  req.body.imageUrl = imageUrl;
  await placesControllers.createPlace(req, res);
},
[check("address").not().isEmpty(),  
check("title").isLength({min:3}),
check("description").isLength({min:5})],
 placesControllers.createPlace);
router.patch("/:placeid",[check("address").not().isEmpty(),
check("title").isLength({min:3}),
check("description").isLength({min:5})], placesControllers.updatePlace);
router.delete("/:placeid", placesControllers.deletePlace);

module.exports = router;
