import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { Observable } from 'rxjs/Observable';
import { Task } from '../_models/task';
import { Subject } from 'rxjs/Subject';
import { RunnerTask } from 'src/app/_models/runner-task';
import { distinctUntilChanged, map, debounceTime } from 'rxjs/operators';



@Injectable()
export class TasksService {

    tasksCollection: AngularFirestoreCollection<Task> ;
    taskDocument: AngularFirestoreDocument<Task>;

    runnersTasksCollection: AngularFirestoreCollection<RunnerTask>;
    runnersTasks: Observable<RunnerTask[]>;
    runnerTask: AngularFirestoreDocument<RunnerTask>;
    editedRunnerTask =  new Subject<RunnerTask>();
    runnerTasks: Observable<RunnerTask[]>;

    tasks: Observable<Task[]>;
    editedTask = new Subject<Task>();
    lastUpdateSubject = new Subject<any>();
    lastUpdate;

    taskToEdit: Task;

    constructor(private afs: AngularFirestore) {
        this.runnersTasksCollection =
            this.afs.collection<RunnerTask>
                ('runnersTasks', ref => ref.orderBy('startAt', 'desc').orderBy('isDone', 'desc'));
        console.log(' TasksService -> constructor -> this.runnersTasksCollection', this.runnersTasksCollection);
    }

    /// Firebase Server Timestamp
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    getRunnersTasks(): Observable<RunnerTask[]> {
        // this.runnersTasks = this.runnersTasksCollection;
        this.runnersTasks = this.runnersTasksCollection.snapshotChanges().pipe(map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as RunnerTask;
              data.id = a.payload.doc.id;
              console.log(' TasksService -> getRunnersTasks() -> data', data);
              return data;
            });
        }));
        console.log(' TasksService -> this.runnersTasks', this.runnersTasks);
        return this.runnersTasks;
    }

    addRunerTask(task: RunnerTask) {
        const timestamp = this.timestamp;
        const data = {
            ...task,
            updatedAt: timestamp,
            createdAt: timestamp
        };
        console.log(' TasksService -> addRunerTask -> data', data);
        return this.runnersTasksCollection.add(data);
    }

    deleteRunnerTask(task: RunnerTask) {
        this.runnerTask = this.runnersTasksCollection.doc<RunnerTask>(task.id);
        return this.runnerTask.delete();
    }


    updateRunnerTask(taskId: string, task: RunnerTask) {
        this.runnerTask = this.tasksCollection.doc<RunnerTask>(taskId);
        this.runnerTask.update(task);
        // this.editedRunnerTask.next(this.taskToEditReset());
    }

    getTasks() {
        this.tasks = this.tasksCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as Task;
              data.id = a.payload.doc.id;
              return data;
            });
          });
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
        console.log(' TasksService -> getEditedTask -> this.editedTask', this.editedTask);
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
