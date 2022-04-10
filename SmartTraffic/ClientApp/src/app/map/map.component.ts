import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { MapItemCreateComponent } from '../map-item-create/map-item-create.component';
import { MapItemPropertyComponent } from '../map-item-property/map-item-property.component';
import { TrafficLight } from '../models/traffic-light';
import { TrafficLightService } from '../services/traffic-light-service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;
  private drawControl: L.Control.Draw | undefined;
  private editableLayers: L.FeatureGroup<any> = new L.FeatureGroup();
  constructor(private dialog: MatDialog,
    private ElByClassName: ElementRef,
    private trafficLightService: TrafficLightService) { }

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.map.on('dblclick', (e: any) => {
      const popup = L.popup().setContent('<button id="button-add-light">Add traffic light</button>').setLatLng(e.latlng);
      this.map.openPopup(popup);
      L.DomEvent.addListener(L.DomUtil.get('button-add-light') as HTMLElement, 'click', () => {
        this.map.closePopup(popup);
        const hidden$ = new BehaviorSubject<boolean>(false);
        this.dialog.open(MapItemCreateComponent, {
          data: { map: this.map, latlng: e.latlng, hidden$ }
        });
        hidden$.subscribe(x => {
          if (x) {
            this.map.addControl(this.drawControl);
            let line: L.LatLngExpression[] = [e.latlng, L.latLng(e.latlng.lat - -0.00017, e.latlng.lng)];
            let layer = L.polyline([e.latlng, L.latLng(e.latlng.lat - -0.00017, e.latlng.lng)], { color: 'SlateBlue', weight: 10 });
            this.editableLayers.addLayer(layer);
            (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-edit-edit') as HTMLElement).click();
            this.map.on(L.Draw.Event.EDITED, () => this.map.removeControl(this.drawControl));
            var saveBtn = this.ElByClassName.nativeElement.querySelector('.leaflet-draw-actions') as HTMLElement;
            saveBtn.firstChild?.firstChild?.addEventListener('click', () => {
              hidden$.next(false);
              this.editableLayers.removeLayer(layer);
              this.dialog.open(MapItemCreateComponent, {
                data: { map: this.map, latlng: e.latlng, hidden$, directions: line }
              });
            })
          }
        });
      });
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [50.45030410732321, 30.524445176124576],
      zoom: 19
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    this.map.addLayer(this.editableLayers)
    var options = {
      position: 'topright',
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup: this.editableLayers,
        remove: false
      }
    };
    this.drawControl = new L.Control.Draw(options as any);
    this.trafficLightService.getAll().subscribe(items => {
      items.forEach(item => {
        this.trafficLightService.addItemOnMap(item, this.map);
      });
    })
  }
}
