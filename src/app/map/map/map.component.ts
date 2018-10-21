import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeoService } from '../../_services/geo.service';
import { Place } from 'src/app/_models/place';
// import { log } from 'util';
// import { Geopoint } from '../../_models/Geopoint';
// import { Location } from '../../_models/Location';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    lat: number;
    lng: number;
    zoom = 13;

    locations: Place[];

    markers: any;
    subscription: any;

    // TODO: Replace with a global
    marsatacLat = 43.270584762037416;
    marsatacLng = 5.39729277752383;

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
            this.locations = locations;
            console.log(' MapComponent -> getLocations -> this.locations', this.locations);
        });
    }

    // getGeocode() {
    //     this.geo.getGeoCode().subscribe( response => console.log(response));
    // }

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
