export class Alert {
    type: AlertType;
    message: string;
    buttons: any[];
    autoDismiss: boolean;
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}