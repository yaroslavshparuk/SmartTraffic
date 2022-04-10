import { Point } from "./point";

export class TrafficLight {
  id: number | undefined;
  directionControl: Point;
  hasStraightAdjustmen: boolean;
  hasLeftAdjustmen: boolean;
  hasRightAdjustmen: boolean;
  location: Point;
  constructor(directionControl: Point, location: Point, hasStraightAdjustmen: boolean, hasLeftAdjustmen: boolean, hasRightAdjustmen: boolean, id?: number) {
    this.directionControl = directionControl;
    this.location = location;
    this.hasStraightAdjustmen = hasStraightAdjustmen;
    this.hasLeftAdjustmen = hasLeftAdjustmen;
    this.hasRightAdjustmen = hasRightAdjustmen;
    this.id = id;
  }
}
