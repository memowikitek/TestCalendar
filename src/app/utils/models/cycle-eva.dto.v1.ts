import { Deserializable } from '../interfaces';

//RECORD CYCLE EVALUATION
export class CycleEvaDTOV1 implements Deserializable {
    cicloEvaluacionId: number
    cicloEvaluacion: string
    procesoEvaluacionId: number
    procesoEvaluacion: string
    totalIndicadores: number
    institucionId: number
    claveInstitucion: string
    institucion: string
    anio: number
    ciclo: string
    fechaInicio: Date | string
    fechaFin: Date | string
    activo: boolean
    fechaCreacion: Date | string
    usuarioCreacion: number
    fechaModificacion: Date | string
    usuarioModificacion: number
    etapaEvaluacion: EtapaEvaluacion[]

    bienvenidaArchivoId: number
    nombreArchivo: string
    urlArchivo: string
    fileBase64String: string
    nombreFormato: string
    archivo: string

    fpmArchivoId: number
    nombreArchivoFpm: string
    urlArchivoFpm: string
    fileBase64FpmString: string
    nombreFmp: string
    archivoFpm: string

    cicloAnteriorId: number
    //archivoAzureId: number

    constructor() {
        this.cicloEvaluacionId = null;
        this.cicloEvaluacion = null;
        this.procesoEvaluacionId = null;
        this.procesoEvaluacion = null;
        this.totalIndicadores = null;
        this.institucionId = null;
        this.claveInstitucion = null;
        this.institucion = null;
        this.anio = null;
        this.ciclo = null;
        this.fechaInicio = null;
        this.fechaFin = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.etapaEvaluacion = [];
        this.bienvenidaArchivoId = null;
        this.nombreArchivo = null;
        this.urlArchivo = null;
        this.fileBase64String = null;
        this.nombreFormato = null;
        this.archivo = null;
        this.fpmArchivoId = null;
        this.nombreArchivoFpm = null;
        this.urlArchivoFpm = null;
        this.fileBase64FpmString = null;
        this.nombreFmp = null;
        this.archivoFpm = null;        
        this.cicloAnteriorId = null;
        //this.archivoAzureId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

export class EtapaEvaluacion {
    cicloEvaluacionId: number
    etapaId: number
    etapa: string
    claveEtapa: string
    fechaInicio: Date | string
    fechaFin: Date | string
    fechaInicioExt: Date | string
    fechaFinExt: Date | string
    activo: boolean
    fechaCreacion: Date | string
    usuarioCreacion: number
    fechaModificacion: Date | string
    usuarioModificacion: number
}

//GetAll
export class CicloEvaDTOV1 implements Deserializable {
    cicloEvaluacionId: number
    cicloEvaluacion: string
    procesoEvaluacionId: number
    procesoEvaluacion: string
    totalIndicadores: number
    institucionId: number
    claveInstitucion: string
    institucion: string
    anio: number
    ciclo: string
    fechaInicio: Date | string
    fechaFin: Date | string
    activo: boolean
    fechaCreacion: Date | string
    usuarioCreacion: number
    fechaModificacion: Date | string
    usuarioModificacion: number
    etapaEvaluacion: any[]
    bienvenidaArchivoId: number
    nombreArchivo: string
    urlArchivo: string
    fileBase64String: string
    nombreFormato: string
    archivo: string
    fpmArchivoId: number
    nombreArchivoFpm: string
    urlArchivoFpm: string
    fileBase64FpmString: string
    nombreFmp: string
    archivoFpm: string
    cicloAnteriorId: number
    //archivoAzureId: number

    constructor() {
        this.cicloEvaluacionId = null;
        this.cicloEvaluacion = null;
        this.procesoEvaluacionId = null;
        this.procesoEvaluacion = null;
        this.totalIndicadores = null;
        this.institucionId = null;
        this.claveInstitucion = null;
        this.institucion = null;
        this.anio = null;
        this.ciclo = null;
        this.fechaInicio = null;
        this.fechaFin = null;
        this.activo = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.etapaEvaluacion = [];
        this.bienvenidaArchivoId = null;
        this.nombreArchivo = null;
        this.urlArchivo = null;
        this.fileBase64String = null;
        this.nombreFormato = null;
        this.archivo = null;
        this.fpmArchivoId = null;
        this.nombreArchivoFpm = null;
        this.urlArchivoFpm = null;
        this.fileBase64FpmString = null;
        this.nombreFmp = null;
        this.archivoFpm = null;        
        this.cicloAnteriorId = null;
        //this.archivoAzureId = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}

//Edit
export interface FechasEtapas {
    [key: string]: Date | string;
}

//Busqueda Ciclo Anterior
export class GetLastCEDTOV1 implements Deserializable {
    ProcesoEvaluacionId: number
    InstitucionId: number
    anio: number
    Ciclo: string

    constructor() {
        this.ProcesoEvaluacionId = null;
        this.InstitucionId = null;
        this.anio = null;
        this.Ciclo = null;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}