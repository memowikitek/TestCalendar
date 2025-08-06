import { EvidenciasArchivosAdd } from "./evidencias-archivos-add";
import { EvidenciasIndicadoresAdd } from "./evidencias-indicadores-add";

export class EvidenciasAreaResponsableAdd {
    id?: any;
    configGeneralId: number;
    areaResponsableId: number;
    nivelModalidadId?: any;
    porcentajeMaximo: number;
    totalEvidencias: number;
    evidenciasObligatorias: number;
    calculoAvance: number;
    activo: boolean;
    usuarioCreacion: number;
    evideIndicadores: EvidenciasIndicadoresAdd[] = [];
}

// interface RootObject {
//     id?: any;
//     configGeneralId: number;
//     areaResponsableId: number;
//     nivelModalidadId?: any;
//     porcentajeMaximo: number;
//     totalEvidencias: number;
//     evidenciasObligatorias: number;
//     calculoAvance: number;
//     activo: boolean;
//     usuarioCreacion: number;
//     evideIndicadores: EvideIndicadore[];
//   }
  