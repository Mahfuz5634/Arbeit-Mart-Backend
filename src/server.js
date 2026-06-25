import app from "./app.js";
import config from "./config/index.js";
import connectDb from "./db/index.js";

const port=config.port;

async function main(){
    try {
        await connectDb();
       app.listen(port,()=>{
         console.log(`server is running on port ${port}`);
       })
    } catch (error) {
        console.log(error);
    }
}
main();