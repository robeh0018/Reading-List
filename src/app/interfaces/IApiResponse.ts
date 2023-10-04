import {IAuthor} from "./IAuthor";

export interface IApiResponse {
  library: TLibrary[];
}

export type TLibrary = {
  book: {
    ISBN: string;
    title: string;
    pages: number;
    genre: string;
    cover: string;
    synopsis: string;
    year: number;
    author: IAuthor;
  }

}
