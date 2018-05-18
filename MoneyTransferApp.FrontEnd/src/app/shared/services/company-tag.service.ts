import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Tag } from '../models/tag.model';
import { TreePath } from '../models/tree-path.model';


@Injectable()
export class CompanyTagService {
    private _sharedTuple: Array<Tag>;
    private _isSaved = new Subject<boolean>();
    isSaved = this._isSaved.asObservable();

    private _isNoCompleted = new Subject<boolean>();
    isNoCompleted = this._isNoCompleted.asObservable();

    constructor(
        private _http: HttpClient
    ) { }

    public getTagsByCategory(catId, option = null) {
        let url = `${Globals.GET_TAGS_BY_CATEGORY_URL}?code=${catId}`;
        if (option !== null) {
            url = `${url}&option=${option}`;
        }
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getTypesByCategory(catId) {
        return this._http
            .get(`${Globals.GET_TYPES_BY_CATEGORY_URL}?code=${catId}`)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public addTagToTree(tuples: Array<Array<Tag>>) {
        return this._http
            .post(Globals.ADD_TAGS_TO_TREE_URL, JSON.stringify(tuples))
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public traverseTree(path: TreePath) {
        return this._http
            .post(Globals.TRAVERSE_TAG_TREE_URL, JSON.stringify(path))
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getQuestionByCode(code)
    {
        return this._http
            .get(`${Globals.GET_QUESTION_BY_CODE}?code=${code}`)
            .toPromise().then(response => response)
            .catch(this.handleError);            
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

    public setSharedTuple(tuple: Array<Tag>) {
        this._sharedTuple = tuple;
    }

    public getSharedTuple() {
        return this._sharedTuple;
    }

    public isStepSaved(saved: boolean) {
        this._isSaved.next(saved);
    }

    public isStepNoCompleted(saved: boolean) {
        this._isNoCompleted.next(saved);
    }

    public getSuggestionsForMethodReceiveData()
    {
        return this._http
            .get(Globals.GET_SUGGESTIONS_FOR_METHOD_RECEIVE_URL)
            .toPromise().then(response => response)
            .catch(this.handleError);            
    }

    public getSuggestionsForDataSources()
    {
        return this._http
            .get(Globals.GET_SUGGESTIONS_FOR_DATA_SOURCE_URL)
            .toPromise().then(response => response)
            .catch(this.handleError);            
    }

    public getSuggestionsForDataOwners()
    {
        return this._http
            .get(Globals.GET_SUGGESTIONS_FOR_DATA_OWNER_URL)
            .toPromise().then(response => response)
            .catch(this.handleError);            
    }
    
    public generateProgram()
    {
        return this._http
            .post(Globals.GENERATE_GDPR_PROGRAM_URL, {})
            .toPromise().then(response => response)
            .catch(this.handleError);            
    }

    public updateStep3Status(processId, privacyDataTypeId, status) {
        let url = `${Globals.UPDATE_STEP3_STATUS_URL}/${processId}/${privacyDataTypeId}/${status}`;
        return this._http
            .post(url, {})
            .toPromise().then(response => response)
            .catch(this.handleError);
    }
}