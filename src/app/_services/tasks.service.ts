import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { Task } from '../_models/task';
import { Subject } from 'rxjs/Subject';



@Injectable()
export class TasksService {

    tasksCollection: AngularFirestoreCollection<Task> = this.afs.collection<Task>('tasks');
    taskDocument: AngularFirestoreDocument<Task>;

    tasks: Observable<Task[]>;

    editedTask = new Subject<Task>();

    lastUpdateSubject = new Subject<any>();
    lastUpdate;

    taskToEdit: Task;

    constructor(private afs: AngularFirestore) {}

    getTasks() {
        this.tasks = this.tasksCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as Task;
              data.id = a.payload.doc.id;
              return data;
            });
          });
          this.sendLastUpdate();
          return this.tasks;
    }

    addTask(task: Task) {
        this.tasksCollection.add(task);
        this.sendLastUpdate();
    }

    editTask(task: any) {
        this.taskToEdit = task;
        this.editedTask.next(this.taskToEdit);
    }

    taskToEditReset() {
        return this.taskToEdit = {
            id: '',
            closedAt: 0,
            createdAt: 0,
            createdBy: '',
            isDone: false,
            todo: '',
            updatedAt: 0
          };
    }

    getEditedTask() {
        console.log('edited task', this.editedTask);
    }

    updateCheckedOrUnchecked(taskId: string, isDone: boolean) {
        this.taskDocument = this.tasksCollection.doc<Task>(taskId);
        if (isDone) {
            this.taskDocument.update({ isDone, closedAt: Date.now() });
        } else {
            this.taskDocument.update({ isDone, closedAt: 0 });
        }
        this.lastUpdate = Date.now();
        this.lastUpdateSubject.next(this.lastUpdate);
    }

    updateTask(taskId: string, task: Task) {
        this.taskDocument = this.tasksCollection.doc<Task>(taskId);
        this.taskDocument.update(task);
        this.editedTask.next(this.taskToEditReset());
    }

    deleteTask(taskId: string) {
        this.taskDocument = this.tasksCollection.doc<Task>(taskId);
        this.taskDocument.delete();
    }

    sendLastUpdate() {
        this.lastUpdate = Date.now();
        this.lastUpdateSubject.next(this.lastUpdate);
    }

}
