import mongoose  from "mongoose";
import config from "../config/index.js";
import dns from "dns";

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'

])


const connectDb = async()=>{
    try {
        await mongoose.connect(config.database_url);
        console.log("Db connected");
    } catch (error) {
        console.error("Db connection error");
        console.error(error);
        process.exit(1);
    }
}
export default connectDb;