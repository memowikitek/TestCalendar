import { Deserializable } from '../interfaces';

export class SedeDTOV1 implements Deserializable {
  id: number;
  nombre: string;
  clave: string;
  activo: boolean;
  fechaCreacion: Date | string;
  usuarioModificacion: number;
  fechaModificacion: Date | string;
  usuarioCreacion: number;
  sedeId: number = null;

  constructor() {
    this.id = null;
    this.nombre = null;
    this.clave = null;
    this.activo = null;
    this.fechaCreacion = null;
    this.usuarioCreacion = null;
    this.fechaModificacion = null;
    this.usuarioModificacion = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
