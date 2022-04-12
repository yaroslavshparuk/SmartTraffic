import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { MapItemCreateComponent } from '../map-item-create/map-item-create.component';
import { Mode, ModeType } from '../models/mode';
import { ModsService } from '../services/mods.service';
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
  private mods$ = [
    new BehaviorSubject<Mode>(new Mode(false, ModeType.Direction)),
    new BehaviorSubject<Mode>(new Mode(false, ModeType.Dublicate)),
    new BehaviorSubject<Mode>(new Mode(false, ModeType.Opposite))];
  private adjustmentDirections$ = new BehaviorSubject<string[]>([]);
  constructor(private dialog: MatDialog,
    private ElByClassName: ElementRef,
    private modsService: ModsService,
    private trafficLightService: TrafficLightService) { }

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.map.on('dblclick', (e: any) => {
      if (this.modsService.isAnyModeEnabled(this.mods$)) { return; }
      const popup = L.popup().setContent('<button style="border-radius: 6px; background-color: #ccd9ff; color: black;" id="button-add-light">Add traffic light</button>').setLatLng(e.latlng);
      this.map.openPopup(popup);
      let line: L.LatLngExpression[] = [e.latlng, L.latLng(e.latlng.lat - -0.00017, e.latlng.lng)];
      let itemDublicate : any;
      let itemOpposite: any;
      L.DomEvent.addListener(L.DomUtil.get('button-add-light') as HTMLElement, 'click', () => {
        this.map.closePopup(popup);
        this.dialog.open(MapItemCreateComponent, {
          data: {
            step: 0,
            itemOpposite,
            itemDublicate,
            map: this.map,
            latlng: e.latlng,
            mods$: this.mods$,
            adjustmentDirections$: this.adjustmentDirections$
          }
        });
        this.modsService.getMode(this.mods$, ModeType.Direction)?.subscribe(mode => {
          if (mode.enabled) {
            this.map.addControl(this.drawControl);
            let layer = L.polyline(line, { color: 'SlateBlue', weight: 10 });
            this.editableLayers.addLayer(layer);
            (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-edit-edit') as HTMLElement).click();
            this.map.on(L.Draw.Event.EDITED, () => this.map.removeControl(this.drawControl));
            (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-actions') as HTMLElement)
              .firstChild?.firstChild?.addEventListener('click', () => {
                this.modsService.disable(this.mods$, ModeType.Direction);
                this.editableLayers.removeLayer(layer);
                this.dialog.open(MapItemCreateComponent, {
                  data: {
                    step: 0,
                    itemOpposite,
                    itemDublicate,
                    map: this.map,
                    directions: line,
                    latlng: e.latlng,
                    mods$: this.mods$,
                    adjustmentDirections$: this.adjustmentDirections$
                  }
                });
              })
          }
        });
        this.modsService.getMode(this.mods$, ModeType.Dublicate).pipe(
        ).subscribe(mode => {
          if (!!mode.value && mode.enabled) {
            this.modsService.disable(this.mods$, ModeType.Dublicate);
            itemDublicate = mode.value;
            this.dialog.open(MapItemCreateComponent, {
              data: {
                step: 2,
                itemOpposite,
                itemDublicate,
                map: this.map,
                directions: line,
                latlng: e.latlng,
                mods$: this.mods$,
                adjustmentDirections$: this.adjustmentDirections$
              }
            });
          }
        });
        this.modsService.getMode(this.mods$, ModeType.Opposite).pipe(
        ).subscribe(mode => {
          if (!!mode.value && mode.enabled) {
            this.modsService.disable(this.mods$, ModeType.Opposite);
            itemOpposite = mode.value;
            this.dialog.open(MapItemCreateComponent, {
              data: {
                step: 3,
                itemOpposite,
                itemDublicate,
                map: this.map,
                directions: line,
                latlng: e.latlng,
                mods$: this.mods$,
                adjustmentDirections$: this.adjustmentDirections$
              }
            });
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
        this.trafficLightService.addItemOnMap(item, this.map, this.mods$);
      });
    })
  }
}
