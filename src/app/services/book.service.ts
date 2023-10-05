import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, take} from "rxjs";

import {IApiResponse, IBook, IPagesRange} from "../interfaces";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private bookList$: BehaviorSubject<IBook[]>;
  private filteredBookList$: BehaviorSubject<IBook[]>;

  private currentGenreFilter: string;
  private currentPageFilter: number;
  private currentTitleFilter: string;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
    this.bookList$ = new BehaviorSubject<IBook[]>([]);
    this.filteredBookList$ = new BehaviorSubject<IBook[]>([]);

    this.currentGenreFilter = 'All';
    this.currentPageFilter = -1;
    this.currentTitleFilter = '';
  }

  // Getters
  getBookList(): Observable<IBook[]> {
    return this.filteredBookList$.asObservable();
  };

  getFullBookListValue(): IBook[] {
    return this.bookList$.getValue();
  }

  getReadingList(): Observable<IBook[]> {
    return this.bookList$.pipe(
      map(books => books.filter(book => book.isReading))
    );
  };

  getGenres(): Observable<string[]> {
    return this.bookList$.pipe(
      map(books => {
        const genres = books.map(book => book.genre);
        return ['All', ...new Set(genres)];
      })
    );
  }

  getPageRange(): Observable<IPagesRange> {
    return this.filteredBookList$.pipe(
      // skip(1), // Skip behavior subject initial value
      take(1), // Then just take one value and set the observable as completed
      map(books => {
          const pages = books.map(book => book.pages)
            .sort((a, b) => a - b);

          return {
            minPage: pages[0],
            maxPage: pages[pages.length - 1]
          };
        }
      ),
    )
  }

  // Setters
  setBooks(books: IBook[]): void {
    this.bookList$.next(books);
    this.applyFilters();
    this.localStorageService.setItem('books', books);
  };

  // Http
  fetchBooks(): Observable<IBook[]> {
    return this.http.get<IApiResponse>('/assets/books.json')
      .pipe(
        map(apiRes => {
          // Map Library books to IBooks
          return apiRes.library.map(libraryItem => {
            const {ISBN, ...rest} = libraryItem.book;
            return {
              isReading: false,
              id: ISBN,
              ...rest,
            }
          })
        })
      )
  }

  // Functionalities
  // Reading list Functionality
  switchIsReadingBook(id: string): void {
    const updatedBookList: IBook[] = [...this.bookList$.getValue()];
    const bookIndex = updatedBookList.findIndex(book => book.id === id);

    if (bookIndex !== -1) {
      updatedBookList[bookIndex].isReading = !updatedBookList[bookIndex].isReading;
      this.setBooks(updatedBookList);
    }
  };

  // Filter Functionality

  // Filter by genre
  filterByGenre(genre: string): void {
    this.currentGenreFilter = genre;
    this.applyFilters();
  };

  // Filter by page
  filterByPage(page: number) {
    this.currentPageFilter = page;
    this.applyFilters();
  }

  // Filter by title
  filterByTitle(term: string) {
    this.currentTitleFilter = term;
    this.applyFilters();
  }

  clearFilterByTitle() {
    this.currentTitleFilter = '';
    this.applyFilters();
  }

  // Apply all filters at the same time
  private applyFilters(): void {
    let filteredBooks = [...this.bookList$.getValue()];

    // Filter by genre
    if (this.currentGenreFilter !== 'All') {
      filteredBooks = filteredBooks.filter(
        book => book.genre === this.currentGenreFilter);
    }

    // Filter by page
    if (this.currentPageFilter > 0) {
      filteredBooks = filteredBooks.filter(
        book => book.pages <= this.currentPageFilter);
    }

    // Filter by title
    if (this.currentTitleFilter.length > 0) {
      filteredBooks = filteredBooks.filter(
        book => book.title.toLowerCase()
          .includes(this.currentTitleFilter.toLowerCase()));
    }

    this.filteredBookList$.next(filteredBooks);
  };


}
