import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mode, ModeType } from '../models/mode';

@Injectable({
  providedIn: 'root'
})
export class ModsService {

  constructor() { }

  isAnyModeEnabled(mods$: BehaviorSubject<Mode>[]) : boolean {
    return !!mods$.map(x => x.value).find(x => x.enabled);
  }

  enable(mods$: BehaviorSubject<Mode>[], type: ModeType){
    let selectDirectionMode$ = this.getMode(mods$, type);
    if(!!selectDirectionMode$){
      let selectDirectionMode = selectDirectionMode$.value;
      selectDirectionMode.enabled = true;
      selectDirectionMode$?.next(selectDirectionMode);
    }
  }

  disable(mods$: BehaviorSubject<Mode>[], type: ModeType){
    let selectDirectionMode$ = this.getMode(mods$, type);
    if(!!selectDirectionMode$){
      let selectDirectionMode = selectDirectionMode$.value;
      selectDirectionMode.enabled = false;
      selectDirectionMode$?.next(selectDirectionMode);
    }
  }

  setValue(mods$: BehaviorSubject<Mode>[], type: ModeType, value: any){
    let selectDirectionMode$ = this.getMode(mods$, type);
    if(!!selectDirectionMode$){
      let selectDirectionMode = selectDirectionMode$.value;
      selectDirectionMode.value = value;
      selectDirectionMode$?.next(selectDirectionMode);
    }
  }

  getMode(mods$: BehaviorSubject<Mode>[], type: ModeType): BehaviorSubject<Mode> {
    return mods$.find((mode$: BehaviorSubject<Mode>) => mode$.value.type == type) ?? new BehaviorSubject<any>(false);
  }
}
