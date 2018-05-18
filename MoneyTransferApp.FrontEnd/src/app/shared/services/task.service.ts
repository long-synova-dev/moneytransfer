import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Globals } from '../global/global';
import { Task } from '../models/task.model';

@Injectable()
export class TaskService {
    constructor(
        private _http: HttpClient
    ) { }

    public getTaskById(taskId: any) {
        let url = `${Globals.GET_TASK_URL}/${taskId}`;
        return this._http
            .get(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    public getAllTask() {
        return this._http
            .get(Globals.GETALL_TASK_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);

    }
    public getProcessOptions() {
        return this._http
            .get(Globals.GET_PROCESS_OPTIONS_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    public addNewTask(task) {
        return this._http
            .put(Globals.ADD_NEW_TASK_URL, JSON.stringify(task))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);

    }
    public updateTask(task) {
        return this._http
            .post(Globals.UPDATE_TASK_URL, JSON.stringify(task))
            .toPromise()
            .then((response) => response)
            .catch(this.handleError);
    }
    public deleteTask(taskId) {
        let url = `${Globals.DELETE_TASK_URL}/${taskId}`;
        return this._http
            .delete(url)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    public getRiskOptions() {
        return this._http
            .get(Globals.GET_RISK_OPTIONS_URL)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getAllTaskBy(type) {
        return this._http
            .post(`${Globals.GET_ALL_TASK_BY_TYPE}/${type}`, {})
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public getTaskDetail(taskId) {
        return this._http
            .get(`${Globals.GET_TASK_DETAIL}/${taskId}`)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    public updateAssignee(model) {
        return this._http
            .post(Globals.UPDATE_ASSIGNEE_OF_TASK, model)
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }
    public changeStatus(taskId, type) {
        return this._http
            .post(`${Globals.GET_TASK_DETAIL}/${taskId}/${type}`, {})
            .toPromise()
            .then(response => response)
            .catch(this.handleError);
    }

    public updateTaskDetail(model) {
        model.todos.forEach(todo => {
            todo.uploader = undefined;
            todo.uploadedFile = undefined;
        });
        
        return this._http
            .post(Globals.UPDATE_TASK, model)
            .toPromise()
            .then(response => {
                console.log(response)
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}