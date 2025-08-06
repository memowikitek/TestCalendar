import { Deserializable } from '../interfaces';

export class RegistroEvidenciaArchivo implements Deserializable {
    registroEvidenciaArchivoId: number;
    acreditadoraProcesoId: string;
    carreraId: string;
    criterioId: string;
    evidenciaId: number;
    subareaId: number;
    campusId: number;
    esUrl: boolean;
    nombreArchivo: string;
    mime: string;
    url: string;
    registroEvidencia: string;
    constructor() {
        this.registroEvidenciaArchivoId = null;
        this.acreditadoraProcesoId = null;
        this.carreraId = null;
        this.criterioId = null;
        this.evidenciaId = null;
        this.subareaId = null;
        this.campusId = null;
        this.esUrl = null;
        this.nombreArchivo = null;
        this.mime = null;
        this.url = null;
        this.registroEvidencia = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
