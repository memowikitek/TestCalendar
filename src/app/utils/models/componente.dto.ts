import { Deserializable } from '../interfaces';
export class ComponenteDTO implements Deserializable {
  componenteId: number;
  nombre: string;
  activo: boolean;
  constructor() {
    this.componenteId = null;
    this.nombre = null;
    this.activo = null;
  }
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
