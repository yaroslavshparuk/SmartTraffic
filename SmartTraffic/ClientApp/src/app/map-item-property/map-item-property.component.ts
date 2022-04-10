import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-map-item-property',
  templateUrl: './map-item-property.component.html'
})
export class MapItemPropertyComponent implements OnInit {
  showDefaultContent$ = new BehaviorSubject<boolean>(true);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MapItemPropertyComponent>) { }
  ngOnInit(): void {
    this.data.modes.forEach((mode$: BehaviorSubject<any>) => {
      if(mode$.value){
        this.showDefaultContent$.next(false);
      }
    });
  }

  closeAndChangeMode() {
    this.data.modes[this.data.modes.length - 1].next(this.data.item.id);
    this.dialogRef.close();
  }
}
