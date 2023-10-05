import {NgbToastOptions} from "@ng-bootstrap/ng-bootstrap/toast/toast-config";

export interface IToastOptions extends NgbToastOptions {
    header?: string;
    classname?: string;
}
