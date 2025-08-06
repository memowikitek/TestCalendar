import { Deserializable } from '../interfaces';
import { EvidenceDTO } from './evidence-catalog.dto';

export class IndicadorEvidencia implements Deserializable {
    id: number | null;
    cfgIndicadorId: number | null;
    evidenciaId: number | null;
    archivoAzureId: number | null;
    activo: boolean | null;
    fechaCreacion: Date | string;
    usuarioCreacion: number | null;
    fechaModificacion: Date | string;
    usuarioModificacion: number | null;
    evidencia: EvidenceDTO | null;
    archivoAzure: any | null;
    formatoEvidencia: File | null;

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
