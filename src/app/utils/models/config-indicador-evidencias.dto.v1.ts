import { Deserializable } from '../interfaces';
import { ConfigIndicadorDTOV1 } from './config-indicador.dto.v1';
import { EvidenceDTO } from './evidence-catalog.dto';
import { FileAzureDTOV1 } from './file-azure..dto.v1';

export class ConfigIndicadorEvidenciasDTOV1 implements Deserializable {
    id: number;
    cfgIndicadorId: number;
    evidenciaId: number;
    archivoAzureId: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    archivoAzure: FileAzureDTOV1;
    cfgIndicador: ConfigIndicadorDTOV1;
    evidencia: EvidenceDTO;

    constructor() {
        this.id = null;
        this.cfgIndicadorId = null;
        this.evidenciaId = null;
        this.archivoAzureId = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.archivoAzure = null;
        this.cfgIndicador = null;
        this.evidencia = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
