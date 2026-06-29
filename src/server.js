import app from "./app.js";
import config from "./config/index.js";
import connectDb from "./db/index.js";

const port = config.port;


connectDb()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;