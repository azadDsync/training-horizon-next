const express = require("express");
const Trainer = require("../models/Trainer");
const { z } = require("zod");

// zod validation schema
const trainerSchema = z.object({
  fname: z.string().min(1, "FName is required"),
  lname: z.string().min(1, "LName is required"),
  qualifications: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  availability: z.array(z.string()).min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  password: z.string().min(1),
  about: z.string().min(1),
  workHistory: z.string().min(1),
  educationDetail: z.string().min(1),
  imageUrl: z.string().min(1),
  experience: z.string().min(1),
  linkedin: z.string().min(1),
});

// controller to create trainer
exports.createTrainer = async (req, res) => {
  try {
    trainerSchema.parse(req.body);
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
};
// controller to update trainer

exports.updateTrainer = async (req, res) => {
  try {
    console.log("🔹 Incoming update request:", req.params.id, req.body);

    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      console.error("Trainer not found with ID:", req.params.id);
      return res.status(404).json({ error: "Trainer not found!" });
    }

    // Update only provided fields
    Object.assign(trainer, req.body);

    await trainer.save();

    console.log("Trainer updated successfully:", trainer);
    res.status(200).json({ trainer, message: "Trainer updated successfully" });
  } catch (e) {
    console.error("Error updating trainer:", e.message);
    res.status(500).json({ error: e.message });
  }
};

// controller to fetch all the trainers

exports.getTrainers = async (req, res) => {
  try {
    res.status(200).json(trainer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// controller to fetch all approved trainers

exports.getApprovedTrainers = async (req, res) => {
  try {
    const approvedTrainers = await Trainer.find({ isApproved: true });
    if (approvedTrainers.length === 0) {
      return res.status(404).json({ message: "No approved trainers found" });
    }
    res.status(200).json(approvedTrainers);
  } catch (error) {
    handleErrors(res, error);
  }
};

// controller to fetch a single trainer by specific ID

exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(500).json({ success: false, mesaage: "Not trainer found" });
    res.status(200).send({
      trainer,
      success: true,
    })
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// controller to delete a trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer)
      return res.status(500).json({ Error: "No trainer with this ID found" });
    res.status(500).json({ message: "Trainer deleted successfully!!!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
