import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeoService } from '../../_services/geo.service';
import { log } from 'util';
import { Geopoint } from '../../_models/Geopoint';
import { Location } from '../../_models/Location';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  lat: number;
    lng: number;
    zoom = 13;

    locations: Location[];

    markers: any;
    subscription: any;

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
    //   }

    getLocations() {
        // this.locations = this.geo.getLocations();
        this.geo.getLocations().subscribe( locations => {
            this.locations = locations;
        console.log(this.locations); });
    }

    private getUserLocation() {
     /// locate the user
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;

         // this.geo.getLocations(100000, [this.lat, this.lng]);

       });
     }
   }

}
