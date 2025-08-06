import { Deserializable } from '../interfaces';

export class NivelDTO implements Deserializable {
  nivelId: string;
  nivel: string;
  activo: boolean;

  constructor() {
    this.nivelId = null;
    this.nivel = null;
    this.activo = null;
  }

  getLevelModality(): string {
    return `${this.nivel}`;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
