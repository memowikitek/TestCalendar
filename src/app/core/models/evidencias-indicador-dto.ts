import { Deserializable } from 'src/app/utils/interfaces';
import { MetasIndicadoresDTOV1 } from 'src/app/utils/models/metas-indicadores.dto.v1';
// import { EvidenciasIndicadorCapturaDTO } from "../../utils/models/evidencias-indicador-captura-dto";

export class EvidenciasIndicadorDTO extends MetasIndicadoresDTOV1 implements Deserializable {
    avancecargaevidecias: number = 0;
    evidenciasAreasResponsables: [] = [];
    Id: number;

    claveInstitucion: string;
    claveCampus: string;
    claveAreaResponsable: string;

    constructor() {
        super();  
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
