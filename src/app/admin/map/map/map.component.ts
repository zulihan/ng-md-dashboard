import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeoService } from '../../../_services/geo.service';
import { Place } from 'src/app/_models/place';
// import { log } from 'util';
// import { Geopoint } from '../../_models/Geopoint';
// import { Location } from '../../_models/Location';
import { environment } from 'src/environments/environment'
import { PlaceType } from "src/app/_enums/enums";
import { RunnerTracking } from '../../../_models/runner-tracking';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    origin =  { lat: 43.270584762037416, lng: 5.39729277752383};
    destination = {lat: 43.170584762037416, lng: 5.69729277752383};
    
    lat: number;
    lng: number;
    zoom = 13;

    runnersLocations: RunnerTracking[];
    locations: Place[];
    hotels: Place[];
    airports: Place[];
    trainStations: Place[];

    markers = {
        hotels: {
            url: './assets/icons/hotel.png',
            scaledSize: {
                width: 30,
                height: 40
            }
        },
        airports: {
            url: './assets/icons/airport.png',
            scaledSize: {
                width: 30,
                height: 40
            }
        },
        trainStations: {
            url: './assets/icons/train_station.png',
            scaledSize: {
                width: 30,
                height: 40
            }
        },
        runners : {
            url: '/../../assets/icons/runner.png',
            scaledSize: {
                width: 20,
                height: 20
            }
        }
    };


    subscription: any;

    FESTIVAL = environment.FESTIVAL;
    FESTIVAL_LAT = environment.FESTIVAL.LAT;
    FESTIVAL_LNG = environment.FESTIVAL.LNG;

    styles = [
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
    ];

    constructor(private geo: GeoService) { }

    ngOnInit() {
        this.getUserLocation();
        this.getLocations();
        this.getRunnersLocations();
        // this.subscription = this.geo.hits
        // .subscribe(hits => this.markers = hits);
        // console.log('subscription:', this.subscription);
    }

    // ngOnDestroy() {
    //     this.subscription.unsubscribe()
    // }

    getLocations() {
        this.geo.getLocations().subscribe( locations => {
            locations.shift();
            this.hotels = locations.filter( loc => loc.type === PlaceType.HOTEL);
            this.airports = locations.filter( loc => loc.type === PlaceType.AIRPORT);
            this.trainStations = locations.filter( loc => loc.type === PlaceType.TRAINSTATION);
        });
    }

    // getGeocode() {
    //     this.geo.getGeoCode().subscribe( response => console.log(response));
    // }

    getRunnersLocations() {
        this.geo.getRunnersLocations()
            .subscribe( runnersLocations => {
                console.log(' MapComponent -> getRunnersLocations -> runnersLocations', runnersLocations);
                this.runnersLocations = runnersLocations;   
            })
    }

    private getUserLocation() {
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;
         // this.geo.getLocations(100000, [this.lat, this.lng]);
       });
     }
   }
}
