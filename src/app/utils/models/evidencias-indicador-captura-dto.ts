import { EvidenciasArchivo } from './evidencias-archivo';

export class EvidenciasIndicadorCapturaDTO {
    id: number;
    evidenciasId: number;
    indicadorKpiid: number;
    indicadorKpiclave: string;
    indicadorKpinombre: string;
    indicadorKPIDescripcion: string;
    componenteid: number;
    componenteClave: string;
    componenteNombre: string;
    elementoEvaluacionId: number;
    elementoEvaluacionClave: string;
    elementoEvaluacionNombre: string;
    normativaId: number;
    normativaClave: string;
    normativaNombre: string;
    autorizadoNa: boolean;
    activo: boolean = true;
    nombre: string;
    cantidad: number;
    archivoAzureId: number;
    nombreArchivo: string;
    evidenciasArchivos: EvidenciasArchivo[] = [];

    nivelModalidadId:number;

    misioninstitucional: string = '';
    pilarestrategico: string = '';
    indicadorMi: string = '';
    subindicadorMi: string = '';

    fechaCreacion = Date();
    fechaModificacion = Date();
    indicadorSiacId: number = 0;

    evidenciaId : number ;
    tipoEvidencia : string = '';
    // justificacion : string = '';
    // estatus : number ;
    // url : string = '';
}
