import { Deserializable } from '../interfaces';

export class ConfigGeneralDTO implements Deserializable {
    id: number;
    periodoEvaluacionId: number;
    areaResponsableId: number;
    nivelModalidadId: number;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    nivelesModalidad: string;

    constructor() {
        this.id = null;
        this.periodoEvaluacionId = null;
        this.areaResponsableId = null;
        this.nivelModalidadId = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.nivelesModalidad = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
