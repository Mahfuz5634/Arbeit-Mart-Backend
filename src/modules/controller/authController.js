import User from "../../models/User.js";
import bcrypt from 'bcrypt';
import jwtToken from "../../utils/jwtToken.js";
import config from "../../config/index.js";
import { hash } from "bcrypt";


const registerUser=async(req,res)=>{
    try {
        console.log(req.body);
        const {name,email,password,role}=req.body;

        if(!name,!email,!password){
            return res.status(400).json({message:'fill all the field'})
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message:'User Already Exist'})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,email,password:hashedPassword,
            role:role || 'customer'
        })
        if (user) {
      res.status(201).json({
        success:true,
        message:"Register successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: jwtToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'invalid data' });
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
         success: true,
         message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: jwtToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Wrong email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 const authController={
    registerUser,
    loginUser
}

export default authController;