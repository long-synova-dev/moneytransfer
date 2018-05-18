export class Page {
    pageNumber: number;
    itemsPerPage: number = 10;
    orderBy: string = '';
    keyword: string = '';
    isDesc: boolean = false;
    totalElements: number = 0;
    totalPages: number = 0;
}