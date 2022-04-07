import { Direction } from "./direction";
import { TrafficLightType } from "./traffic-light-type";

export class TrafficLight {
  directions: Direction[];
  location: L.LatLng;
  trafficLightType: TrafficLightType;
  activated: boolean;
  constructor(directions: Direction[], location: L.LatLng , trafficLightType: TrafficLightType, activated: boolean) {
    this.directions = directions;
    this.location = location;
    this.trafficLightType = trafficLightType;
    this.activated = activated;
  }
}
