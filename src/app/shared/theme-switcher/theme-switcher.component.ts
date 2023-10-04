import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

import {ThemeService} from "../../services";

@Component({
  standalone: true,
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./theme-switcher.component.sass']
})
export class ThemeSwitcherComponent implements OnInit {

  constructor(public theme: ThemeService) {
  }

  ngOnInit(): void {
  }

  public onSwitchTheme(): void {
    this.theme.switchTheme();
  }

}
