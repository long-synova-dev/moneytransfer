import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from '../global/global';
import { RequestOptions, Headers } from "@angular/http";
import { FileUploader } from 'ng2-file-upload';
import { Http } from "@angular/http";

@Injectable()
export class FileUploadService {
    constructor(
        private _httpClient: HttpClient
    ) { }

    public getUploadedFile(fileType, refId)
    {
        return this._httpClient.get(`${ Globals.GET_UPLOADED_FILE_URL}/${fileType}/${refId}`)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    public downloadFile(id)
    {
        return this._httpClient.get(`${ Globals.DOWNLOAD_FILE_URL}/${id}`)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}