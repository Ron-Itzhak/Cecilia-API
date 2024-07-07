import { bucket, db } from "../../database/firebase";
import Author from "./models/Author";
import { v4 as uuidv4 } from "uuid";

import multer from "multer";
import { AuthorDTO } from "./models/AuthorDTO";
import { validate } from "class-validator";
const AUTHORS = "authors";
const BOOKS = "books";

export async function fetchAuthors(): Promise<Author[]> {
  const authorsRef = db.collection(AUTHORS);
  const snapshot = await authorsRef.get();
  if (snapshot.empty) {
    return [];
  }

  const authors: Author[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const author = new Author(
      data.name,
      data.books,
      data.country,
      data.picture,
      data.age,
      data.isActive
    );
    authors.push(author);
  });

  return authors;
}

export async function addAuthor({
  name,
  books,
  country,
  picture,
  age,
  isActive,
}: AuthorDTO): Promise<Author> {
  const pictureName = `authors/${uuidv4()}_${picture.originalname}`;
  const file = bucket.file(pictureName);
  const normalizedName = name.toLowerCase();

  const newAuthor = await db.runTransaction(async (transaction) => {
    const authorsRef = db.collection(AUTHORS);
    const querySnapshot = await transaction.get(
      authorsRef.where("normalizedName", "==", normalizedName)
    );

    if (!querySnapshot.empty) {
      throw new Error("Author with this name already exists");
    }

    await file.save(picture.buffer, {
      metadata: { contentType: picture.mimetype },
      public: true,
    });
    const pictureUrl = file.publicUrl();
    const authorData: Author = {
      name,
      books,
      country,
      picture: pictureUrl,
      age,
      isActive,
    };
    transaction.set(authorsRef.doc(), {
      ...authorData,
      normalizedName: name.toLowerCase(),
    });
    return new Author(name, books, country, pictureUrl, age, isActive);
  });
  return newAuthor;
}

export async function updateAuthorStatus(
  name: string,
  isActive: boolean
): Promise<Author | null> {
  const authorName = name;
  const normalizedName = name.toLowerCase();
  try {
    const updatedAuthor = await db.runTransaction(async (transaction) => {
      const authorsRef = db.collection(AUTHORS);
      const querySnapshot = await transaction.get(
        authorsRef.where("normalizedName", "==", normalizedName)
      );

      if (querySnapshot.empty) {
        return null;
      }

      const authorDoc = querySnapshot.docs[0];
      const authorRef = authorDoc.ref;
      const booksRef = db.collection(BOOKS);
      const booksSnapshot = await transaction.get(
        booksRef.where("authorName", "==", authorName)
      );
      if (booksSnapshot.empty) {
      } else {
        booksSnapshot.docs.forEach((doc) => {
          transaction.update(doc.ref, { isActive });
        });
      }
      transaction.update(authorRef, { isActive });
      const updatedData = { ...(authorDoc.data() as Author), isActive };
      const { name, books, country, picture, age } = updatedData;
      return new Author(name, books, country, picture, age, isActive);
    });

    return updatedAuthor;
  } catch (error) {
    throw new Error("Failed to update author status");
  }
}
