import { Deserializable } from '../interfaces';

export enum TipoArea {
    Comun = 'G',
    NivelModalidad = 'C',
    //Generica = 'Genérica',
    //Campus = 'Campus',
}
export class AreaResponsableCampusDTO implements Deserializable {
    id: number;
    clave: string;
    nombre: string;
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
