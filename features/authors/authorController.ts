import { Request, Response } from "express";

import { addAuthor, fetchAuthors, updateAuthorStatus } from "./authorsService";

export const getAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await fetchAuthors();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).send("Error retrieving authors");
  }
};

export const postAddAuthor = async (req: Request, res: Response) => {
  try {
    const { name, country, age } = req.body;
    const picture = req.file;
    if (!name || !country || !age || !picture) {
      return res.status(400).send("Missing required fields");
    }
    const newAuthor = await addAuthor({
      name,
      books: [],
      country,
      picture,
      age: Number(age),
      isActive: true,
    });

    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const putUdateActiveStatus = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    let { isActive } = req.body;

    if (typeof isActive === "string") {
      isActive = isActive === "true";
    }
    if (typeof isActive !== "boolean") {
      return res.status(400).send("Invalid isActive value");
    }

    const updatedAuthor = await updateAuthorStatus(name, isActive);

    if (!updatedAuthor) {
      return res.status(404).send("Author not found");
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).send("Error updating author status");
  }
};
