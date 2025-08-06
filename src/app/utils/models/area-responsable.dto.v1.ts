import { Deserializable } from '../interfaces';

export enum ModalTitleV1 {
    Comun = 'Area Común',
    NivelModalidad = 'Nivel / Modalidad',
    //Generica = 'Genérica',
    //Campus = 'Campus',
}

export enum TipoArea {
    Comun = 'G',
    NivelModalidad = 'C',
    //Generica = 'Genérica',
    //Campus = 'Campus',
}
export class AreaResponsableDTOV1 implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
    areaPadre: number;
    tipoArea: string;
    consolidacion: boolean;
    areaCorporativaId: number;
    areaCorporativa: string;
    areaCorporativaSiglas: string;
    dependenciaAreaId: number;
    dependenciaArea: string;
    nivelModalidad: string;
    activo: boolean;
    fechaCreacion: Date | string;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    usuarioModificacion: number;
    campuses: number[] = [];
    institucionId: number;
    constructor() {
        this.id = null;
        this.clave = null;
        this.nombre = null;
        this.tipoArea = null;
        this.consolidacion = null;
        this.areaCorporativaId = null;
        this.areaCorporativa = null;
        this.areaCorporativaSiglas = null;
        this.dependenciaAreaId = null;
        this.dependenciaArea = null;
        this.nivelModalidad = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getTypeArea(): string {
        return this.tipoArea == 'G' ? TipoArea.Comun : TipoArea.NivelModalidad;
    }

    getTypeAreaStr(): string {
        return this.tipoArea == 'G' ? 'Area Común' : 'Nivel / Modalidad';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
