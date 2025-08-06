import { Deserializable } from '../interfaces';
import { TipoArea } from './area-responsable.dto.v1';

export class ConfNivelAreaResponsableDTO implements Deserializable {
    id: number;
    configuracionGeneralId: number;
    periodoEvaluacionId: number;
    periodoEvaluacion: any;
    nivelModalidadId: number;
    areaResponsableId: number;
    anio: number;
    cicloId: number;
    generica: Boolean;
    areaResponsableNombre: string;
    areaResponsable: any;
    nivelModalidadNombre: string;
    nivelModalidad: any;
    nivelesModalidad: string;
    institucionId: number;
    institucion: any;
    activo: boolean;
    fechaCreacion: Date | string;
    usuarioCreacion: number;
    fechaModificacion: Date | string;
    usuarioModificacion: number;
    configComponentes: any;

    constructor() {
        this.id = null;
        this.configuracionGeneralId = null;
        this.periodoEvaluacionId = null;
        this.periodoEvaluacion = null;
        this.nivelModalidadId = null;
        this.areaResponsableId = null;
        this.anio = null;
        this.cicloId = null;
        this.generica = null;
        this.activo = null;
        this.areaResponsableNombre = null;
        this.areaResponsable = null;
        this.nivelModalidadNombre = null;
        this.nivelModalidad = null;
        this.nivelesModalidad = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getTypeArea(): string {
        return this.areaResponsable.tipoArea == TipoArea.Comun ? 'Area Común' : 'Nivel / Modalidad';
    }

    getNivelModalidad(): string {
        return this.areaResponsable.tipoArea == TipoArea.Comun ? this.nivelesModalidad : this.nivelModalidad.clave;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
