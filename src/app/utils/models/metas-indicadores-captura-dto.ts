import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Deserializable } from '../interfaces';
import { MetasIndicadoresDTO } from './metas-indicadores.dto';

export class MetasIndicadoresCapturaDTO implements Deserializable {
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
    clave: string;
    nivelModalidadId: number;
    nivelModalidad: string;
    modalidad: string;
    nivel: string;
    claveComponenteMi: any;
    componenteMi: any;
    pilarEstrategicoMi: any;
    claveIndicadorMi: any;
    indicadorMi: any;
    claveSubIndicadorMi: any;
    subIndicadorMi: any;
    metasId: number;
    metaAnterior: number;
    resultadoAnterior: number;
    metaActual: number;
    resultadoActual: number;
    cumplimiento: number;
    cicloAnterior: string;
    noAplica: boolean;
    justificacionNa: string;
    autorizadoNa: boolean;
    activo: boolean;
    fechaCreacion: string;
    usuarioCreacion: number;
    fechaModificacion: any;
    usuarioModificacion: any;
    normativas: any;

    static asFormGroup(metasIndicadoresCapturaDTO: MetasIndicadoresCapturaDTO): FormGroup {
        const fg = new FormGroup({
            metasId: new FormControl(metasIndicadoresCapturaDTO.metasId),
            cfgGeneralId: new FormControl(metasIndicadoresCapturaDTO.cfgGeneralId),
            usuarioModificacion: new FormControl(metasIndicadoresCapturaDTO.usuarioModificacion ?? ''),
            areaResponsableId: new FormControl(metasIndicadoresCapturaDTO.areaResponsableId),
            idproceso: new FormControl(metasIndicadoresCapturaDTO.idproceso),

            componenteId: new FormControl(metasIndicadoresCapturaDTO.componenteId),
            claveComponente: new FormControl(metasIndicadoresCapturaDTO.claveComponente),
            componente: new FormControl(metasIndicadoresCapturaDTO.componente),

            elementoEvaluacionId: new FormControl(metasIndicadoresCapturaDTO.elementoEvaluacionId),
            claveElementoEvaluacion: new FormControl(metasIndicadoresCapturaDTO.claveElementoEvaluacion),
            elementoEvaluacion: new FormControl(metasIndicadoresCapturaDTO.elementoEvaluacion),

            componenteMi: new FormControl(metasIndicadoresCapturaDTO.componenteMi ?? ''),
            pilarEstrategicoMi: new FormControl(metasIndicadoresCapturaDTO.pilarEstrategicoMi ?? ''),
            indicadorMi: new FormControl(metasIndicadoresCapturaDTO.indicadorMi ?? ''),
            subIndicadorMi: new FormControl(metasIndicadoresCapturaDTO.subIndicadorMi ?? ''),

            indicadorSiacid: new FormControl(metasIndicadoresCapturaDTO.indicadorSiacid),
            claveIndicadorSiac: new FormControl(metasIndicadoresCapturaDTO.claveIndicadorSiac),
            indicadorSiac: new FormControl(metasIndicadoresCapturaDTO.indicadorSiac),
            descripcionIndicadorSiac: new FormControl(metasIndicadoresCapturaDTO.descripcionIndicadorSiac),

            nivelModalidadId: new FormControl(metasIndicadoresCapturaDTO.nivelModalidadId),
            nivelModalidadClave: new FormControl(metasIndicadoresCapturaDTO.clave),
            nivelModalidad: new FormControl(metasIndicadoresCapturaDTO.nivelModalidad),

            normativas: new FormControl(metasIndicadoresCapturaDTO.normativas),
            // normativaClave: new FormControl(metasIndicadoresCapturaDTO.normativaClave),
            // normativaNombre: new FormControl(metasIndicadoresCapturaDTO.normativaNombre),

            // captura , Validators.required
            metaAnterior: new FormControl(metasIndicadoresCapturaDTO.metaAnterior),
            resultadoAnterior: new FormControl(metasIndicadoresCapturaDTO.resultadoAnterior),
            metaActual: new FormControl(metasIndicadoresCapturaDTO.metaActual),
            resultadoActual: new FormControl(metasIndicadoresCapturaDTO.resultadoActual),
            cumplimiento: new FormControl(metasIndicadoresCapturaDTO.cumplimiento),
            cicloAnterior: new FormControl(metasIndicadoresCapturaDTO.cicloAnterior ?? 'SD'),
            noAplica: new FormControl(metasIndicadoresCapturaDTO.noAplica),
            justificacionNa: new FormControl(metasIndicadoresCapturaDTO.justificacionNa),
            autorizadoNa: new FormControl(metasIndicadoresCapturaDTO.autorizadoNa),
            fechaCreacion: new FormControl(metasIndicadoresCapturaDTO.fechaCreacion ?? new Date()),
            fechaModificacion: new FormControl(metasIndicadoresCapturaDTO.fechaModificacion ?? new Date()),
            // usuarioCreacion: new FormControl(metasIndicadoresCapturaDTO.usuarioCreacion ?? 0),
            activo: new FormControl(metasIndicadoresCapturaDTO.activo),
            // indicadorSiacId: new FormControl(metasIndicadoresCapturaDTO.indicadorSiacId ?? 0)

            // configGeneralId: new FormControl(metasIndicadoresCapturaDTO.configGeneralId),
            // componenteId: new FormControl(metasIndicadoresCapturaDTO.componenteId),
            // componenteClave: new FormControl(metasIndicadoresCapturaDTO.componenteClave),
            // componenteNombre: new FormControl(metasIndicadoresCapturaDTO.componenteNombre),

            // misioninstitucional: new FormControl(metasIndicadoresCapturaDTO.misioninstitucional ?? ''),
            // pilarestrategico: new FormControl(metasIndicadoresCapturaDTO.pilarestrategico ?? ''),
            // indicadorMi: new FormControl(metasIndicadoresCapturaDTO.indicadorMi ?? ''),
            // subindicadorMi: new FormControl(metasIndicadoresCapturaDTO.subindicadorMi ?? ''),

            // indicadorKpiid: new FormControl(metasIndicadoresCapturaDTO.indicadorKpiid),
            // indicadorKpiclave: new FormControl(metasIndicadoresCapturaDTO.indicadorKpiclave),
            // indicadorKpinombre: new FormControl(metasIndicadoresCapturaDTO.indicadorKpinombre),
            // indicadorKpidescripcion: new FormControl(metasIndicadoresCapturaDTO.indicadorKPIDescripcion),

            // normativaId: new FormControl(metasIndicadoresCapturaDTO.normativaId),
            // normativaClave: new FormControl(metasIndicadoresCapturaDTO.normativaClave),
            // normativaNombre: new FormControl(metasIndicadoresCapturaDTO.normativaNombre),

            // // captura , Validators.required
            // metaAnterior: new FormControl(metasIndicadoresCapturaDTO.metaAnterior),
            // resultadoAnterior: new FormControl(metasIndicadoresCapturaDTO.resultadoAnterior),
            // metaActual: new FormControl(metasIndicadoresCapturaDTO.metaActual),
            // resultadoActual: new FormControl(metasIndicadoresCapturaDTO.resultadoActual),
            // cumplimiento: new FormControl(metasIndicadoresCapturaDTO.cumplimiento),
            // cicloAnterior: new FormControl(metasIndicadoresCapturaDTO.cicloAnterior ?? 'SD'),
            // noAplica: new FormControl(metasIndicadoresCapturaDTO.noAplica),
            // justificacionNa: new FormControl(metasIndicadoresCapturaDTO.justificacionNa),
            // autorizadoNa: new FormControl(metasIndicadoresCapturaDTO.autorizadoNa),
            // fechaCreacion: new FormControl(metasIndicadoresCapturaDTO.fechaCreacion ?? new Date()),
            // fechaModificacion: new FormControl(metasIndicadoresCapturaDTO.fechaModificacion ?? new Date()),
            // // usuarioCreacion: new FormControl(metasIndicadoresCapturaDTO.usuarioCreacion ?? 0),
            // activo: new FormControl(metasIndicadoresCapturaDTO.activo),
            // indicadorSiacId: new FormControl(metasIndicadoresCapturaDTO.indicadorSiacId ?? 0)
        });
        return fg;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
