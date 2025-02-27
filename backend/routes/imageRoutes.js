require("dotenv").config();
const express = require("express");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {Image} = require('../models/Image')
const Listing = require('../models/Listing')

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const imageRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

imageRouter.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const file = req.file;
  const timestamp = Date.now(); 
  const key = `uploads/${timestamp}_${file.originalname}`;

  const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key, 
      Body: file.buffer,
      ContentType: file.mimetype,
  };

  try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      const imageUrl = key;

      const image = new Image({ imageUrl });
      await image.save();

      res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (err) {
      console.error("Error uploading to S3:", err);
      res.status(500).send("Error uploading file");
  }
});

imageRouter.get("/upload", async (req, res) => {
  const { imageUrl } = req.query; // Expecting imageUrl as a query parameter

  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }

  try {
    const image = await Image.findOne({ imageUrl }); // Find by imageUrl

    if (!image) {
      return res.status(404).send("Image not found");
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: image.imageUrl,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    // console.log(signedUrl);
    
    res.status(200).json({ signedUrl });
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).send("Error retrieving image");
  }
});
imageRouter.get("/upload-temp", async (req, res) => {
    const { imageUrl } = req.query; // Expecting imageUrl as a query parameter
  
    if (!imageUrl) {
      return res.status(400).send("Image URL is required");
    }
  
    try {
      const image = await Image.findOne({ imageUrl }); // Find by imageUrl
  
      if (!image) {
        return res.status(404).send("Image not found");
      }
  
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: image.imageUrl,
      });
  
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
    //   console.log(signedUrl);
      
      res.status(200).json({ signedUrl });
    } catch (err) {
      console.error("Error retrieving image:", err);
      res.status(500).send("Error retrieving image");
    }
  });

imageRouter.delete("/upload/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    const imageUrl = image.imageUrl;
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageUrl,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    await Image.findByIdAndDelete(id);

    res.status(200).send(image);
  } catch (error) {
    console.error("Error during deletion:", error);

    if (error.name === "NoSuchKey") {
      return res.status(404).send("Image not found in S3");
    }

    res.status(500).send("An error occurred while deleting the image");
  }
});


module.exports = imageRouter;
