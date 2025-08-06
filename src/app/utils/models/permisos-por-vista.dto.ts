import { Deserializable } from '../interfaces';
import { Vista } from './vista';
import { TipoRolDTO } from './tipo-rol.dto'
import { VistaPermisoDTO } from './vistaPermiso.dto';

export class PermisoPorVistaDTO implements Deserializable {
  vistaId: number;
  permisoId: number;

  constructor(){
      this.vistaId = null;
      this.permisoId = null;
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
