import { Deserializable } from '../interfaces';

export class UsuarioSubareaCentralDTO implements Deserializable {
    areaCentralId: number;
    subAreaCentralId: number;

    constructor() {
        this.areaCentralId = null;
        this.subAreaCentralId = null;
        
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
