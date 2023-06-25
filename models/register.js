import mongoose from "mongoose";
import { Schema } from "mongoose";

const newuser = new Schema({

   access_token: String
   
});

export default mongoose.model("Users", newuser);