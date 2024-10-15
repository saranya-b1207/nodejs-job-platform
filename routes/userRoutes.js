import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import updateUserController from "../controllers/userController.js";

const router=express.Router()

//routes update user
router.put('/update-user',userAuth,updateUserController)


export default router