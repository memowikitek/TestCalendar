import { Deserializable } from '../interfaces';

export class UsuarioProcesoEvaluacionRolDTO implements Deserializable {
    procesoEvaluacionId: number;
    rolId: number;

    constructor() {
        this.procesoEvaluacionId = null;
        this.rolId = null;
        
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
