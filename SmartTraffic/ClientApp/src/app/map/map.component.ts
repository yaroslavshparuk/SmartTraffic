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
  private adjustmentDirections$ = new BehaviorSubject<string[]>([]);
  private mods$ = [
    new BehaviorSubject<Mode>(new Mode(false, ModeType.Direction)),
    new BehaviorSubject<Mode>(new Mode(false, ModeType.Dublicate)),
    new BehaviorSubject<Mode>(new Mode(false, ModeType.Opposite))];
  constructor(private dialog: MatDialog,
    private ElByClassName: ElementRef,
    private modsService: ModsService,
    private trafficLightService: TrafficLightService) { }

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    let latlng: any;
    this.map.on('dblclick', (e: any) => {
      if (this.modsService.isAnyModeEnabled(this.mods$)) { return; }
      latlng = e.latlng;
      const popup = L.popup().setContent('<button style="border-radius: 6px; background-color: #ccd9ff; color: black;" id="button-add-light">Додати світлофор</button>').setLatLng(e.latlng);
      this.map.openPopup(popup);
      L.DomEvent.addListener(L.DomUtil.get('button-add-light') as HTMLElement, 'click', () => {
        this.map.closePopup(popup);
        this.dialog.open(MapItemCreateComponent, {
          data: this.createData(0, null)
        });
      });
    });


    this.modsService.getMode(this.mods$, ModeType.Direction).subscribe(mode => {
      if (mode.enabled) {
        this.map.addControl(this.drawControl);
        this.editableLayers.addLayer(L.polyline([latlng, L.latLng(latlng.lat + 0.00017, latlng.lng)], { color: 'SlateBlue', weight: 10 }));
        (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-edit-edit') as HTMLElement).click();
        this.map.on(L.Draw.Event.EDITED, () => this.map.removeControl(this.drawControl));
        (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-actions') as HTMLElement)
          .firstChild?.firstChild?.addEventListener('click', () => {
            this.editableLayers.clearLayers();
            this.modsService.setEnable(this.mods$, ModeType.Direction, false);
            this.dialog.open(MapItemCreateComponent, {
              data: this.createData(0, latlng)
            });
          });
      }
    });

    this.modsService.getMode(this.mods$, ModeType.Dublicate)
      .subscribe(mode => {
        if (!!mode.value && mode.enabled) {
          this.modsService.setEnable(this.mods$, ModeType.Dublicate, false);
          this.dialog.open(MapItemCreateComponent, {
            data: this.createData(2, latlng)
          });
        }
      });

    this.modsService.getMode(this.mods$, ModeType.Opposite)
      .subscribe(mode => {
        if (!!mode.value && mode.enabled) {
          this.modsService.setEnable(this.mods$, ModeType.Opposite, false);
          this.dialog.open(MapItemCreateComponent, {
            data: this.createData(3, latlng)
          });
        }
      });
  }

  private createData(step: number, latlng: any) {
    return {
      step,
      map: this.map,
      directions: !!latlng ? [latlng, L.latLng(latlng?.lat + 0.00017, latlng?.lng)] : null,
      mods$: this.mods$,
      adjustmentDirections$: this.adjustmentDirections$
    }
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
