import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: String,
    email : {type : String, unique : true, required : true}, 
    password: {type : String, unique : true, required : true}
})

const UserModal = mongoose.model('Users', userSchema)
export default UserModal 