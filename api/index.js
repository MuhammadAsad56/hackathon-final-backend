import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import AuthRouter from './routes/AuthRouter.js'
import UserRouter from './routes/UserRouter.js'
import EmailRoutes from "./routes/EmailRoute.js";
const app = express()
dotenv.config()
app.use(express.json())
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World')
}
)
app.use(
    cors({
      origin: "*", // Allow all origins, adjust as needed
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
);

app.use('/auth', AuthRouter)
app.use('/user', UserRouter)
app.use("/sendEmail", EmailRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    app.listen(PORT, () => {
        console.log(`db connected and server started on port ${PORT}`);
    })   
})
.catch((err) => {console.log(err);
})