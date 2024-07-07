import {
  IsString,
  IsArray,
  IsUrl,
  IsNumber,
  IsBoolean,
  ArrayNotEmpty,
  Min,
  Max,
  IsNotEmpty,
} from "class-validator";

export default class Author {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  books: string[];

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  picture: string;

  @IsNumber()
  @Min(0)
  @Max(120)
  age: number;

  @IsBoolean()
  isActive: boolean;

  constructor(
    name: string,
    books: string[],
    country: string,
    picture: string,
    age: number,
    isActive: boolean
  ) {
    this.name = name;
    this.books = books;
    this.country = country;
    this.picture = picture;
    this.age = age;
    this.isActive = isActive;
  }
}
