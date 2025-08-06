import { Deserializable } from '../interfaces';

export class FiltroCampusInstitucionRegionDTO implements Deserializable {
    institucionesId:(number) [];
    regionesId:(number) [];
    
    constructor() {
        this.institucionesId = [];
        this.regionesId = [];        
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
