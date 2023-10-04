import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public static default = 'light';
  private readonly style: HTMLLinkElement;

  constructor() {
    this.style = document.createElement('link');
    this.style.rel = 'stylesheet';
    document.head.appendChild(this.style);

    this.applyTheme(this.getCurrent());
  }

  getCurrent(): string {
    return localStorage.getItem('theme') ?? ThemeService.default;
  }

  setCurrent(value: string) {
    if (this.getCurrent() === value) return;

    localStorage.setItem('theme', value);
    this.applyTheme(value);
  }

  switchTheme(): void {
    if (this.getCurrent() === 'light') {
      this.setCurrent('dark');
    } else {
      this.setCurrent('light');
    }
  }

  private applyTheme(theme: string) {
    this.style.href = `./${theme}.css`;
  }
}
