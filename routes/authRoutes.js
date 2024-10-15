import express from 'express';
import { loginController, registerController } from '../controllers/authController.js';
import userAuth from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';
//router OBJ
const router = express.Router()
//limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})
//route/multiline comments
/**
 * @swagger
 * components:
 *  schemas:
 *    user:
 *     type: object
 *     required:
 *       - name
 *       - lastName
 *       - email
 *       - password
 *       - location
 *     properties:
 *      id:
 *        type: string
 *        description: The auto-generated id of user collection
 *      name:
 *        type: string
 *        description: user name
 *      lastName:
 *        type: string
 *        description: user last name
 *      email:
 *        type: string
 *        description: user email address
 *      password:
 *        type: string
 *        description: user passed should be greater then 6 character 
 *      location:
 *        type: string
 *        description: user city or country
 *     example:
 *        id: KRFNWFJ94MFS
 *        name: sara
 *        lastName: ali
 *        email: saraali@gmail.com
 *        password: test@123
 *        location: india  
 */
/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: authentication apis 
 */
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *    summary: register new user
 *    tags: [Auth]
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: user created sucessfully
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/user'
 *       500:
 *         description: internal server error
 */
//register//post
router.post('/register', limiter, registerController);
//login//post
router.post('/login', limiter, loginController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: login page
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       200:
 *         description: login successfully
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/user'
 *       500:
 *         description: something went wrong   
 */
export default router;  