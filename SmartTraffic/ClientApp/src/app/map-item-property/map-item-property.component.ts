import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-map-item-property',
  templateUrl: './map-item-property.component.html'
})
export class MapItemPropertyComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
