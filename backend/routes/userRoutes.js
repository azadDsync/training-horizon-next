const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");
const { User } = require("../models/user");
// const { Enrollment } = require("../models/enrollment");
const { authMiddleware } = require("../middleware/authMiddleware");
const Member = require("../models/Member");
const sendEmail = require("../utils/sendEmail");

const userRouter = express.Router();

// input validation
const userSignupSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  password: zod
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  role: zod.string(),
});
const userSigninSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
const userUpdateSchema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

userRouter.post("/google-auth", async function (req, res) {
  const inputFromUser = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    role: req.body.role || "user",
  };
  const result = userSignupSchema.safeParse(inputFromUser);

  if (!result.success) {
    return res.status(411).json({
      message: " Incorrect inputs",
    });
  }
  try {
    try {
      const user = await User.findOne({
        email: inputFromUser.email,
        // password: inputFromUser.password,
      });

      if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.status(200).json({
          token: token,
        });
      }
    } catch (error) {
      console.log(error);
    }

    const user = await User.create(inputFromUser);
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({
      message: "user created successfully",
      token: token,
      _id: user._id,
    });
  } catch (error) {
    // res.status(411).json({
    //   message: error,
    // });
    // console.log(error);
  }
});

userRouter.post("/signup", async function (req, res) {
  const inputFromUser = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    role: req.body.role || "user",
  };
  const result = userSignupSchema.safeParse(inputFromUser);

  if (!result.success) {
    return res.status(411).json({
      message: "Email already taken  1 / Incorrect inputs",
    });
  }
  try {
    const isValid = await User.findOne({
      email: inputFromUser.email,
    });
    if (isValid) {
      return res.status(411).json({
        message: "Email already taken 2 /Incorrect inputs",
      });
    }

    const user = await User.create(inputFromUser);
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET
    );

    await sendEmail(
      user.email,
      "Account Registration",
      `Hello ${user.FirstName}, \n\nYou have successfully registered ${inputFromUser.firstName} into your training horizon.`,
      `<p>Hello ${user.FirstName},</p><p>You have successfully registered <b>${inputFromUser.firstName}</b>into your training horizon account.</p>`
    );

    // member email not available yet!!
    // await sendEmail(
    //   inputFromUser.email,
    //   'Member Registeration',
    //   `Hello ${inputFromUser.firstName}, \n\nYou have successfully been registered by ${user.FirstName} as a member into their training horizon account.`
    // );

    res.status(200).json({
      message: "User created successfully",
      token: token,
      _id: user._id,
    });
  } catch (error) {
    res.status(411).json({
      message: error,
    });
  }
});

userRouter.post("/signin", async function (req, res) {
  const userInput = {
    email: req.body.email,
    password: req.body.password,
  };

  const result = userSigninSchema.safeParse(userInput);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid email or password format.",
    });
  }

  try {
    const user = await User.findOne({
      email: userInput.email,
      password: userInput.password,
    });
    if (!user) {
      return res.status(401).send({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is stored in environment variables
      { expiresIn: "1h" }
    );

    // Send login notification email
    await sendEmail(
      user.email,
      "Login Notification",
      `Hello ${user.firstName}, \n\nYou have successfully logged into your account.`
    );

    // Send success response
    return res.status(200).json({
      msg: "User logged in successfully",
      token: token,
      _id: user._id,
    });
  } catch (error) {
    console.error("Error in signin route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.put("/", authMiddleware, async function (req, res) {
  const userInput = req.body;

  const isValid = userUpdateSchema.safeParse(userInput);
  if (!isValid.success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }
  
  try {
    // console.log(" is it correct ?"+res.userId);
    await User.updateOne({ _id: req.userId }, { $set: userInput });
    // console.log(req.userId);

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.log("Error in /user update route:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// for user Dashboard
userRouter.get("/username", authMiddleware, async function (req, res) {
  const user = await User.findOne({
    _id: req.userId,
  });
  res.status(200).json({
    _id: user._id,
    user: user.firstName,
    userLastName: user.lastName,
    role: user.role,
    email: user.email,
  });
});

userRouter.get("/getUserById/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// userRouter.put("/users/:userId", authMiddleware, async (req, res) => {
//   const userId = req.params.userId;
//   console.log(userId);

//   const { firstName, lastName  } = req.body;

//   try {
//     // Find the user by ID and update the details
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         firstName,
//         lastName,
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User details updated successfully", updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating user details", error: error.message });
//   }
// });


userRouter.post("/registerMember", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      age,
      dob,
      relationship,
      doctorName,
      doctorNumber,
      gender,
      city,
      address,
      postalCode,
      agreeToTerms,
    } = req.body;
    const userId = req.userId;
    // console.log("The user Id is " + userId);
    const newMember = new Member({
      name,
      age,
      dob,
      relationship,
      doctorName,
      doctorNumber,
      gender,
      city,
      address,
      postalCode,
      agreeToTerms,
    });

    const savedMember = await newMember.save();

    // Add the member to the user's familyMembers array
    const user = await User.findById(userId);
    user.familyMembers.push(savedMember._id);
    await user.save();

    await sendEmail(
      user.email,
      'Training Horizon Signup',
      `Hello ${user.FirstName}, \n\nYou have successfully created your training horizon account.`
    );

    res.status(201).json({
      message: "Family member registered successfully",
      member: savedMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering family member",
      error: error.message,
    });
  }
});

userRouter.get("/allmembers", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Find user and populate familyMembers field
    const user = await User.findById(userId).populate("familyMembers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ familyMembers: user.familyMembers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching family members", error: error.message });
  }
});

