export class CEIndicadorEtapa1CampusDto {
    
    campus: string;
    areaResponsable: string;
    tipoResultado: string;
    nivelModalidad: string ;
    claveNombreElementoEvaluacion: string ;
    claveNombreIndicador: string;
    indicadorId: number;
    cicloEvaluacionId: number;

    nivelModalidadId: number;
    subAreaCentral: string;
    estatusEtapa: number;
    estatusDescripcion: string;    
    
    ceEtapa1MetasID : number;
    metaAnterior: number;
    decisionAnterior : number;
    metaActual : number;
    solicitaNA :boolean;
    justificacionNA : string;
    autorizaNA: boolean;
    comentAutorizaNA : string;

    campusId: number;
    areaId: number;
    // 
    CicloEvaluacionInfo : any;
    nombreCampus: any;
    nombreArea: any;
    claveElementoEvaluacion: any;
    nombreElementoEvaluacion: any;
    claveIndicador: any;
    nombreIndicador: any;
    constructor() {
    this.campus= null;
    this.areaResponsable= null;
    this.tipoResultado= null;
    this.nivelModalidad= null;
    this.claveNombreElementoEvaluacion= null ;
    this.claveNombreIndicador= null;
    this.indicadorId= null;
    this.cicloEvaluacionId= null;

    this.nivelModalidadId= null;
    this.subAreaCentral= null;
    this.estatusEtapa= null;
    this.estatusDescripcion= null;

    this.ceEtapa1MetasID = null;
    this.metaAnterior= null;
    this.decisionAnterior = null;
    this.metaActual = null;
    this.solicitaNA = null;
    this.justificacionNA = null;
    this.autorizaNA= null;
    this.comentAutorizaNA = null;

    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
