import { Direction } from "./direction";

export class TrafficLight {
  directions: Direction[];
  location: L.LatLng;
  constructor(directions: Direction[], location: L.LatLng) {
    this.directions = directions;
    this.location = location;
  }
}
