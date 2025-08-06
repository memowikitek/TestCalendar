
import { Deserializable } from '../interfaces';

export class UsuarioRolProcesoDTOV2 implements Deserializable {
  
  rolNombre: string;
  procesoNombre: string;
  rolId: number;
  
  constructor() {
    this.rolNombre = null;
    this.procesoNombre = null;
    this.rolId = null;
    
  }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
