import { Tag } from './tag.model';

export class TreePath {
    path: Array<string>;
    categoryCode: string;

    constructor(path: Array<string>, category: string) {
        this.path = path;
        this.categoryCode = category;
    }
}