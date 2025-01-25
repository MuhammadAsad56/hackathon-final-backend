import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function authenticationUser(req, res, next){
try {
        const bearerToken = req?.headers?.authorization
        const token = bearerToken?.split(" ")[1]
        if(!bearerToken) return res.status(403).json({error: true, msg: "token not provided"})
        const decoded = jwt.verify(token, process.env.AUTH_SECRET)
        if(decoded){
            req.body.user = decoded
            next()
        }else{
          res.status(403).send({error: true, msg: 'something went wrong'})
        }
    } catch (error) {
        res.status(403).send({error: true, msg: error.message})
    }
}