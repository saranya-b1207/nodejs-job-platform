import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { createJobController, deleteJobController, getAllController, statsJobController, updateController } from "../controllers/jobController.js";

const router=express.Router()

//routes
//create//job//post

router.post('/create-job',userAuth,createJobController);
router.get('/get-job',userAuth,getAllController);
//update jobs put/patch
router.put('/update-job/:id',userAuth,updateController);
//delete jobs/delete
router.delete('/delete-job/:id',userAuth,deleteJobController);
//stats and filters job/get
router.get('/job-stats',userAuth,statsJobController);
export default router