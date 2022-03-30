import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { MapItemCreateComponent } from '../map-item-create/map-item-create.component';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.map.on('dblclick', (e: any) => {
      const popup = L.popup().setContent('<button id="button-add-light">Add traffic light</button>').setLatLng(e.latlng);
      this.map.openPopup(popup);
      L.DomEvent.addListener(L.DomUtil.get('button-add-light') as HTMLElement, 'click', () => {
        this.map.closePopup(popup);
        this.dialog.open(MapItemCreateComponent, {
          data: {map: this.map, latlng: e.latlng }
        })
      });
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [50.45030410732321, 30.524445176124576],
      zoom: 19
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
  }
}
