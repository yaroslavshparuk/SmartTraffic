import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-item-property',
  templateUrl: './map-item-property.component.html'
})
export class MapItemPropertyComponent implements AfterViewInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngAfterViewInit(): void {
    // console.log(this.data);

    // let line: L.LatLngExpression[] = [L.latLng(50.45039462536567, 30.524528324604038), L.latLng(50.45027678108768, 30.524812638759617)];
    // L.polyline(line, { color: '#178a00' }).addTo(this.data.map);
  }
}
