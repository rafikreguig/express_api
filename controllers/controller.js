import doctorModel from "../models/doctorModel.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find().select("-password");
    res.status(200).send(doctors);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await doctorModel.findById(id).select("-password");
    if (!doctor) return res.status(404).send("Doctor not found");
    res.status(200).send(doctor);
  } catch (err) {
    console.log(err._message);
    res.status(500).send(err);
  }
};

export const getDoctorByFilterAndValue = async (req, res) => {
  const { filter, value } = req.query;

  try {
    const filteredDoctors = await doctorModel
      .find({ [filter]: value })
      .select("-password");
    if (!filteredDoctors) return res.status(404).send("no doctors found");
    res.status(200).send(filteredDoctors);
  } catch (err) {
    console.log(err._message);
    res.status(500).send(err);
  }
};

export const createNewDoctor = async (req, res) => {
  const { body } = req;

  try {
    const newDoctor = new doctorModel(body);
    await newDoctor.save();
    res.status(201).send(newDoctor);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
