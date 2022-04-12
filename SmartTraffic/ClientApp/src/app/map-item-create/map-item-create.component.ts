import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrafficLight } from '../models/traffic-light';
import { Point } from '../models/point';
import { TrafficLightService } from '../services/traffic-light-service';
import { ModeType } from '../models/mode';
import { ModsService } from '../services/mods.service';
@Component({
  selector: 'app-map-item-create',
  templateUrl: './map-item-create.component.html'
})
export class MapItemCreateComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MapItemCreateComponent>,
    private snackBar: MatSnackBar,
    private modsService: ModsService,
    private trafficLightService: TrafficLightService) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  public get getDirectionColor(): string {
    return this.isDirectionsSelected ? 'primary' : 'warn';
  }

  public get getDirectionTooltip(): string {
    return this.isDirectionsSelected ? 'Edit direction of control' : 'Select direction of control';
  }

  public get isDirectionsSelected(): boolean {
    return this.data.directions?.length > 0;
  }

  public get isAdjustmentDirectionsSelected(): boolean {
    return this.data.adjustmentDirections$.value.length > 0;
  }

  public get getDublicationColor(): string {
    return !!this.data.itemDublicate ? 'primary' : 'accent';
  }

  public get getDublicationTooltip(): string {
    return !!this.data.itemDublicate ? 'Edit dublicate of traffic light' : 'Select dublicate traffic light';
  }

  public get getOppositeColor(): string {
    return !!this.data.itemOpposite ? 'primary' : 'accent';
  }

  public get getOppositeTooltip(): string {
    return !!this.data.itemOpposite ? 'Edit opposite traffic light' : 'Select opposite traffic light';
  }

  select(type: ModeType): void {
    this.modsService.enable(this.data.mods$, type);
    this.close();
  }

  finish(): void {
    let adjustmentDirections = this.data.adjustmentDirections$.value;
    var trafficLight = new TrafficLight(
      new Point(this.data.directions[1].lat, this.data.directions[1].lng),
      new Point(this.data.latlng.lat, this.data.latlng.lng),
      adjustmentDirections.includes('Straight'),
      adjustmentDirections.includes('Left'),
      adjustmentDirections.includes('Right'));
    this.trafficLightService.create(trafficLight);
    this.trafficLightService.addItemOnMap(trafficLight, this.data.map, this.data.mods$);
    this.close();
    this.snackBar.open('Traffic light was successfully added!', 'Close', { duration: 4000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
