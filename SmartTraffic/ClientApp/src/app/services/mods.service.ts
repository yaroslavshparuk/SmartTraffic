import { Injectable } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Mode, ModeType } from '../models/mode';

@Injectable({
  providedIn: 'root'
})
export class ModsService {

  constructor() { }

  makeDefaultValues(mods$: BehaviorSubject<Mode>[]){
    mods$.forEach(mode$ => {
      let mode = mode$.value;
      mode.enabled = false;
      mode.value = null;
      mode$.next(mode);
    });
  }

  isAnyModeEnabled(mods$: BehaviorSubject<Mode>[]) : boolean {
    return !!mods$.map(x => x.value).find(x => x.enabled);
  }

  setEnable(mods$: BehaviorSubject<Mode>[], type: ModeType, enabled: boolean) {
    let selectDirectionMode$ = this.getMode(mods$, type);
    if(!!selectDirectionMode$){
      let selectDirectionMode = selectDirectionMode$.value;
      selectDirectionMode.enabled = enabled;
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
