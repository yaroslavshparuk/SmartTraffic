export class Mode {
  enabled: boolean;
  type: ModeType;
  value: any;
  constructor(enabled: boolean, type: ModeType, value?: any) {
    this.enabled = enabled;
    this.type = type;
    this.value = value;
  }
}

export enum ModeType {
  Direction = 1,
  Dublicate,
  Opposite
}


