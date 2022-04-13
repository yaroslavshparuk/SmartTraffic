import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrafficLight } from '../models/traffic-light';
import { Point } from '../models/point';
import { TrafficLightService } from '../services/traffic-light-service';
import { Mode, ModeType } from '../models/mode';
import { ModsService } from '../services/mods.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    return !!this.dublicateItem.value ? 'primary' : 'accent';
  }

  public get getDublicationTooltip(): string {
    return !!this.dublicateItem.value ? 'Edit dublicate of traffic light' : 'Select dublicate traffic light';
  }

  public get dublicateItem(): Mode {
    return this.modsService.getMode(this.data.mods$, ModeType.Dublicate).value;
  }

  public get getOppositeColor(): string {
    return !!this.oppositeItem.value ? 'primary' : 'accent';
  }

  public get getOppositeTooltip(): string {
    return !!this.oppositeItem.value ? 'Edit opposite traffic light' : 'Select opposite traffic light';
  }

  public get oppositeItem(): Mode {
    return this.modsService.getMode(this.data.mods$, ModeType.Opposite).value;
  }

  select(type: ModeType): void {
    this.modsService.setValue(this.data.mods$, type, null);
    this.modsService.setEnable(this.data.mods$, type, true);
    this.close();
  }

  finish(): void {
    let adjustmentDirections = this.data.adjustmentDirections$.value;
    var trafficLight = new TrafficLight(
      new Point(this.data.directions[0].lat, this.data.directions[0].lng),
      new Point(this.data.directions[1].lat, this.data.directions[1].lng),
      adjustmentDirections.includes('Straight'),
      adjustmentDirections.includes('Left'),
      adjustmentDirections.includes('Right'),
      this.oppositeItem.value,
      this.dublicateItem.value);

    this.trafficLightService.create(trafficLight).subscribe(x => {
      this.trafficLightService.addItemOnMap(x, this.data.map, this.data.mods$);
    });
    this.data.adjustmentDirections$.next([]);
    this.modsService.makeDefaultValues(this.data.mods$);
    this.close();
    this.snackBar.open('Traffic light was successfully added!', 'Close', { duration: 4000 });
  }

  close(): void {
    this.dialogRef.close();
  }
}
