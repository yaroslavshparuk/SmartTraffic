import { Point } from "./point";

export class TrafficLight {
  id: number | undefined;
  oppositeId: number | undefined;
  dublicateId: number | undefined;
  directionControl: Point;
  isAuto: boolean;
  location: Point;
  constructor(
    location: Point,
    directionControl: Point,
    isAuto: boolean,
    oppositeId?: number,
    dublicateId?: number,
    id?: number) {
    this.location = location;
    this.directionControl = directionControl;
    this.isAuto = isAuto;
    this.oppositeId = oppositeId;
    this.dublicateId = dublicateId;
    this.id = id;
  }
}
