import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {BookListComponent, ReadingListComponent} from "./components";
import {ThemeSwitcherComponent} from "./shared";
import {BookService, LocalStorageService} from "./services";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BookListComponent,
    ThemeSwitcherComponent,
    ReadingListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-book-list';

  fetchBooksSubs: Subscription;
  storageEventSubs: any;

  constructor(private ngZone: NgZone,
              private bookService: BookService,
              private localStorageService: LocalStorageService,
  ) {
    this.fetchBooksSubs = new Subscription();
  }

  ngOnInit() {
    this.initApp();
    // Books Changes in others windows;
    this.storageEventSubs = window.addEventListener('storage', this.handleStorageEvent.bind(this));
  }

  ngOnDestroy() {
    this.fetchBooksSubs.unsubscribe();
    window.removeEventListener('storage', this.storageEventSubs)
  }

  private initApp() {
    const storedBooks = JSON.parse(this.localStorageService.getItem('books')!);
    if (!storedBooks) {

      this.fetchBooksSubs = this.bookService.fetchBooks().subscribe(
        books => this.bookService.setBooks(books)
      )
    } else {

      this.bookService.setBooks(storedBooks);
    }
  }

  private handleStorageEvent(event: StorageEvent) {
    if (event.key === 'books') {
      this.ngZone.run(() => {
        if (JSON.parse(event.newValue!)) {
          this.bookService.setBooks(JSON.parse(event.newValue!));
        }
      });
    }
  }

}
