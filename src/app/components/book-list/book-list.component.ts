import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map, Observable, OperatorFunction, Subscription} from "rxjs";

import {BookComponent} from "../../shared";
import {BookService} from "../../services";
import {IBook, IPagesRange} from "../../interfaces";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    BookComponent,
    ReactiveFormsModule,
    NgClass,
    NgbTypeahead,
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {
  bookList$: Observable<IBook[]>;
  genres$: Observable<string[]>;

  pagesRange: IPagesRange;

  filtersForm: FormGroup;

  bookListSub: Subscription;

  constructor(private bookService: BookService,
              private fb: FormBuilder) {

    // Variables initialization
    this.bookList$ = new Observable<IBook[]>();
    this.genres$ = new Observable<string[]>();

    this.pagesRange = {
      minPage: -1,
      maxPage: -1,
    };

    this.bookListSub = new Subscription();

    // Form initialization
    this.filtersForm = this.fb.group({
        currentPage: [0],
        selectedGenre: ['All'],
        currentTitleSearch: [''],
      }
    );
  };

  ngOnInit() {
    this.bookList$ = this.bookService.getBookList();
    this.genres$ = this.bookService.getGenres();

    this.bookService.getPageRange()
      .subscribe(booksPagesRange => {
        this.pagesRange = booksPagesRange;
        this.filtersForm.patchValue({currentPage: booksPagesRange.maxPage});
      });

    this.filtersForm.get('selectedGenre')?.valueChanges.subscribe((genre: string) => {
      this.bookService.filterByGenre(genre);
    });

    this.filtersForm.get('currentPage')?.valueChanges.subscribe((page: number) => {
      this.bookService.filterByPage(page);
    });

    this.filtersForm.get('currentTitleSearch')?.valueChanges.subscribe((value: any) => {
      if (typeof value === 'object') {
        this.bookService.searchByTitle(value);
      }
    });
  }

  ngOnDestroy() {
    this.bookListSub.unsubscribe();
  }

  // Search by title Feature
    // Formatter for the BookSSearch BookS Formatter
  searchBookFormatter = (book: IBook) => book.title;
  search: OperatorFunction<string, readonly IBook[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1 ? [] : this.bookService.getFullBookListValue().filter((book) => book.title.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

}
