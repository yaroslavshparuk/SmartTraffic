import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Mode, ModeType } from '../models/mode';
import { ModsService } from '../services/mods.service';

@Component({
  selector: 'app-map-item-property',
  templateUrl: './map-item-property.component.html'
})
export class MapItemPropertyComponent implements OnInit {
  showDefaultContent$ = new BehaviorSubject<boolean>(true);
  selectedItemType: ModeType | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private modsService: ModsService,
    private dialogRef: MatDialogRef<MapItemPropertyComponent>) { }
  ngOnInit(): void {
    this.data.modes$.forEach((mode$: BehaviorSubject<Mode>) => {
      let mode = mode$.value;
      if (mode.enabled) {
        this.selectedItemType = mode.type;
        this.showDefaultContent$.next(false);
      }
    });
  }

  closeAndChangeMode() {
    if (!!this.selectedItemType) {
      this.modsService.setValue(this.data.modes$, this.selectedItemType, this.data.item.id);
      this.dialogRef.close();
    }
  }
}
