import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from '../global/global';
import { RequestOptions, Headers } from "@angular/http";
import { FileUploader } from 'ng2-file-upload';
import { Http } from "@angular/http";
import { ResponseContentType } from "@angular/http";

@Injectable()
export class AttachmentService {
    constructor(
        private _httpClient: HttpClient,
        private _http: Http
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
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
        return this._http.get(`${ Globals.DOWNLOAD_FILE_URL}/${id}`, { headers: headers, responseType: ResponseContentType.Blob })
        .toPromise()
        .then(response => response.blob())
        .catch(this.handleError);
    }

    public downloadAsPdf(id,type)
    {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
        return this._http.get(`${ Globals.DOWNLOAD_AS_PDF_URL}/${id}/${type}`, { headers: headers, responseType: ResponseContentType.Blob })
        .toPromise()
        .then(response => response.blob())
        .catch(this.handleError);
    }

    public isHascontent(id,type)
    {
        // let headers = new Headers();
        // headers.append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
        return this._httpClient
        .get(`${ Globals.IS_HAS_CONTENT}/${id}/${type}`)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    public deleteFile(id)
    {
        return this._httpClient.get(`${ Globals.DELETE_FILE_URL}/${id}`)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    public getRemainingQuota() {
        return this._httpClient.get(Globals.GET_REMAINING_QUOTA)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}