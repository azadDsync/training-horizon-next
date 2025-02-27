const express = require("express");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const JWT_SECRET = require("../config/jwt");
const Listing = require("../models/Listing");
const { trainerAuthMiddleware } = require("../middleware/authMiddleware");
// const { default: mongoose } = require("mongoose");

const listingRouter = express.Router();

const getListingSchema = zod.object({
  trainerId: zod.string(),
  category: zod.string(),
  subCategory: zod.string(),
  title: zod.string(),
  imageUrl: zod.string(),
  priceMode: zod.string(),
  price: zod.string(),
  mode: zod.string().optional(),
  location: zod.string(),
  quantity: zod.string().optional(),
  classSize: zod.string(),
  startDate: zod.string(),
  endDate: zod.string(),
  days: zod.array(zod.string()),
  gender: zod.string(),
  startTime: zod.string().optional(),
  endTime: zod.string().optional(),
  minAge: zod.string(),
  maxAge: zod.string(),
  preRequistes: zod.string(),
  description: zod.string(),
});
const postListingSchema = zod.object({
  category: zod.string(),
  title: zod.string(),
  imageUrl: zod.string(),
  price: zod.string(),
  mode: zod.string().optional(),
  location: zod.string(),
  quantity: zod.string().optional(),
  startDate: zod.string(),
  endDate: zod.string(),
  days: zod.string(),
  gender: zod.string(),
  startTime: zod.string(),
  endTime: zod.string(),
  // ageGroup: zod.string(),
  minAge: zod.string(),
  maxAge: zod.string(),
  description: zod.string(),
});
listingRouter.get("/listing", async function (req, res) {
  const listings = await Listing.find({ isApproved: true });
  res.status(200).json(listings);
});

listingRouter.get("/bulk", async function (req, res) {
  const filter = req.query.filter || "";
  const listings = await Listing.find({
    isApproved: true,
    $or: [
      {
        category: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        title: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  res.status(200).json(listings);
});

listingRouter.get("/listing", async (req, res) => {
  const {
    category,
    priceMode,
    title,
    imageUrl,
    price,
    mode,
    location,
    quantity,
    classSize,
    startDate,
    endDate,
    days,
    gender,
    startTime,
    endTime,
    minAge,
    maxAge,
    preRequistes,
    description,
    minPrice,
    maxPrice,
  } = req.query;

  const query = {};

  // Build query based on search and filter parameters
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice); // Greater than or equal to minPrice
    if (maxPrice) query.price.$lte = parseInt(maxPrice); // Less than or equal to maxPrice
  }
  if (mode) {
    query.mode = mode;
  }
  if (location) {
    query.location = location;
  }
  if (gender) {
    query.gender = gender;
  }

  query.minAge = {};
  query.maxAge = {};
  if (minAge) query.minAge.$gte = parseInt(minAge);
  if (maxAge) query.maxAge.$lte = parseInt(maxAge);

  if (startTime) {
    query.startTime = {};
    if (startTime) query.startTime.$gte = startTime;
  }
  if (endTime) {
    query.endTime = {};
    query.endTime.$lte = endTime;
  }

  try {
    const result = await Listing.find({ ...query, isApproved: true });

    res.json(result);
  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

listingRouter.get("/listing/id/:trainerId", async function (req, res) {
  const trainerId = req.params;
  try {
    // Fetch the listing from the database using the listingId
    const listings = await Listing.findById(trainerId).populate("trainer");

    // Check if the listing exists
    if (!listings) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Return the found listing
    res.status(200).json({
      message: "Listing retrieved successfully",
      listings,
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({
      message: "Error fetching listing",
      error,
    });
  }
});

listingRouter.get("/listing/:listingId", async function (req, res) {
  // Extract the listingId from the route parameter
  const { listingId } = req.params;

  try {
    // Fetch the listing from the database using the listingId
    const listing = await Listing.findById(listingId);

    // Check if the listing exists
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Return the found listing
    res.status(200).json({
      message: "Listing retrieved successfully",
      listing,
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({
      message: "Error fetching listing",
      error,
    });
  }
});

listingRouter.get(
  "/getListingsByTrainerId/:trainerId",
  async function (req, res) {
    const { trainerId } = req.params;
    try {
      const listings = await Listing.find({ trainerId: trainerId });
      if (!listings) {
        return res.status(404).json({
          message: "Trainer not found",
        });
      }

      res.status(200).json({
        message: "Listings retrieved successfully",
        listings,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching listings",
        error: error,
      });
    }
  }
);

listingRouter.delete(
  "/deleteListingById/:listingId",
  trainerAuthMiddleware,
  async function (req, res) {
    const { listingId } = req.params;
    try {
      const listing = await Listing.findByIdAndDelete(listingId);
      if (!listing)
        return res.status(404).json({ error: "No listing with this id found" });

      res.status(200).json({ message: "Listing Deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
);

listingRouter.post(
  "/add-listing",
  trainerAuthMiddleware,
  async function (req, res) {
    const inputFromTrainer = {
      trainerId: req.trainerId,
      category: req.body.category,
      subCategory: req.body.subCategory,
      priceMode: req.body.priceMode,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      mode: req.body.mode,
      location: req.body.location,
      quantity: req.body.quantity,
      classSize: req.body.classSize,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      days: req.body.days,
      gender: req.body.gender,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
      preRequistes: req.body.preRequistes,
      description: req.body.description,
    };
    const result = getListingSchema.safeParse(inputFromTrainer);

    if (!result.success) {
      return res.status(411).json({
        message: "Incorrect inputs",
        result,
      });
    }
    try {
      const isUniqueTitle = await Listing.findOne({
        title: inputFromTrainer.title,
      });
      if (isUniqueTitle) {
        return res.status(411).json({
          message: "Similar Title Found! ",
        });
      }

      const listing = await Listing.create(inputFromTrainer);
      const token = jwt.sign(
        {
          listingId: listing._id,
        },
        JWT_SECRET
      );

      res.status(200).json({
        message: "list created successfully",
        token: token,
        listingId: listing._id,
      });
    } catch (error) {
      res.status(411).json({
        message: " Incorrect listing input",
        error,
      });
    }
  }
);

listingRouter.put(
  "/add-listing/:id",
  trainerAuthMiddleware,
  async function (req, res) {
    const inputFromTrainer = {
      trainerId: req.trainerId,
      category: req.body.category,
      subCategory: req.body.subCategory,
      priceMode: req.body.priceMode,
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      mode: req.body.mode,
      location: req.body.location,
      quantity: req.body.quantity,
      classSize: req.body.quantity,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      days: req.body.days,
      gender: req.body.gender,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
      preRequistes: req.body.preRequistes,
      description: req.body.description,
      isApproved: false,
    };
    const result = getListingSchema.safeParse(inputFromTrainer);

    if (!result.success) {
      return res.status(411).json({
        message: "Incorrect inputs",
        result,
      });
    }
    try {
      const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        inputFromTrainer
      );
      const token = jwt.sign(
        {
          listingId: listing._id,
        },
        JWT_SECRET
      );

      res.status(200).json({
        message: "list created successfully",
        token: token,
        listingId: listing._id,
      });
    } catch (error) {
      res.status(411).json({
        message: " Incorrect listing input",
        error,
      });
    }
  }
);

module.exports = listingRouter;
