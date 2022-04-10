import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { MapItemCreateComponent } from '../map-item-create/map-item-create.component';
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
  private selectDublicateMode$ = new BehaviorSubject<boolean>(false);
  private selectOppositeMode$ = new BehaviorSubject<boolean>(false);
  private specifyDirectionMode$ = new BehaviorSubject<boolean>(false);
  private selectedItem$ = new BehaviorSubject<number>(0);
  constructor(private dialog: MatDialog,
    private ElByClassName: ElementRef,
    private trafficLightService: TrafficLightService) { }

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.map.on('dblclick', (e: any) => {
      if (this.specifyDirectionMode$.value || this.selectDublicateMode$.value || this.selectOppositeMode$.value) { return; }
      const popup = L.popup().setContent('<button style="border-radius: 6px; background-color: #ccd9ff; color: black;" id="button-add-light">Add traffic light</button>').setLatLng(e.latlng);
      this.map.openPopup(popup);
      L.DomEvent.addListener(L.DomUtil.get('button-add-light') as HTMLElement, 'click', () => {
        this.map.closePopup(popup);
        this.dialog.open(MapItemCreateComponent, {
          data: {
            map: this.map,
            latlng: e.latlng,
            specifyDirectionMode$: this.specifyDirectionMode$,
            selectDublicateMode$: this.selectDublicateMode$,
            selectOppositeMode$: this.selectDublicateMode$
          }
        });
        let line: L.LatLngExpression[] = [e.latlng, L.latLng(e.latlng.lat - -0.00017, e.latlng.lng)];
        this.specifyDirectionMode$.subscribe(enabled => {
          if (enabled) {
            this.map.addControl(this.drawControl);
            let layer = L.polyline(line, { color: 'SlateBlue', weight: 10 });
            this.editableLayers.addLayer(layer);
            (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-edit-edit') as HTMLElement).click();
            this.map.on(L.Draw.Event.EDITED, () => this.map.removeControl(this.drawControl));
            (this.ElByClassName.nativeElement.querySelector('.leaflet-draw-actions') as HTMLElement)
              .firstChild?.firstChild?.addEventListener('click', () => {
                this.specifyDirectionMode$.next(false);
                this.editableLayers.removeLayer(layer);
                this.dialog.open(MapItemCreateComponent, {
                  data: {
                    step: 1,
                    map: this.map,
                    latlng: e.latlng,
                    directions: line,
                    specifyDirectionMode$: this.specifyDirectionMode$,
                    selectDublicateMode$: this.selectDublicateMode$,
                    selectOppositeMode$: this.selectDublicateMode$
                  }
                });
              })
          }
        });
        combineLatest([this.selectedItem$, this.selectDublicateMode$]).pipe(
        ).subscribe(([item, enabled]) => {
          if (!!item && enabled) {
            this.selectDublicateMode$.next(false);
            this.dialog.open(MapItemCreateComponent, {
              data: {
                step: 3, // TODO: open up MapItemCreateComponent from 3 step
                item,
                map: this.map,
                latlng: e.latlng,
                directions: line,
                specifyDirectionMode$: this.specifyDirectionMode$,
                selectDublicateMode$: this.selectDublicateMode$,
                selectOppositeMode$: this.selectDublicateMode$
              }
            });
          }
        });

        combineLatest([this.selectedItem$, this.selectOppositeMode$]).pipe(
        ).subscribe(([item, enabled]) => {
          if (item && enabled) {
            // TODO: finish step 4
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
        this.trafficLightService.addItemOnMap(item, this.map, [this.specifyDirectionMode$, this.selectDublicateMode$, this.selectOppositeMode$, this.selectedItem$]);
      });
    })
  }
}
