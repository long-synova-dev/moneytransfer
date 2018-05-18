import { Component, OnInit } from '@angular/core';
import { fadeTransition } from '../../../animations/fade-transition';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyTagService } from '../../../shared/services/company-tag.service';
import { Globals } from '../../../shared/global/global';
import { Tag } from '../../../shared/models/tag.model';
import { TreePath } from '../../../shared/models/tree-path.model';
import { DataService } from '../../../shared/services/data.service';
import { AlertService } from '../../../shared/services/alert.service';
import { tableColumnHighlightTransition } from '../../../animations/table-column-highlight-transition';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { ModalDialog } from '../../../shared/models/modal-dialog.model';

@Component({
    templateUrl: './gdpr-data-analysis-step-1.component.html',
    styleUrls: ['../../gdpr.component.css'],
    animations: [fadeTransition(), tableColumnHighlightTransition()],
    host: { '[@fadeTransition]': '' }
})

export class GdprDataAnalysisStep1Component implements OnInit {

    deleteProcessConfirm: ModalDialog;
    deleteITSystemConfirm: ModalDialog;
    curDeleteTag: Tag;

    ready: boolean = false;
    listProcesses: Array<Tag>;
    customProcess: string;
    selectedProcesses: Array<Tag> = new Array<Tag>();

    listItSystems: Array<Tag>;
    customItSystem: string;
    selectedItSystems: Array<Tag> = new Array<Tag>();

    processState: string = 'valid';
    itSystemState: string = 'valid';

    constructor(
        private _companyTagService: CompanyTagService,
        private _data: DataService,
        private _alert: AlertService,
        private _translate: TranslateService,
        private _router: Router
    ) { 
        this.deleteProcessConfirm = new ModalDialog("Confirm", "modal-md", false);
        this.deleteITSystemConfirm = new ModalDialog("Confirm", "modal-md", false);
    }

    ngOnInit(): void {
        this._data.changeLoadStatus(true);        
        this._companyTagService.getTagsByCategory(Globals.CATEGORY_PROCESS, false)
            .then(data => {
                this.listProcesses = data;
                this._companyTagService.traverseTree(new TreePath([], Globals.CATEGORY_PROCESS))
                    .then(data => {
                        this.selectedProcesses = data.map(item => item[0]);
                        this.listProcesses.forEach(item => {
                            if (this.selectedProcesses.find(sub => sub.tagId === item.tagId)) {
                                item.marked = true;
                                item.fromTree = true;
                            }
                        });
                        this.ready = true;
                        this._data.changeLoadStatus(false);                        
                    });
            });

        this._companyTagService.getTagsByCategory(Globals.CATEGORY_IT_SYSTEM, false)
            .then(data => {
                this.listItSystems = data;
                this._companyTagService.traverseTree(new TreePath([], Globals.CATEGORY_IT_SYSTEM))
                    .then(data => {
                        this.selectedItSystems = data.map(item => item[0]);
                        this.listItSystems.forEach(item => {
                            if (this.selectedItSystems.find(sub => sub.tagId === item.tagId)) {
                                item.marked = true;
                                item.fromTree = true;
                            }
                        })
                    });
            });
    }

    clickProcess(tag: Tag) {
        if (tag.marked) {
            this.addProcess(tag);
        } else {
            this.confirmDeleteProcess(tag);
        }
    }

    clickItSystem(tag: Tag) {
        if (tag.marked) {
            this.addItSystem(tag);
        } else {
            this.confirmDeleteIT(tag);
        }
    }

    addProcess(tag: Tag) {
        let existed = false;
        this.selectedProcesses.filter(item => {
            if (item.tagId === tag.tagId) {
                item.deleting = false;
                existed = true;
            }
        });
        if (!existed) {
            this.selectedProcesses.push(tag);
        }
    }

    addItSystem(tag: Tag) {
        let existed = false;
        this.selectedItSystems.filter(item => {
            if (item.tagId === tag.tagId) {
                item.deleting = false;
                existed = true;
            }
        });
        if (!existed) {
            this.selectedItSystems.push(tag);
        }
    }

