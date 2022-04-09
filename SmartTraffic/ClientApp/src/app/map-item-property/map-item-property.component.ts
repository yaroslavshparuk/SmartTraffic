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
  }
}
