import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as L from 'leaflet';
import { MapItemPropertyComponent } from '../map-item-property/map-item-property.component';
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
      .setIcon(L.icon({ iconUrl: "../../assets/icons/traffic-light-icon.png", iconSize: [25, 25] }))
      .addEventListener('click', () => {
        this.dialog.open(MapItemPropertyComponent, {
          data: { lat: this.data.latlng.lat, lng: this.data.latlng.lng }
        })
      })
      .addTo(this.data.map);
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
