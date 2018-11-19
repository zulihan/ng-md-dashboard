import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Runz } from 'src/app/_models/runz';
import { RunzService } from 'src/app/_services/runz.service';
import { Subscription, Subject } from 'rxjs';
import { RunStatus, RunType } from 'src/app/_enums/enums';


@Component({
  selector: 'app-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.scss']
})
export class TaskProgressComponent implements OnInit, OnDestroy {
  @Input('runId') runId;
  @Input('runType') runType;

  run: Runz;
  runSubscription: Subscription;

  pbOneOptions = {
    mode: '',
    value: 0
  };
  pbOneModeSubject: Subject<any>;
  pbOneValueSubject: Subject<any>;
  pbTwoOptions = {
    mode: '',
    value: 0
  };
  pbTwoModeSubject: Subject<any>;
  pbTwoValueSubject: Subject<any>;
  pbThreeOptions = {
    mode: '',
    value: 0
  };
  pbThreeModeSubject: Subject<any>;
  pbThreeValueSubject: Subject<any>;

  // pbOptions = {
  //   color: '#00acc1',
  //   mode: 'indeterminate',
  //   value: 10,
  //   bufferValue: 100,
  // };

  constructor(private runzService: RunzService) {
    this.pbOneModeSubject = new Subject<any>();
    this.pbOneValueSubject = new Subject<any>();
    this.pbTwoModeSubject = new Subject<any>();
    this.pbTwoValueSubject = new Subject<any>();
    this.pbThreeModeSubject = new Subject<any>();
    this.pbThreeValueSubject = new Subject<any>();
  }

  ngOnInit() {
    this.runSubscription = this.runzService.getRun(this.runId)
      .subscribe( run => {
        this.run = run;
        this.checkRunStatusUpdatePB(run, run.status, this.runType);
      });
  }

  ngOnDestroy() {
    this.runSubscription.unsubscribe();
  }

  checkRunStatusUpdatePB(run, status, runType) {

    switch (status) {
      case RunStatus.NOT_STARTED:
        this.pbOneOptions.mode = 'indeterminate';
        this.pbOneOptions.value = 0;
        this.pbTwoOptions.mode = 'indeterminate';
        this.pbTwoOptions.value = 0;
        if (runType === RunType.THREELEGS) {
          this.pbThreeOptions.mode = 'indeterminate';
          this.pbThreeOptions.value = 0;
        }
        break;
      case RunStatus.STARTED:
        this.pbOneOptions.mode = 'determinate';
        this.pbOneOptions.value = run.legs.one.percent_dist_travelled;
        this.pbTwoOptions.mode = 'indeterminate';
        this.pbTwoOptions.value = 0;
        if (runType === RunType.THREELEGS) {
          this.pbThreeOptions.mode = 'indeterminate';
          this.pbThreeOptions.value = 0;
        }
        break;
      case RunStatus.ARRIVED_AT_DESTINATION:
        this.pbOneOptions.mode = 'determinate';
        this.pbOneOptions.value = 100;
        this.pbTwoOptions.mode = 'indeterminate';
        this.pbTwoOptions.value = 0;
        if (runType === RunType.THREELEGS) {
          this.pbThreeOptions.mode = 'indeterminate';
          this.pbThreeOptions.value = 0;
        }
        break;

      case RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION:
        this.pbOneOptions.mode = 'determinate';
        this.pbOneOptions.value = 100;
        this.pbTwoOptions.mode = 'determinate';
        this.pbTwoOptions.value = run.legs.two.percent_dist_travelled;
        this.pbThreeOptions.mode = 'indeterminate';
        this.pbThreeOptions.value = 0;
        break;

      case RunStatus.ARRIVED_AT_SECOND_DESTINATION:
        this.pbOneOptions.mode = 'determinate';
        this.pbOneOptions.value = 100;
        this.pbTwoOptions.mode = 'determinate';
        this.pbTwoOptions.value = 100;
        this.pbThreeOptions.mode = 'indeterminate';
        this.pbThreeOptions.value = 0;
        break;

      case RunStatus.ON_THE_WAY_BACK:
        this.pbOneOptions.mode = 'determinate';
        this.pbOneOptions.value = 100;
        if (runType !== RunType.THREELEGS) {
          this.pbTwoOptions.mode = 'determinate';
          this.pbTwoOptions.value = run.legs.two.percent_dist_travelled;
        } else {
          this.pbTwoOptions.mode = 'determinate';
          this.pbTwoOptions.value = 100;
          this.pbThreeOptions.mode = 'indeterminate';
          this.pbThreeOptions.value = run.legs.three.percent_dist_travelled;
        }
        break;
      case RunStatus.COMPLETED:
        this.pbOneOptions.mode = 'determinate';
        this.pbOneOptions.value = 100;
        this.pbTwoOptions.mode = 'determinate';
        this.pbTwoOptions.value = 100;
        if (runType !== RunType.THREELEGS) {
          this.pbThreeOptions.mode = 'determinate';
          this.pbThreeOptions.value = 100;
        }
        break;
    }
    this.pbOneModeSubject.next(this.pbOneOptions.mode);
    this.pbOneValueSubject.next(this.pbOneOptions.value);
    console.log(' TaskProgressComponent -> checkRunStatusUpdatePB -> this.pbOneOptions', this.pbOneOptions);
    this.pbTwoModeSubject.next(this.pbTwoOptions);
    this.pbTwoValueSubject.next(this.pbTwoOptions.value);

    this.pbThreeModeSubject.next(this.pbThreeOptions);
    this.pbThreeValueSubject.next(this.pbOneOptions.value);
  }

}
