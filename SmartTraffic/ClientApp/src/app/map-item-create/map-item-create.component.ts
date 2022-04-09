import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapItemPropertyComponent } from '../map-item-property/map-item-property.component';
import * as L from 'leaflet';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-map-item-create',
  templateUrl: './map-item-create.component.html'
})
export class MapItemCreateComponent implements OnInit {
  adjustmentDirections: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<MapItemCreateComponent>,
    private snackBar: MatSnackBar) { }
  ngOnInit(): void {

  }

  specifyDirection(): void {
    this.data.hidden$.next(true);
    this.close();
  }

  public get getColor(): string {
    return this.isDirectionsSelected ? 'primary' : 'warn';
  }

  public get getTooltip(): string {
    return this.isDirectionsSelected ? 'Edit the direction of control' : 'Specify the direction of control';
  }

  public get isDirectionsSelected(): boolean {
    return this.data.directions?.length > 0;
  }

  addItem(): void {
    L.marker([this.data.latlng.lat, this.data.latlng.lng])
      .setIcon(L.icon({ iconUrl: "../../assets/icons/traffic-light-icon-2.png", iconSize: [22, 22] }))
      .addEventListener('click', () => {
        this.dialog.open(MapItemPropertyComponent, {
          data: { map: this.data.map, lat: this.data.latlng.lat, lng: this.data.latlng.lng, directions: this.data.directions  }
        });
      })
      .addTo(this.data.map);
    this.close();
  }

  finish(): void {
    // do post request here
    this.addItem();
    this.snackBar.open('Traffic light was successfully added!', 'Close', {duration: 4000});
  }

  close(): void {
    this.dialogRef.close();
  }
}
