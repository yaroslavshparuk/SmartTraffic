import { Point } from "./point";

export class TrafficLight {
  id: number | undefined;
  oppositeId: number | undefined;
  dublicateId: number | undefined;
  directionControl: Point;
  hasStraightAdjustmen: boolean;
  hasLeftAdjustmen: boolean;
  hasRightAdjustmen: boolean;
  location: Point;
  constructor(
    location: Point,
    directionControl: Point,
    hasStraightAdjustmen: boolean,
    hasLeftAdjustmen: boolean,
    hasRightAdjustmen: boolean,
    oppositeId?: number,
    dublicateId?: number,
    id?: number) {
    this.location = location;
    this.directionControl = directionControl;
    this.hasStraightAdjustmen = hasStraightAdjustmen;
    this.hasLeftAdjustmen = hasLeftAdjustmen;
    this.hasRightAdjustmen = hasRightAdjustmen;
    this.oppositeId = oppositeId;
    this.dublicateId = dublicateId;
    this.id = id;
  }
}
