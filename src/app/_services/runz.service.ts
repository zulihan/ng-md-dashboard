import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { Runz } from 'src/app/_models/runz';

@Injectable({
  providedIn: 'root'
})
export class RunzService {
  nodeApi = environment.nodeApiUrl;
  fsApiKey = environment.firebaseConfig.apiKey;

  runzCollection: AngularFirestoreCollection<Runz>;
  runz: Observable<Runz[]>;
  runDoc: AngularFirestoreDocument<Runz>;
  run: Observable<Runz>;

  constructor(private afs: AngularFirestore) {
    this.runzCollection = this.afs.collection<Runz>('runz');
  }

  initRun(run: Runz) {
    return this.runzCollection.add(<Runz>run);
  }

  getRunz(): Observable<Runz[]> {
    this.runz = this.runzCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Runz;
        data.id = a.payload.doc.id;
        return data;
      });
    });
    return this.runz;
  }

  getRun(runId): Observable<Runz> {
    const runDoc = this.afs.collection<Runz>('runz').doc<Runz>(runId);
    const run = runDoc.valueChanges();
    return run;
  }

  deleteRun(runId) {
    const runDoc = this.afs.collection<Runz>('runz').doc<Runz>(runId);
    return runDoc.delete();
  }

}
