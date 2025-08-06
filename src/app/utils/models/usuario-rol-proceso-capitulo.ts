import { Deserializable } from '../interfaces';
import { LibroHoja } from './libro-hoja';

export class UsuarioRolProcesoCapitulo implements Deserializable {
  usuarioId: number;
  acreditadoraProcesoId: number;
  rolProcesoId: number;
  carreraId: number;
  capituloId: number;
  capituloNombre: string;
  constructor() {
    this.usuarioId = null;
    this.acreditadoraProcesoId = null;
    this.rolProcesoId = null;
    this.carreraId = null;
    this.capituloId = null;
    this.capituloNombre = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
