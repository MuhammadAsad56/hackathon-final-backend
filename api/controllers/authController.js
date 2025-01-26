import Joi from "joi";
import bcrypt from "bcrypt";
import UserModal from "../models/user.modal.js";
import jwt from "jsonwebtoken";

const registerJoiSchema = Joi.object({
  fullName: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  cnic: Joi.string().min(13).max(15),
});

const loginJoiSchema = Joi.object({
  password: Joi.string().min(5),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)
      return res.status(400).json({ error: true, msg: "email is required" });
    if (!password)
      return res.status(400).send({ error: true, msg: "password is required" });
    const { error, value } = loginJoiSchema.validate(req.body);
    if (error) return res.status(400).send({ error: true, msg: error.message });
    const user = await UserModal.findOne({ email: email }).lean();
    if (!user)
      return res.status(403).json({ error: true, message: "user not found" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res
        .status(403)
        .send({ error: true, message: "password is not correct" });
    let token = jwt.sign(user, process.env.AUTH_SECRET);
    res.status(200).json({
      error: false,
      data: { user, token },
      message: "user login successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      data: null,
      message: "something went wrong",
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email)
      return res
        .status(400)
        .send({ error: true, message: "email is required" });
    if (!password)
      return res
        .status(400)
        .send({ error: true, message: "password is required" });
    const { error, value } = registerJoiSchema.validate(req.body);
    if (error) return res.status(400).send({ error: true, msg: error.message });
    const user = await UserModal.findOne({ email: email });
    if (user)
      return res
        .status(403)
        .send({ error: true, message: "user with this email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const obj = {
      fullName: value.fullName,
      email: email,
      password: hashedPassword,
      cnic: value.cnic,
    };
    let newUesr = await new UserModal(obj);
    newUesr = await newUesr.save();
    console.log("newUesr", newUesr);
    const token = jwt.sign(newUesr.toObject(), process.env.AUTH_SECRET);
    console.log("token jwt", token);
    
    res.status(200).json({
      error: false,
      data: {newUesr, token},
      message : "user added successfully and logged in",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      data: null,
      msg: "something went wrong",
    });
  }
};
