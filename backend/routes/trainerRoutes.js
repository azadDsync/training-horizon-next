const express = require("express");
const router = express.Router(); 
const tc = require("../controllers/trainerController");
const tac = require("../controllers/trainerAuthController"); // tac= trainerAuthController

// Trainer routes
router.get("/trainers", tc.getTrainers);
router.get("/approved-trainers",tc.getApprovedTrainers);
router.get("/trainers/:id", tc.getTrainerById);
router.put("/trainers/:id", tc.updateTrainer);
router.delete("/trainers/:id", tc.deleteTrainer); 

// Auth routes
router.post("/trainers/signup", tac.signUpTrainer);
router.post("/trainers/login", tac.loginTrainer);

module.exports = router;
