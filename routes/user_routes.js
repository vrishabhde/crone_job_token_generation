import  express from "express";
import { getsearch, search } from "../controller/user_controller.js";



const router = express.Router();

router.post("/search", search);
router.post("/getsearch", getsearch);

export default router;