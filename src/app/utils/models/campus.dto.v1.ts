import { Deserializable } from '../interfaces';
import { AreaResponsableDTOV1 } from './area-responsable.dto.v1';
import { NivelModalidadDTOV1 } from './nivel-modalidad.dto.v1';

export class CampusDTOV1 implements Deserializable {
    id: number;
    institucionId: number;
    institucion: string = null;
    directorRegionalId: number;
    directorRegional: string = null;
    clave: string;
    nombre: string;
    regionId: number;
    region: string;
    nivelesModalidadIds: number[];
    nivelesModalidad: NivelModalidadDTOV1[];
    areaResponsables: AreaResponsableDTOV1[];
    nivelModalidad: string = null;
    nivelModalidadIds: number = null;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.regionId = null;
        this.region = null;
        this.nivelesModalidad = [];
        this.areaResponsables = [];
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getLevelModalityListString(): string {
        return this.nivelesModalidad.map((i) => `${i.nivel} / ${i.modalidad}`).join(', ');
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
