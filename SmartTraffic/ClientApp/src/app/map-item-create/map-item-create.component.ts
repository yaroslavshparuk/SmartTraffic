import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrafficLight } from '../models/traffic-light';
import { Point } from '../models/point';
import { TrafficLightService } from '../services/traffic-light-service';
@Component({
  selector: 'app-map-item-create',
  templateUrl: './map-item-create.component.html'
})
export class MapItemCreateComponent implements OnInit {
  adjustmentDirections: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MapItemCreateComponent>,
    private snackBar: MatSnackBar,
    private trafficLightService: TrafficLightService) {
  }
  ngOnInit(): void {
  }

  specifyDirection(): void {
    this.data.specifyDirectionMode$.next(true);
    this.close();
  }

  selectDublicate(): void {
    this.data.selectDublicateMode$.next(true);
    this.close();
  }

  selectOpposite(): void {
    this.data.selectOppositeMode$.next(true);
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

  public get isAdjustmentDirectionsSelected(): boolean {
    return this.adjustmentDirections.length > 0;
  }

  finish(): void {
    if (this.adjustmentDirections.length == 0) { return; }
    var trafficLight = new TrafficLight(
      new Point(this.data.directions[1].lat, this.data.directions[1].lng),
      new Point(this.data.latlng.lat, this.data.latlng.lng),
      this.adjustmentDirections.includes('Straight'),
      this.adjustmentDirections.includes('Left'),
      this.adjustmentDirections.includes('Right'));
    this.trafficLightService.create(trafficLight);
    this.trafficLightService.addItemOnMap(trafficLight, this.data.map, [this.data.selectDublicateMode$, this.data.selectOppositeMode$]);
    this.close();
    this.snackBar.open('Traffic light was successfully added!', 'Close', { duration: 4000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
