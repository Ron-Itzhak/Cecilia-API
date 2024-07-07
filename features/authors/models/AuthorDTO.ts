export interface AuthorDTO {
  name: string;
  books: string[];
  country: string;
  picture: Express.Multer.File;
  age: number;
  isActive: boolean;
}
