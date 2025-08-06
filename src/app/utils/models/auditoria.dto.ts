import { Deserializable } from '../interfaces';

export class AuditoriaDTO implements Deserializable {
    id: number;
    nombre: string;
    totalIndicadores: number;
    activo: boolean;
    usuarioCreacion: number | null;
    usuarioModificacion: number | null;
    
  constructor() {
    this.id = null;
    this.nombre = null;
    this.totalIndicadores = null;
    this.activo = null;
    this.usuarioCreacion = null;
    this.usuarioModificacion = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
