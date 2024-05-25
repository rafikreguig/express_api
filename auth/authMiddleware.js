import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

export const protect = async (req, res, next) => {
  // getting token from headers
  const authToken = req.headers.authorization;

  // checking if the token is exists
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this route",
    });
  }
  console.log(authToken);

  try {
    const token = authToken.split(" ")[1];

    //verify Token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decode.id;
    req.role = decode.role;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ success: false, msg: "Token has been expired" });
    }
    return res.status(401).json({ success: false, msg: "Token is not valid" });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;
  const doctor = await doctorModel.findById(userId);
  const patient = await User.findById(userId);

  doctor ? (user = doctor) : (user = patient);

  if (!roles.icludes(user.role)) {
    return res.status(401).json({
      success: false,
      message: "You are not allowed to access this route",
    });
  }

  next();
};
