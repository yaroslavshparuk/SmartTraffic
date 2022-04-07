import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapItemPropertyComponent } from '../map-item-property/map-item-property.component';
import * as L from 'leaflet';
import { TrafficLightType } from '../models/traffic-light-type';
@Component({
  selector: 'app-map-item-create',
  templateUrl: './map-item-create.component.html'
})
export class MapItemCreateComponent {
  trafficLightType: TrafficLightType | string | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MapItemCreateComponent>,) { }

  isBidirectional(): boolean {
    return this.trafficLightType == 'Bidirectional';
  }

  addItem(): void {
    L.marker([this.data.latlng.lat, this.data.latlng.lng])
      .setIcon(L.icon({ iconUrl: "../../assets/icons/traffic-light-icon-2.png", iconSize: [22, 22] }))
      .addEventListener('click', () => {
        this.dialog.open(MapItemPropertyComponent, {
          data: { map: this.data.map, lat: this.data.latlng.lat, lng: this.data.latlng.lng, trafficLightType: this.trafficLightType }
        });
      })
      .addTo(this.data.map);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  trafficLightTypes(): Array<string> {
    var keys = Object.keys(TrafficLightType);
    return keys.slice(keys.length / 2);
  }
}
