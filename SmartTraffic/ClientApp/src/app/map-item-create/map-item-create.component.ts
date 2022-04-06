import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapItemPropertyComponent } from '../map-item-property/map-item-property.component';
import * as L from 'leaflet';
@Component({
  selector: 'app-map-item-create',
  templateUrl: './map-item-create.component.html'
})
export class MapItemCreateComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MapItemCreateComponent>,) { }

  addItem(): void {
    L.marker([this.data.latlng.lat, this.data.latlng.lng])
      .setIcon(L.icon({ iconUrl: "../../assets/icons/traffic-light-icon-2.png", iconSize: [35, 35] }))
      .addEventListener('click', () => {
        this.dialog.open(MapItemPropertyComponent, {
          data: { lat: this.data.latlng.lat, lng: this.data.latlng.lng }
        });
      })
      .addTo(this.data.map);
    let line: L.LatLngExpression[] = [L.latLng(50.45039462536567, 30.524528324604038), L.latLng(50.45027678108768, 30.524812638759617)];
    L.polyline(line, { color: '#178a00' }).addTo(this.data.map);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
