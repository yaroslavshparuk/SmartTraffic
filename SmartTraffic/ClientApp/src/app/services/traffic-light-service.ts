import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { MapItemPropertyComponent } from '../map-item-property/map-item-property.component';
import { TrafficLight } from '../models/traffic-light';
import * as L from 'leaflet';
@Injectable({
  providedIn: 'root'
})
export class TrafficLightService {
  private baseUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, private dialog: MatDialog) { this.baseUrl = baseUrl; }

  public getAll() : Observable<TrafficLight[]> {
    return this.http.get<TrafficLight[]>(this.baseUrl + 'TrafficLight/GetAll');
  }

  public create(trafficLight: TrafficLight) : Observable<TrafficLight>{
    return this.http.post<TrafficLight>(this.baseUrl + 'TrafficLight/Create', trafficLight).pipe(
      first()
      );
  }

  public addItemOnMap(item: TrafficLight, map: L.DrawMap, mods$: BehaviorSubject<any>[]): void {
    L.marker([item.location.latitude, item.location.longitude])
      .setIcon(L.icon({ iconUrl: "assets/icons/traffic-light-icon.png", iconSize: [22, 22] }))
      .addEventListener('click', () => {
        this.dialog.open(MapItemPropertyComponent, {
          data: { map, item, mods$ }
        });
      })
      .addTo(map);
  }
}

