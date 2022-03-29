import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../services/marker.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;

  constructor(private markerService: MarkerService) { }
  ngOnInit(): void {
    this.map = L.map('map', {
      center: [50.45030410732321, 30.524445176124576],
      zoom: 19
    });
  }

  ngAfterViewInit(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    this.map.on('click', (e: any) => {
      console.log(e);

      const popup = L.popup().setContent('<button id="button-submit" type="button">Add traffic light</button>').setLatLng(e.latlng);
      this.map.openPopup(popup);
      const buttonSubmit = L.DomUtil.get('button-submit') as HTMLElement;
      L.DomEvent.addListener(buttonSubmit, 'click', () => {
        this.map.closePopup(popup);
        const circle = L.circleMarker([e.latlng.lat, e.latlng.lng]);
        circle.bindPopup('<button>Properties</button><button>Remove</button>');
        circle.addTo(this.map);
      });
    });
  }
}
