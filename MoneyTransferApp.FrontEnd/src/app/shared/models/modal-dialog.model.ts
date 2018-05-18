export class ModalDialog {
    title: string;
    sizeClass: string;
    buttons: any[];
    visible: boolean;
    isModal: boolean;
    
    constructor(title, sizeClass, isModal) {
        this.title = title;
        this.sizeClass = sizeClass;
        this.isModal = isModal;
    }
}
