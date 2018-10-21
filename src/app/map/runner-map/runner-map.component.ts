import { Component, OnInit, Input } from '@angular/core';
import { GeoService } from '../../_services/geo.service';
import { log } from 'util';
import { Geopoint } from '../../_models/Geopoint';
import { Place } from 'src/app/_models/place';
import { BehaviorSubject, Subject } from 'rxjs';


@Component({
  selector: 'app-runner-map',
  templateUrl: './runner-map.component.html',
  styleUrls: ['./runner-map.component.scss']
})
export class RunnerMapComponent implements OnInit {

    lat: number;
    lng: number;
    zoom = 13;

    @Input('locations') locations;
    @Input('locationTwo') locationTwo: Place;

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

    constructor(private geo: GeoService) {

     }

    ngOnInit() {
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

}
