import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authorRouter from "./features/authors/authorRouter";
import booksRouter from "./features/books/booksRouter";

const app = express();
const port: number | string = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`api-server listening on port ${port}`);
});
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use("/authors", authorRouter);
app.use("/books", booksRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("api server works!");
});
