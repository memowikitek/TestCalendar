export class IndicadoresCapturaDto {
    clave: string;    
    idproceso: number;
    cfgGeneralId: number;
    
    areaResponsableId: number;

    componenteId: number;
    claveComponente: string;
    componente: string;
    
    elementoEvaluacionId: number;
    claveElementoEvaluacion: string;
    elementoEvaluacion: string;
    
    indicadorSiacid: number;
    claveIndicadorSiac: string;
    indicadorSiac: string;
    descripcionIndicadorSiac: string;

    nivel: string;
    nivelModalidadId: number;
    nivelModalidad: string;
    modalidad: string;
    
    claveComponenteMi: any;
    componenteMi: any;

    pilarEstrategicoMi: any;

    claveIndicadorMi: any;
    indicadorMi: any;

    claveSubIndicadorMi: any;
    subIndicadorMi: any;

    cicloAnterior: string;

    noAplica: boolean;
    justificacionNa: string;
    
    autorizadoNa: boolean;
    
    normativas: any;

    usuarioCreacion: number;
    usuarioModificacion: any;

    activo: boolean;
    fechaCreacion: string;
    fechaModificacion: any;
}
