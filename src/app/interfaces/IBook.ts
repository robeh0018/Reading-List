import {IAuthor} from "./IAuthor";

export interface IBook {
  isReading: boolean,
  id: string;
  title: string;
  pages: number;
  genre: string;
  cover: string;
  synopsis: string;
  year: number;
  author: IAuthor;
}
