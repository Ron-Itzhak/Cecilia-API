import express from "express";
import multer from "multer";

import * as booksController from "./booksController";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get("/", booksController.getBooks);
router.post("/", upload.single("image"), booksController.postAddBook);
router.put("/updateStatus", booksController.putUdateActiveStatus);

export default router;
