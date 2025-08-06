import { Deserializable } from '../interfaces';

export class NormativaDTO implements Deserializable {
  normativaId: number;
  nombre: string;
  activo: boolean;

  constructor() {
    this.normativaId = null;
    this.nombre = null;
    this.activo = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
