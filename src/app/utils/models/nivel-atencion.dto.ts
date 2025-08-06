import { Deserializable } from '../interfaces';

export class NivelAtencionDTO implements Deserializable {
  nivelAtencionId: number;
  nombre: string;
  activo: boolean;

  constructor() {
    this.nivelAtencionId = null;
    this.nombre = null;
    this.activo = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
