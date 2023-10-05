import {Injectable, TemplateRef} from '@angular/core';
import {IToastOptions} from "../interfaces";

@Injectable({providedIn: 'root'})
export class ToastService {
    toasts: any[] = [];

    show(textOrTpl: string | TemplateRef<any>, options: IToastOptions): void {
        this.toasts.push({textOrTpl, ...options});
    }

    remove(toast: any): void {
        this.toasts = this.toasts.filter((t) => t !== toast);
    }

    clear(): void {
        this.toasts.splice(0, this.toasts.length);
    }
}
