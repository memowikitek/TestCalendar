import { Deserializable } from '../interfaces';

export class ConfiguracionIndicadorSiacDTOV1 implements Deserializable {
    id: number;
    confElementoEvaluacionId: string | number;
    catIndicadorSiacId: string | number;
    claveIndicadorSiac: string;
    indicadorSiac: string;
    componenteMiId: string | number;
    nombreComponenteMi: string;
    descripcionComponenteMi: string;
    indicadorMiId: string | number;
    nombreIndicadorMi: string;
    subindicadorMiId: string | number;
    nombreSubIndicadorMi: string;
    catPeriodoEvaluacionId: string | number;
    anio: string | number;
    idCiclo: string | number;
    ciclo: string;
    idInstitucion: string | number;
    institucion: string;
    proceso: string | number;
    catAreaResponsableId: string | number;
    areaResponsable: string;
    catNivelModalidadId: string | number;
    nivelModalidad: string;
    catComponenteId: string | number;
    claveComponente: string;
    componente: string;
    catElementoEvaluacionId: number;
    claveElementoEvaluacion: string | number;
    elementoEvaluacion: string;
    catAreaCorporativaId: string | number;
    siglasAreaCorporativa: string;
    areaCorporativa: string;
    catSubAreaCorporativaId: string | number;
    subAreaCorporativa: string;
    siglasSubAreaCorporativa: string;
    catNormativaId: string | number;
    claveNormativa: string;
    nombreNormativa: string;
    catEvidenciaId: string | number;
    claveEvidencia: string;
    nombreEvidencia: string;
    descripcionEvidencia: string;
    cantidadEvidencia: string;
    activo: boolean;
    listaArchivos: ConfigurationIndicatorSIACFile[];
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.confElementoEvaluacionId = null;
        this.catIndicadorSiacId = null;
        this.claveIndicadorSiac = null;
        this.indicadorSiac = null;
        this.componenteMiId = null;
        this.nombreComponenteMi = null;
        this.descripcionComponenteMi = null;
        this.indicadorMiId = null;
        this.nombreIndicadorMi = null;
        this.subindicadorMiId = null;
        this.nombreSubIndicadorMi = null;
        this.catPeriodoEvaluacionId = null;
        this.anio = null;
        this.idCiclo = null;
        this.ciclo = null;
        this.idInstitucion = null;
        this.institucion = null;
        this.proceso = null;
        this.catAreaResponsableId = null;
        this.areaResponsable = null;
        this.catNivelModalidadId = null;
        this.nivelModalidad = null;
        this.catComponenteId = null;
        this.claveComponente = null;
        this.componente = null;
        this.catElementoEvaluacionId = null;
        this.claveElementoEvaluacion = null;
        this.elementoEvaluacion = null;
        this.catAreaCorporativaId = null;
        this.siglasAreaCorporativa = null;
        this.areaCorporativa = null;
        this.catSubAreaCorporativaId = null;
        this.subAreaCorporativa = null;
        this.siglasSubAreaCorporativa = null;
        this.catNormativaId = null;
        this.claveNormativa = null;
        this.nombreNormativa = null;
        this.catEvidenciaId = null;
        this.claveEvidencia = null;
        this.nombreEvidencia = null;
        this.descripcionEvidencia = null;
        this.cantidadEvidencia = null;
        this.activo = null;
        this.listaArchivos = [];
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    getProccessString(): string {
        //return `${this.proceso ? 'procedimiento_' + this.proceso : null}`;
        return `${this.proceso ? this.proceso : null}`;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class ConfigurationIndicatorSIACFile implements Deserializable {
    id: string | number;
    confIndicadorSiacId: string | number;
    azureStorageFileId: string | number;
    fileName: string;

    constructor() {
        this.id = null;
        this.confIndicadorSiacId = null;
        this.azureStorageFileId = null;
        this.fileName = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class ConfiguracionIndicadorSiacAddUpdateDTOV1 implements Deserializable {
    id: string | number;
    confElementoEvaluacionId: string | number;
    catIndicadorSiacId: string | number;
    componenteMiId: string | number;
    indicadorMiId: string | number;
    subindicadorMiId: string | number;
    catNormativaId: string | number;
    catEvidenciaId: string | number;
    activo: boolean;
    archivos: (string | number)[];
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;

    constructor() {
        this.id = null;
        this.confElementoEvaluacionId = null;
        this.catIndicadorSiacId = null;
        this.componenteMiId = null;
        this.indicadorMiId = null;
        this.subindicadorMiId = null;
        this.catNormativaId = null;
        this.catEvidenciaId = null;
        this.activo = null;
        this.archivos = [];
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class FileAzureStorage implements Deserializable {
    file: File;
    FechaCreacion: Date | string;
    UsuarioCreacion: number;

    constructor() {
        this.file = null;
        this.FechaCreacion = null;
        this.UsuarioCreacion = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