userRouter.put("/members/:id", authMiddleware, async (req, res) => {
  const memberId = req.params.id;
  console.log(memberId);
  const {
    name,
    age,
    dob,
    relationship,
    doctorName,
    doctorNumber,
    gender,
    city,
    address,
    postalCode,
    agreeToTerms,
  } = req.body;
  try {
    // Find the member by ID and update it
    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      {
        name,
        age,
        dob,
        relationship,
        doctorName,
        doctorNumber,
        gender,
        city,
        address,
        postalCode,
        agreeToTerms,
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Family member not found" });
    }

    res
      .status(200)
      .json({ message: "Family member updated successfully", updatedMember });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating family member", error: error.message });
  }
});

userRouter.get("/members/:id", authMiddleware, async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    res
      .status(200)
      .json({ message: "Family member retrieved successfully", member });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching family member", error: error.message });
  }
});
// Routes for enrollement logic
// Enroll a user in a course
userRouter.post("/enroll", async (req, res) => {
  const { listingId, memberIds } = req.body; // Accept an array of memberIds

  if (!listingId || !Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({
      error: "Listing ID and an array of Member IDs are required",
    });
  }

  try {
    // Find the enrollment document for the given listingId
    let enrollment = await Enrollment.findOne({ listingId });

    if (!enrollment) {
      enrollment = new Enrollment({
        listingId,
        memberIds: memberIds,
      });
      await enrollment.save();
      return res.status(200).json({
        message: "Enrollment created and members added",
        enrollment,
      });
    }

    // Filter out memberIds that are already in the members array
    const newMembers = memberIds.filter(
      (id) => !enrollment.memberIds.includes(id)
    );

    if (newMembers.length === 0) {
      return res.status(400).json({
        error: "All provided members are already enrolled in this listing",
      });
    }

    // Add the new members to the array and save
    enrollment.memberIds.push(...newMembers);
    await enrollment.save();

    res.status(200).json({
      message: "New members added to the enrollment",
      addedMembers: newMembers,
      enrollment,
    });
  } catch (error) {
    console.error("Error enrolling members:", error);
    res.status(500).json({ error: "Failed to enroll members" });
  }
});

userRouter.get("/enrolled/:listingId", async (req, res) => {
  const { listingId } = req.params;

  if (!listingId) {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  try {
    const enrollment = await Enrollment.findOne({ listingId });

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: "No enrollment found for this listing" });
    }

    const memberCount = enrollment.memberIds.length;

    res.status(200).json({ listingId, memberCount });
  } catch (error) {
    console.error("Error counting members:", error);
    res.status(500).json({ error: "Failed to count members" });
  }
});

