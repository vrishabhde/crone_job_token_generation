import express  from "express";
import morgan from "morgan";
import mongoose from "mongoose";

import router from "./routes/user_routes.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use("/api/v1", router);

mongoose.connect('mongodb+srv://vrushabhde:vrushabhdeMDB@cluster0.41dmrwv.mongodb.net/cronDB?retryWrites=true&w=majority')
.then(()=>console.log("cron DB connected"))
.catch((err)=>console.log("DB error =>",err))
app.listen(6001);



