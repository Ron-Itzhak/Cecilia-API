import { bucket, db } from "../../database/firebase";
import Book from "./models/Book";
import { v4 as uuidv4 } from "uuid";

interface NewBook {
  title: string;
  price: number;
  description: string;
  genre: string;
  image: Express.Multer.File;
  authorName: string;
  isActive: boolean;
}
export async function fetchBooks(): Promise<Book[]> {
  const bookssRef = db.collection("books");
  const snapshot = await bookssRef.get();
  if (snapshot.empty) {
    return [];
  }

  const books: Book[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as Book;
    const book = new Book(
      data.title,
      data.price,
      data.description,
      data.genre,
      data.image,
      data.authorName,
      data.isActive
    );
    books.push(book);
  });

  return books;
}

export async function addBook({
  title,
  price,
  description,
  genre,
  image,
  authorName,
  isActive,
}: NewBook): Promise<Book> {
  const author = new Book(
    title,
    price,
    description,
    genre,
    "",
    authorName,
    isActive
  );
  const authName = authorName;
  const pictureName = `books/${uuidv4()}_${image.originalname}`;
  const file = bucket.file(pictureName);

  const newBook = await db.runTransaction(async (transaction) => {
    const booksRef = db.collection("books");
    const querySnapshot = await transaction.get(
      booksRef.where("title", "==", title)
    );

    if (!querySnapshot.empty) {
      const bookDoc = querySnapshot.docs[0];
      const bookData = { ...(bookDoc.data() as Book) };

      const { authorName } = bookData;
      if (authorName === authName) {
        throw new Error("this author has the same book name already");
      }
    }
    const auhtorsRef = db.collection("authors");
    const auhtorQuerySnapshot = await transaction.get(
      auhtorsRef.where("name", "==", authorName)
    );
    if (auhtorQuerySnapshot.empty) {
      throw new Error("no author exists");
    }
    const authorDoc = auhtorQuerySnapshot.docs[0];
    const authorRef = authorDoc.ref;
    const authorBooks = authorDoc.data().books || [];
    authorBooks.push(title);
    transaction.update(authorRef, { books: authorBooks });
    await file.save(image.buffer, {
      metadata: { contentType: image.mimetype },
      public: true,
    });

    const pictureUrl = file.publicUrl();

    const bookData: Book = {
      title,
      price,
      description,
      genre,
      authorName,
      image: pictureUrl,
      isActive,
    };
    transaction.set(booksRef.doc(), bookData);

    return new Book(
      title,
      price,
      description,
      genre,
      pictureUrl,
      authorName,
      isActive
    );
  });
  return newBook;
}
export async function updateBookStatus(
  title: string,
  isActive: boolean
): Promise<Book | null> {
  const titleName = title;

  try {
    const updatedBook = await db.runTransaction(async (transaction) => {
      const booksRef = db.collection("books");
      const querySnapshot = await transaction.get(
        booksRef.where("title", "==", titleName)
      );
      if (querySnapshot.empty) {
        return null;
      }
      const bookDoc = querySnapshot.docs[0];
      const bookRef = bookDoc.ref;
      transaction.update(bookRef, { isActive });
      const updatedData = { ...(bookDoc.data() as Book), isActive };
      const { title, price, description, genre, image, authorName } =
        updatedData;
      return new Book(
        title,
        price,
        description,
        genre,
        image,
        authorName,
        isActive
      );
    });

    return updatedBook;
  } catch (error) {
    throw new Error("Failed to update author status");
  }
}
