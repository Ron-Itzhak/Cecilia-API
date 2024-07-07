import * as authorController from "./authorController";
import multer from "multer";
const express = require("express");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get("/", authorController.getAuthors);
router.post("/", upload.single("picture"), authorController.postAddAuthor);
router.put("/updateStatus", authorController.putUdateActiveStatus);
export default router;
