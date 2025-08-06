import { Deserializable } from '../interfaces';

export class PerfilVistaDTO implements Deserializable {
  vistaId: number;
  tipoAccesoId: number;
  vistaNombre: string;

  constructor() {
    this.vistaId = null;
    this.vistaNombre = null;
    this.tipoAccesoId = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
