import doctorModel from "../models/doctorModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// generating token
const generateToken = (user) => {
  const { _id, role } = user;
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

// Register a user
export const signUp = async (req, res) => {
  const { fullName, email, password, role, speciality, gender, city } =
    req.body;

  try {
    if (!fullName || !email || !password || !role)
      return res.status(400).json({ msg: "Please fill all fields" });
    let user;
    if (role == "doctor") {
      user = await doctorModel.findOne({ email });
    } else if (role == "patient") {
      user = await User.findOne({ email });
    }
    if (user) return res.status(400).json({ msg: "User already exists" });

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (role == "doctor") {
      user = new doctorModel({
        fullName,
        email,
        password: hashedPassword,
        role,
        speciality,
        gender,
        city,
      });
    } else if (role == "patient") {
      user = new User({
        fullName,
        email,
        password: hashedPassword,
        role,
      });
    }

    await user.save();
    res.status(201).json({
      success: true,
      msg: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.msg });
    console.log(err.msg);
  }
};

// Login a user
export const signIn = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ msg: "Please fill all fields" });
    let user;

    const doctor = await doctorModel.findOne({ email });
    const patient = await User.findOne({ email });
    doctor ? (user = doctor) : (user = patient);

    if (!user) return res.status(400).json({ msg: "User not found" });

    //comparing the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    //creating a token
    const token = generateToken(user);
    res.status(200).json({
      success: true,
      msg: "User logged in successfully",
      user: user.fullName,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "failed to login!" });
    console.log(err.msg);
  }
};
