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

export default class Book {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(10)
  @Max(100)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsUrl()
  image: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsBoolean()
  isActive: boolean;

  constructor(
    title: string,
    price: number,
    description: string,
    genre: string,
    image: string,
    authorName: string,
    isActive: boolean
  ) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.genre = genre;
    this.image = image;
    this.authorName = authorName;
    this.isActive = isActive;
  }
}
