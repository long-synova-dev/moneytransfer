export class Tag {
    categoryCode: string;
    tagId: string;
    tagTypeId: string;
    isCustom: boolean = false;
    tagName: string;
    deleting: boolean = false;
    marked: boolean = false;
    fromTree: boolean = false;
    rowData: any;
    validateState: string;
    step3NoCompleted: boolean;

    constructor(tagName: string, categoryCode: string, tagTypeId: string = null, tagId: string = null) {
        if (tagId) {
            this.tagId = tagId;
        } else {
            this.tagId = new Date().getTime().toString();
        }
        this.tagName = tagName;
        this.categoryCode = categoryCode
        this.tagTypeId = tagTypeId;
        this.isCustom = true;
        this.validateState = 'valid';
    }
}