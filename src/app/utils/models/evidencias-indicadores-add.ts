import { EvidenciasArchivosAdd } from "./evidencias-archivos-add";

export class EvidenciasIndicadoresAdd {
    evidenciasId?: any;
    indicadorSiacId: number;
    evidenciaId: number;
    tipoEvidencia: string;
    justificacion: string;
    estatus: number;
    url: string;
    activo: boolean;
    usuarioCreacion: number;
    evidenciasArchivosAdds: EvidenciasArchivosAdd[] = [];
    nivelModalidadId: number;
}


// interface EvideIndicadore {
//     evidenciasId?: any;
//     indicadorSiacId: number;
//     evidenciaId: number;
//     tipoEvidencia: string;
//     justificacion: string;
//     estatus: number;
//     url: string;
//     activo: boolean;
//     usuarioCreacion: number;
//     evidenciasArchivosAdds: EvidenciasArchivosAdd[];
//   }