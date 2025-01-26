import express from 'express'
import UserModal from '../models/user.modal.js'
const router = express.Router()
import { login, signUp } from '../controllers/authController.js'


router.get('/', async (req, res) => {
    try {
        const user = await UserModal.find({})
        res.status(200).json({
            error: false,
            data: user,
            msg: 'users fetched successfully'
        })   
    } catch (error) {
        res.status(400).json({
            error: true,
            data: null,
            msg: 'something went wrong'
        }) 
    }
})

router.post('/login', login)
router.post('/signup',signUp)


export default router