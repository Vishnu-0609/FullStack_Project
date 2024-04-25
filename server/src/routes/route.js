import { Router } from "express";
import { registerUser,EmptySocketId,getAllUser,getAllDocuments,deleteDocument,getAllHistory } from "../controllers/authentication.js";
import { upload } from "../middleware/multer.js";

const router=Router();

router.route("/register").post(upload.fields([
    {
        name:"Avatar",
        maxCount:1
    }
]),registerUser);
router.route("/emptySocket").post(EmptySocketId);
router.route("/getAllUser").post(getAllUser);
router.route("/getAllDocuments").post(getAllDocuments);
router.route("/deleteDocuments").post(deleteDocument);
router.route("/getAllHistory").post(getAllHistory);

export {router}