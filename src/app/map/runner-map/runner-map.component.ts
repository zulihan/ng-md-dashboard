import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GeoService } from '../../_services/geo.service';
import { Place } from 'src/app/_models/place';
import { combineLatest } from 'rxjs';
import { environment } from 'src/environments/environment'
import { Runz } from '../../_models/runz';
import { RunzService } from '../../_services/runz.service';
import { LatLng, GoogleMapsAPIWrapper } from '@agm/core';
import { RunStatus, RunType } from 'src/app/_enums/enums';


@Component({
  selector: 'app-runner-map',
  templateUrl: './runner-map.component.html',
  styleUrls: ['./runner-map.component.scss'],
  providers: [GoogleMapsAPIWrapper]
})
export class RunnerMapComponent implements OnInit, OnDestroy {
       
    @Input('locations') locations;
    @Input('locationTwo') locationTwo: Place;
    @Input('runnerTaskType') runType;
    @Input('runnerTaskRunId') runId;
    @Input('runnerId') runnerId;

    FESTIVAL = environment.FESTIVAL;

    route;
    runSubscription: any;
    run: any;
    hasStarted;
    runnerPositionSubscription: any;
    runnerPosition;
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

    origin =  { lat: 43.270584762037416, lng: 5.39729277752383};
    destination = {lat: 43.170584762037416, lng: 5.69729277752383};


    // Need to:
    // -get runner position
    // -get run Id
    // -get run status
    // -get run legs
    
    constructor(
        private geo: GeoService,
        private runzService: RunzService,
        private mapsApi: GoogleMapsAPIWrapper) {

     }

    ngOnInit() {
        console.log(' RunnerMapComponent -> ngOnIni -> this.runType', this.runType);
        // this.runSubscription = this.runzService.getRun(this.runId)
        //     .subscribe( run => {
        //         this.run = run;
        //         if( this.run.status === (RunStatus.STARTED || RunStatus.ON_THE_WAY_BACK || RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION)) {
        //             this.hasStarted = true;
        //         }
        //         let runStatus = this.run.status;
        //         console.log(' RunnerMapComponent -> ngOnInit -> this.run', this.run);
                
        //     });
        // this.runnerPositionSubscription = this.geo.getRunnerLocation(this.runnerId)
        // .subscribe( pos => {
        //     console.log(' RunnerMapComponent -> ngOnInit -> pos', pos);
        //     this.runnerPosition = pos[0].position;
        //     this.runnerPositionLat = this.runnerPosition.coords.latitude;
        //     this.runnerPositionLng = this.runnerPosition.coords.longitude;
        //     this.runnerPositionTimestamp = this.runnerPosition.timestamp;
        //     this.runnerPositionUserName = this.runnerPosition.userName;
        //     this.timestampToDate = new Date(this.runnerPositionTimestamp);
        //     this.center = <LatLng>{lat: this.runnerPositionLat, lng:this.runnerPositionLng};
        //     console.log(' RunnerMapComponent -> ngOnInit -> this.center', this.center);
        // });
        this.runSubscription = this.runzService.getRun(this.runId);            
        this.runnerPositionSubscription = this.geo.getRunnerLocation(this.runnerId);

        combineLatest(this.runSubscription, this.runnerPositionSubscription, (run, pos) => ({ run, pos }))       
            .subscribe( pair => {
                this.run = pair.run;
                if( this.run.status === (RunStatus.STARTED || RunStatus.ON_THE_WAY_BACK || RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION)) {
                    this.hasStarted = true;
                }
                let runStatus = this.run.status;
                console.log(' RunnerMapComponent -> ngOnInit -> this.run', this.run);
                this.runnerPosition = pair.pos[0].position;
                this.runnerPositionLat = this.runnerPosition.coords.latitude;
                this.runnerPositionLng = this.runnerPosition.coords.longitude;
                this.runnerPositionTimestamp = this.runnerPosition.timestamp;
                this.runnerPositionUserName = this.runnerPosition.userName;
                this.timestampToDate = new Date(this.runnerPositionTimestamp);
                this.center = <LatLng>{lat: this.runnerPositionLat, lng:this.runnerPositionLng};
                console.log(' RunnerMapComponent -> ngOnInit -> this.center', this.center);
                this.resolveRoute(runStatus, this.runType);
                console.log(' RunnerMapComponent -> ngOnInit -> this.route', this.route);
            });
    }

    ngOnDestroy(): void {
        this.runSubscription.unsubscribe();
        this.runnerPositionSubscription.unsubscribe();
    }

    getLocations() {
    // this.locations = this.geo.getLocations();
    // this.geo.getLocations().subscribe( locations => {
        // Remove Marsatac from the list so that I can use a different Icon for the marker
        // locations.shift();
        // this.locations = locations;
        // console.log(this.locations);
    // });
    }

   // origin: {lat: this.FESTIVAL.LAT, lng:this.FESTIVAL.LNG}

   resolveRoute(taskStatus, runType) {
    let route = {};
    let from = {lat: this.locations[0].coord.latitude, lng: this.locations[0].coord.longitude};
    let to = {lat: this.locations[1].coord.latitude, lng: this.locations[1].coord.longitude};
    let origin  = {lat: this.FESTIVAL.LAT, lng:this.FESTIVAL.LNG};
    let destination = {lat: this.FESTIVAL.LAT, lng:this.FESTIVAL.LNG};
    let waypoints;
    let departureTime = new Date(Date.now());
    let runnerPosition = {lat: this.runnerPositionLat, lng: this.runnerPositionLng}

    switch(taskStatus) {      
        case RunStatus.NOT_STARTED:
            switch(runType) {
                case RunType.DROPOFF:
                    waypoints = [
                        {
                        location: to,
                        stopover: true
                        }
                    ];
                break;
                case RunType.PICKUP:
                    waypoints = [
                        {
                        location: from,
                        stopover: true
                        }
                    ];
                break;
                case RunType.THREELEGS:
                    waypoints = [
                        {
                        location: this.locations[0].place_id,
                        stopover: true
                        },
                        {
                        location: this.locations[1].to.place_id,
                        stopover: true
                        }
                    ];
                break;
            }
            departureTime = new Date(this.run.start_scheduled_at);
        break;
        case RunStatus.STARTED:      
            origin = runnerPosition;
            destination = runType = RunType.DROPOFF ? to : from;
        break;
        case RunStatus.ARRIVED_AT_DESTINATION:
            origin = runType === RunType.DROPOFF ? to : from;
            destination = runType === RunType.DROPOFF ? to : from          
        break;
        case RunStatus.ON_THE_WAY_TO_SECOND_DESTINATION:
            origin = runnerPosition;
            destination = to;
        break;
        case RunStatus.ARRIVED_AT_SECOND_DESTINATION:
            origin = runnerPosition;
        break;
        case RunStatus.ON_THE_WAY_BACK:
            origin = this.hasStarted ? runnerPosition :
                runType = RunType.DROPOFF || RunType.THREELEGS ? to : from;
        break;             
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
        }
      };
      console.log(' RunnerMapComponent -> resolveRoute -> this.route', this.route.origin);
    }
     
    // if (!this.hasStarted) {
    //   this.returnDirections(taskStatus, this.route);
    //   setTimeout( () => {
    //     this.displayRoute(this.directions);
    //     this.hasStarted = true;
    //     this.resolveRoute(taskStatus, runType);
    //   },1000);
    // }   
  }
}
