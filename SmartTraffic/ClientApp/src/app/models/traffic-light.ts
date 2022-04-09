import { Point } from "./point";

export class TrafficLight {
  DirectionControl: Point;
  AdjustmentDirection: string[];
  Location: Point;
  constructor(DirectionControl: Point, AdjustmentDirection: string[], Location: Point) {
    this.DirectionControl = DirectionControl;
    this.AdjustmentDirection = AdjustmentDirection;
    this.Location = Location;
  }
}
