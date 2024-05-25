import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createNewDoctor,
  getDoctorByFilterAndValue,
} from "../controllers/controller.js";
import { protect, restrict } from "../auth/authMiddleware.js";

const router = express.Router();

// Get all doctors
router.get("/", getAllDoctors);

// Get doctor by id
router.get("/doctor/:id", getDoctorById);

// Get a doctor by filter and value
router.get("/doctor", getDoctorByFilterAndValue);

// Create a doctor
router.post("/new-doctor", createNewDoctor);

export default router;