// Updated endpoint to get enrollment details with member details
userRouter.get("/enrollment-details/:listingId", async (req, res) => {
  const { listingId } = req.params;

  if (!listingId) {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  try {
    // Find the enrollment by listingId and populate member details
    const enrollment = await Enrollment.findOne({ listingId }).populate({
      path: "memberIds",
      model: Member,
      select:
        "name age dob relationship gender address city postalCode doctorName doctorNumber",
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: "No enrollment found for this listing" });
    }

    // Prepare the response data for AG Grid
    const memberDetails = enrollment.memberIds.map((member) => ({
      memberId: member._id,
      name: member.name,
      age: member.age,
      dob: member.dob,
      relationship: member.relationship,
      gender: member.gender,
      address: member.address,
      city: member.city,
      postalCode: member.postalCode,
      doctorName: member.doctorName,
      doctorNumber: member.doctorNumber,
    }));

    res.status(200).json({ members: memberDetails });
  } catch (error) {
    console.log("Error fetching enrollment details:", error);
    res.status(500).json({ error: "Failed to retrieve enrollment details" });
  }
});

// cart routes

userRouter.post("/cart", authMiddleware, async (req, res) => {
  // Expected req.body format:
  // {
  //   listings: ["listingId1", "listingId2", ...],
  //   members: ["memberId1", "memberId2", ...]
  // }
  const { listings, members } = req.body;

  if (!Array.isArray(listings) || !Array.isArray(members)) {
    return res.status(400).json({ message: "Listings and members must be arrays." });
  }

  if (listings.length !== members.length) {
    return res.status(400).json({ message: "Listings and members arrays must have the same length." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure cart exists
    if (!user.cart) {
      user.cart = { listings: [], members: [] };
    }

    // Loop through each new pair of listing and member
    for (let i = 0; i < listings.length; i++) {
      const newListing = listings[i];
      const newMember = members[i];

      // Check if the exact pair already exists in the cart
      let duplicate = false;
      for (let j = 0; j < user.cart.listings.length; j++) {
        if (
          user.cart.listings[j].toString() === newListing &&
          user.cart.members[j].toString() === newMember
        ) {
          duplicate = true;
          break;
        }
      }

      if (!duplicate) {
        user.cart.listings.push(newListing);
        user.cart.members.push(newMember);
      }
    }

    await user.save();

    // Build a zipped array for the response so that each item is shown as a pair.
    const cartItems = [];
    for (let i = 0; i < user.cart.listings.length; i++) {
      cartItems.push({
        listing: user.cart.listings[i],
        member: user.cart.members[i],
      });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      cart: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating cart",
      error: error.message,
    });
  }
});

userRouter.get("/cart", authMiddleware, async (req, res) => {
  try {
    // Retrieve the user and populate the referenced listings and members.
    const user = await User.findById(req.userId)
      .populate("cart.listings")
      .populate("cart.members");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Zip the two arrays to produce a list of cart items
    const cartItems = [];
    const listings = user.cart.listings || [];
    const members = user.cart.members || [];
    const length = Math.min(listings.length, members.length);
    for (let i = 0; i < length; i++) {
      cartItems.push({
        listing: listings[i],
        member: members[i],
      });
    }

    res.status(200).json({
      cart: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
});

userRouter.delete("/cart", authMiddleware, async (req, res) => {
  const { listingId, memberId } = req.body;
  if (!listingId || !memberId) {
    return res.status(400).json({ message: "Both listingId and memberId are required." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure the cart exists
    if (!user.cart) {
      user.cart = { listings: [], members: [] };
    }

    // Find the index of the matching pair
    let indexToRemove = -1;
    for (let i = 0; i < user.cart.listings.length; i++) {
      if (
        user.cart.listings[i].toString() === listingId &&
        user.cart.members[i].toString() === memberId
      ) {
        indexToRemove = i;
        break;
      }
    }

    if (indexToRemove === -1) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    // Remove the matching item from both arrays
    user.cart.listings.splice(indexToRemove, 1);
    user.cart.members.splice(indexToRemove, 1);

    await user.save();
    return res.status(200).json({ message: "Cart item removed successfully.", cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: "Error removing cart item", error: error.message });
  }
});

userRouter.delete("/cart/clear", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Clear the cart by setting listings and members arrays to empty
    user.cart = { listings: [], members: [] };

    await user.save();
    return res.status(200).json({ message: "Cart cleared successfully.", cart: user.cart });
  } catch (error) {
    return res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
});

userRouter.put("/orders", authMiddleware, async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: "OrderId is required." });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { orders: orderId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "Order added to user's orders", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating orders", error: error.message });
  }
});


module.exports = userRouter;
