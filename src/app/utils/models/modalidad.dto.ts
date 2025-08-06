import { Deserializable } from '../interfaces';

export class ModalidadDTO implements Deserializable {
  modalidadId: string;
  modalidad: string;
  activo: boolean;

  constructor() {
    this.modalidadId = null;
    this.modalidad = null;
    this.activo = null;
  }

  getLevelModality(): string {
    return `${this.modalidad}`;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