    confirmDeleteProcess(tag)
    {
        // just confirm delete when the tag is saved to tree.
        this.curDeleteTag = tag;
        if(tag.fromTree)
        {
            this.deleteProcessConfirm.visible = true;
        }
        else
        {
            this.deleteProcess();
        }
    }

    closeDelete(isCancel: boolean)
    {
        this.deleteProcessConfirm.visible = false;
        this.deleteITSystemConfirm.visible = false;
        if(isCancel)
        {
            this.curDeleteTag.marked = true;
        }
        this.curDeleteTag = null;
    }

    confirmDeleteIT(tag)
    {
         // just confirm delete when the tag is saved to tree.
         this.curDeleteTag = tag;
         if(tag.fromTree)
         {
            this.deleteITSystemConfirm.visible = true;
         }
         else
         {
             this.deleteItSystem();
         }
    }

    deleteProcess() {
        //if existing in the tree, just marked it as deleted, otherwise remove it
        if (this.curDeleteTag.fromTree) {
            this.selectedProcesses.forEach(item => {
                if (item.tagId === this.curDeleteTag.tagId) {
                    item.deleting = true;
                }
            });
        } else {
            this.selectedProcesses = this.selectedProcesses.filter(item => item.tagId !== this.curDeleteTag.tagId);
        }

        this.listProcesses.forEach(item => {
            if (item.tagId === this.curDeleteTag.tagId) {
                item.marked = false;
            }
        });
        this.closeDelete(false);
    }

    deleteItSystem() {
        //if existing in the tree, just marked it as deleted, otherwise remove it
        if (this.curDeleteTag.fromTree) {
            this.selectedItSystems.forEach(item => {
                if (item.tagId === this.curDeleteTag.tagId) {
                    item.deleting = true;
                }
            });
        } else {
            this.selectedItSystems = this.selectedItSystems.filter(item => item.tagId !== this.curDeleteTag.tagId);
        }

        this.listItSystems.forEach(item => {
            if (item.tagId === this.curDeleteTag.tagId) {
                item.marked = false;
            }
        });
        this.closeDelete(false);
    }

    addCustomProcess() {
        if (this.customProcess) {
            let newTag = new Tag(this.customProcess, Globals.CATEGORY_PROCESS, null);
            this.addProcess(newTag);
            this.customProcess = null;
        }
    }

    addCustomItSystem() {
        if (this.customItSystem) {
            let newTag = new Tag(this.customItSystem, Globals.CATEGORY_IT_SYSTEM, null);
            this.addItSystem(newTag);
            this.customItSystem = null;
        }
    }

    save(cont: boolean) {
        if (cont && !this._validate()) {
            return;
        }
        this._data.changeLoadStatus(true);        
        let processTuples = this.selectedProcesses.map(item => new Array<Tag>(item));
        let itSystemTuples = this.selectedItSystems.map(item => new Array<Tag>(item));
        this._companyTagService.addTagToTree([...processTuples, ...itSystemTuples])
            .then(data => {
                if (data.result === 'Success') {
                    this._translate.get('General.SavedSucess').subscribe(value => this._alert.success(value, null, true, true));
                    this._data.changeLoadStatus(false);                    
                }
                if (cont) {
                    this._companyTagService.isStepSaved(true);
                    this._router.navigate(['gdpr-wizard', 'data-analysis', 'step-2']);
                } else {
                    this._router.navigate(['gdpr-wizard', 'getstarted']);
                }
            });
    }

    private _validate() {
        let result = true;

        if (this.selectedProcesses.filter(p => !p.deleting).length === 0) {
            this.processState = 'invalid';
            this._translate.get('SecondStep.ValidationNoProcess').subscribe(value =>  this._alert.error(value));
            result = false;
        }

        if (this.selectedItSystems.filter(p => !p.deleting).length === 0) {
            this.itSystemState = 'invalid'
            this._translate.get('SecondStep.ValidationNoITSystem').subscribe(value =>  this._alert.error(value));
            result = false;
        }

        let timer = Observable.timer(2000).subscribe(() => {
            this.processState = 'valid';
            this.itSystemState = 'valid';
            timer.unsubscribe();
        });

        return result;
    }
}