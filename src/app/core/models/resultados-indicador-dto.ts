import { Deserializable } from "src/app/utils/interfaces";
import { MetasIndicadoresDTOV1 } from "src/app/utils/models/metas-indicadores.dto.v1";

export class ResultadosIndicadorDTO extends MetasIndicadoresDTOV1 implements Deserializable {

    calculoAvanceResultados : number;
    
    constructor() {
        super();
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}