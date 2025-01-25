import express from 'express'
const router = express.Router()
import { authenticationUser } from '../middleware/authentication.js'
import UserModal from '../models/user.modal.js'


router.put('/', authenticationUser, async (req, res) => {
    try {
       const body = req.body 
       const user = await UserModal.findById(body.user._id)
       if(!user) return res.status(403).send({error: true, msg: "user not found"})
       const updatedUesr = await UserModal.findByIdAndUpdate(body.user._id, body, {new: true})
       res.status(200).json({error: false, updatedUesr, msg : "user updated successfully"})
    } catch (error) {
      res.status(400).json({error: true, msg : "something went wrrong"})
    }
})
router.get('/getMyInfo', authenticationUser, async (req, res) => {
    try {
       const body = req.body 
       const user = await UserModal.findById(body.user._id)
       if(!user) return res.status(403).send({error: true, msg: "user not found"})
       res.status(200).json({error: false, data: user, msg : "user fetched successfully"})
    } catch (error) {
       console.log(error.message);
       res.status(400).json({error: true, msg : "something went wrrong"})
    }
})
export default router