import {Component, OnInit, TemplateRef} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {Observable} from "rxjs";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";

import {BookComponent} from "../../shared";
import {BookService} from "../../services";
import {IBook, IBookConfig} from "../../interfaces";

@Component({
  selector: 'app-reading-list',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    BookComponent
  ],
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit {
  readingList$: Observable<IBook[]>;

  bookCardConfig: IBookConfig;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private bookService: BookService) {

    this.readingList$ = new Observable<IBook[]>();

    this.bookCardConfig = {
      bookCardSize: 100,
      showTitle: false,
      showCloseButton: true,
      showMenuButton: false,
    }
  }

  ngOnInit() {
    this.readingList$ = this.bookService.getReadingList();
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {position: 'end'});
  }
}
