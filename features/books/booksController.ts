import { Request, Response } from "express";
import { addBook, fetchBooks, updateBookStatus } from "./booksService";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await fetchBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving books");
  }
};

export const postAddBook = async (req: Request, res: Response) => {
  try {
    const { title, price, description, genre, authorName } = req.body;
    const image = req.file;
    if (!title || !price || !description || !genre || !authorName || !image) {
      return res.status(400).send("Missing required fields");
    }
    const newBook = await addBook({
      title,
      price: Number(price),
      description,
      genre,
      image,
      authorName,
      isActive: true,
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const putUdateActiveStatus = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    let { isActive } = req.body;
    if (!title || !isActive) {
      return res.status(400).send("Missing required fields");
    }

    if (typeof isActive === "string") {
      isActive = isActive === "true";
    }
    if (typeof isActive !== "boolean") {
      return res.status(400).send("Invalid isActive value");
    }

    const updatedBook = await updateBookStatus(title, isActive);

    if (!updatedBook) {
      return res.status(404).send("Book not found");
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).send("Error updating author status");
  }
};
