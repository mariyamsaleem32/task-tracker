import express from "express";
import tokenVerification from "../Middleware/tokenVerification.js";
import { createUser, getAllUsers, updateUser, deleteUser,
login, getLoggedInUser } from "../controller/userController.js";
import {
  loginValidation,
  signupValidation,
} from "../Middleware/userValidation.js";

const router = express.Router();

router.get("/user",tokenVerification, getAllUsers);
router.post("/user", signupValidation, createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.post("/user/login", loginValidation, login);
router.get("/user/me", tokenVerification, getLoggedInUser); 

export default router;