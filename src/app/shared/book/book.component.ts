import {Component, Input, OnInit} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {IBook, IBookConfig} from "../../interfaces";
import {BookService} from "../../services";

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgbDropdown,
    NgbDropdownItem,
    NgbDropdownMenu,
    NgbDropdownToggle,
  ],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  @Input() book: IBook;

  @Input() config: IBookConfig;


  constructor(private bookService: BookService) {
    this.book = {
      id: '',
      isReading: false,
      title: '',
      cover: '',
      author: {
        name: '',
        otherBooks: [],
      },
      genre: '',
      pages: -1,
      year: -1,
      synopsis: '',
    }
    this.config = {
      bookCardSize: 300,
      showTitle: true,
      showCloseButton: false,
      showMenuButton: true,
    }
  }

  ngOnInit() {
  }

  onSwitchIsReading(id: string) {
    this.bookService.switchIsReadingBook(id);
  }

}
