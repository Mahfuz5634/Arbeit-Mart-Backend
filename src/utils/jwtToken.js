import jwt from "jsonwebtoken";
import config from "../config/index.js";


 const jwtToken=(id)=>{
    return jwt.sign({id},config.jwt_secret,{expiresIn:'15d'});
 };
 export default jwtToken;