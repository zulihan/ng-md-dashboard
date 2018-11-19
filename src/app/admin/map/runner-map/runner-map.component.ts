import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { GeoService } from '../../../_services/geo.service';
import { Place } from 'src/app/_models/place';
import { combineLatest, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Runz } from '../../../_models/runz';
import { RunzService } from '../../../_services/runz.service';
import { LatLng, GoogleMapsAPIWrapper } from '@agm/core';
import { RunStatus, RunType } from 'src/app/_enums/enums';


@Component({
  selector: 'app-runner-map',
  templateUrl: './runner-map.component.html',
  styleUrls: ['./runner-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunnerMapComponent implements OnInit, OnDestroy {

    @Input('locations') locations;
    @Input('locationTwo') locationTwo: Place;
    @Input('runType') runType;
    @Input('runId') runId;
    @Input('runnerId') runnerId;

    originSubject: Subject<LatLng>;
    destinationSubject: Subject<LatLng>;
    waypointsSubject: Subject<{}>;
    optionsSubject: Subject<{}>;

    FESTIVAL = environment.FESTIVAL;

    route;
    runSubscription;
    run: any;
    hasStarted;
    runnerPositionSubscription;
    runnerPosition;

    combinedSubscription;

    runnerPositionLat;
    runnerPositionLng;
    runnerPositionTimestamp;
    runnerPositionUserName;
    timestampToDate;

    markers: any;
    center;
    mapOptions =  {
        zoom: 14,
        center: this.center,
        fullscreenControl: true,
        styles : [
            {
            'featureType': 'all',
            'elementType': 'all',
            'stylers': [
                {
                    'saturation': -100
                },
                {
                    'gamma': 0.5
                }
            ]
            },
            {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': [
                {
                    'color': '#7dcdcd'
                }
            ]
            }
        ]
    };

    // origin =  { lat: 43.270584762037416, lng: 5.39729277752383};
    // destination = {lat: 43.170584762037416, lng: 5.69729277752383};


    // Need to:
    // -get runner position
    // -get run Id
    // -get run status
    // -get run legs

    constructor(private geo: GeoService,
        private runzService: RunzService) {
        this.originSubject = new Subject<LatLng>();
        this.destinationSubject = new Subject<LatLng>();
        this.waypointsSubject = new Subject<{}>();
        this.optionsSubject = new Subject<{}>();
        }

    ngOnInit() {
        console.log(' RunnerMapComponent -> ngOnIni -> this.runType', this.runType);

        this.runSubscription = this.runzService.getRun(this.runId);
        this.runnerPositionSubscription = this.geo.getRunnerLocation(this.runnerId);

        this.combinedSubscription = combineLatest(this.runSubscription, this.runnerPositionSubscription,
            (run, pos) => ({ run, pos }))
            .subscribe( pair => {
                this.run = pair.run;
                if ( this.run.status === (RunStatus.STARTED || RunStatus.ON_THE_WAY_BACK || RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION)) {
                    this.hasStarted = true;
                }
                const runStatus = this.run.status;
                console.log(' RunnerMapComponent -> ngOnInit -> this.run', this.run);
                this.runnerPosition = pair.pos[0].position;
                this.runnerPositionLat = this.runnerPosition.coords.latitude;
                this.runnerPositionLng = this.runnerPosition.coords.longitude;
                this.runnerPositionTimestamp = this.runnerPosition.timestamp;
                this.runnerPositionUserName = this.runnerPosition.userName;
                this.timestampToDate = new Date(this.runnerPositionTimestamp);
                this.center = <LatLng>{lat: this.runnerPositionLat, lng: this.runnerPositionLng};
                console.log(' RunnerMapComponent -> ngOnInit -> this.center', this.center);
                this.resolveRoute(runStatus, this.runType);
                console.log(' RunnerMapComponent -> ngOnInit -> this.route', this.route);
            });
    }

    ngOnDestroy(): void {
        console.log('****** RunnerMapComponent -> ngOnDestroy ******');
        this.combinedSubscription.unsubscribe();
        // this.runSubscription.unsubscribe();
        // this.runnerPositionSubscription.unsubscribe();
    }

    resolveRoute(runStatus, runType) {
        console.log(' MapComponent -> resolveRoute -> runStatus', runStatus);
        const from = {lat: this.locations[0].coord.latitude, lng: this.locations[0].coord.longitude};
        const to = {lat: this.locations[1].coord.latitude, lng: this.locations[1].coord.longitude};
        const runnerPos = {lat: this.runnerPositionLat, lng: this.runnerPositionLng};
        let origin  = {lat: this.FESTIVAL.LAT, lng: this.FESTIVAL.LNG};
        let destination = {lat: this.FESTIVAL.LAT, lng: this.FESTIVAL.LNG};
        let waypoints;
        let departureTime = new Date(Date.now());
        debugger;
        switch (runStatus) {
        case RunStatus.NOT_STARTED:
            switch (runType) {
                case RunType.DROPOFF:
                    waypoints = [{
                    location: to,
                    stopover: true
                    }];
                    debugger;
                    break;
                case RunType.PICKUP:
                    waypoints = [{
                    location: from,
                    stopover: true
                    }];
            debugger;
                    break;
                case RunType.THREELEGS:
            debugger;
                    waypoints = [
                        {
                        location: from,
                        stopover: true
                        },
                        {
                        location: to,
                        stopover: true
                        }
                    ];
                    console.error(' MapComponent -> resolveRoute -> waypoints', waypoints);
                    debugger;
                    break;
            }
            departureTime = new Date(this.run.start_scheduled_at);
            break;
        case RunStatus.STARTED:
            origin = this.hasStarted ?
            (runnerPos !== undefined ? runnerPos : origin) : origin;
            // console.log(' ********************MapComponent -> resolveRoute -> origin', origin);
            destination = runType === RunType.DROPOFF ? to : from;
            // console.log(' *******************MapComponent -> resolveRoute -> destination', destination);
            debugger;
            break;
        case RunStatus.ARRIVED_AT_DESTINATION:
            origin = runType === RunType.DROPOFF ? to : from;
            destination = runType === RunType.DROPOFF ? from : to;
            debugger;
            break;
        case RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION:
            origin = this.hasStarted ?
                    (runnerPos !== undefined ? runnerPos : from) : from;
            destination = to;
            debugger;
            break;
        case RunStatus.ARRIVED_AT_SECOND_DESTINATION:
            origin = this.hasStarted ?
                    (runnerPos !== undefined ? runnerPos : to) : to;
            debugger;
            break;
        case RunStatus.ON_THE_WAY_BACK:
            if (this.hasStarted) {
            if (runnerPos !== undefined) {
                origin = runnerPos;
            } else {
                if (runType === RunType.DROPOFF || RunType.THREELEGS) {
                origin = to;
                } else {
                origin = from;
                }
            }
            } else {
                if (runType === RunType.DROPOFF || RunType.THREELEGS) {
                origin = to;
            } else {
                origin = from;
            }
            }
            // origin = this.hasStarted ?
            //       (runnerPosition !== undefined ? runnerPosition :
            //         runType === RunType.DROPOFF || RunType.THREELEGS ?
            //         to : from) :
            //       (runType === RunType.DROPOFF || RunType.THREELEGS ?
            //       to : from)
            debugger;
            break;
        case RunStatus.COMPLETED:
            debugger;
            switch (runType) {
            case RunType.DROPOFF:
                waypoints = [{
                location: to,
                stopover: true
                }];
                debugger;
                break;
            case RunType.PICKUP:
                waypoints = [{
                location: from,
                stopover: true
                }];
                debugger;
                break;
            case RunType.THREELEGS:
            waypoints = [
                {
                    location: from,
                    stopover: true
                },
                {
                    location: to,
                    stopover: true
                }
                ];
                debugger;
                break;
            }
        }

        if (waypoints !== undefined) {
        this.route = {
            origin,
            destination,
            waypoints,
            travelMode: 'DRIVING',
            drivingOptions: {
            departureTime,
            trafficModel: 'pessimistic'
            },
            options: {
                suppressMarkers: true
            }
        };
        } else {
        this.route = {
            origin,
            destination,
            travelMode: 'DRIVING',
            drivingOptions: {
            departureTime,
            trafficModel: 'pessimistic'
            },
            options: {
                suppressMarkers: true
            }
        };
        }
        debugger;
        console.log(' resolveRoute -> this.route', this.route);
        this.originSubject.next(this.route.origin);
        this.destinationSubject.next(this.route.destination);
        this.waypointsSubject.next(this.route.waypoints);
        this.optionsSubject.next(this.route.options);
        // if (this.hasStarted ===) {
        //   this.returnDirections(taskStatus, this.route);
        //   setTimeout( () => {
        //     this.displayRoute(this.directions);
        //     this.resolveRoute(taskStatus, runType);
        //   },1000);
        // }
    }

//    resolveRoute(taskStatus, runType) {
//     const route = {};
//     const from = {lat: this.locations[0].coord.latitude, lng: this.locations[0].coord.longitude};
//     const to = {lat: this.locations[1].coord.latitude, lng: this.locations[1].coord.longitude};
//     let origin  = {lat: this.FESTIVAL.LAT, lng: this.FESTIVAL.LNG};
//     let destination = {lat: this.FESTIVAL.LAT, lng: this.FESTIVAL.LNG};
//     let waypoints;
//     let departureTime = new Date(Date.now());
//     const runnerPosition = {lat: this.runnerPositionLat, lng: this.runnerPositionLng};

//     switch (taskStatus) {
//         case RunStatus.NOT_STARTED:
//             switch (runType) {
//                 case RunType.DROPOFF:
//                     waypoints = [
//                         {
//                         location: to,
//                         stopover: true
//                         }
//                     ];
//                     break;
//                 case RunType.PICKUP:
//                     waypoints = [
//                         {
//                         location: from,
//                         stopover: true
//                         }
//                     ];
//                     break;
//                 case RunType.THREELEGS:
//                     waypoints = [
//                         {
//                         location: from,
//                         stopover: true
//                         },
//                         {
//                         location: to,
//                         stopover: true
//                         }
//                     ];
//                     break;
//             }
//             departureTime = new Date(this.run.start_scheduled_at);
//             break;
//         case RunStatus.STARTED:
//             origin = runnerPosition;
//             destination = runType = RunType.DROPOFF ? to : from;
//             break;
//         case RunStatus.ARRIVED_AT_DESTINATION:
//             origin = runType === RunType.DROPOFF ? to : from;
//             destination = runType === RunType.DROPOFF ? to : from;
//             break;
//         case RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION:
//             origin = runnerPosition;
//             destination = to;
//             break;
//         case RunStatus.ARRIVED_AT_SECOND_DESTINATION:
//             origin = runnerPosition;
//             break;
//         case RunStatus.ON_THE_WAY_BACK:
//             origin = this.hasStarted ? runnerPosition :
//                 runType = RunType.DROPOFF || RunType.THREELEGS ? to : from;
//             break;
//     }

//     if (waypoints !== undefined) {
//       this.route = {
//         origin,
//         destination,
//         waypoints,
//         travelMode: 'DRIVING',
//         drivingOptions: {
//           departureTime,
//           trafficModel: 'pessimistic'
//         }
//       };
//     } else {
//       this.route = {
//         origin,
//         destination,
//         travelMode: 'DRIVING',
//         drivingOptions: {
//           departureTime,
//           trafficModel: 'pessimistic'
//         }
//       };
//       console.log(' RunnerMapComponent -> resolveRoute -> this.route', this.route.origin);
//     }
//   }
}
