import { Deserializable } from '../interfaces';
export class MenuDTO implements Deserializable {
    id: number;
    nombre: string;
    url: string;
    activo: boolean;
    muestraSubmenu: boolean;
    vistaPadre: number;
    subMenus: MenuDTO[]

    constructor() {
        this.id = null;
        this.nombre = null;
        this.url = null;
        this.activo = null;
        this.muestraSubmenu = null;
        this.vistaPadre = null;
        this.subMenus = null;
        
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
