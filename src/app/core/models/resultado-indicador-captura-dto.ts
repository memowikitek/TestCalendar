import { Deserializable } from "src/app/utils/interfaces";
import { IndicadoresCapturaDto } from "./indicadores-captura-dto";
import { FormControl, FormGroup } from "@angular/forms";

export class ResultadoIndicadorCapturaDto extends IndicadoresCapturaDto implements Deserializable {
    metaAnterior: number;
    metaActual: number;

    resultadoAnterior: number; // historico
    resultadoActual: number; // modificable

    resultadoActualResultados: number;
    cumplimientoResultados: number;
    autorizadoNaresultados: boolean; // Autorizado NA de resultados
    justificacionNaresultados: string;
    cumplimiento: number; // solo lectura
    noAplicaResultados: boolean; // check NA 
    
    justificacion: string; // justificacion cuando el resultado actual es menor a la meta actual
    metasId : number;

    static asFormGroup(metasIndicadoresCapturaDTO: ResultadoIndicadorCapturaDto): FormGroup {
        const fg = new FormGroup(
            {
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

                //Campos de resultados
                resultadoActualResultados: new FormControl(metasIndicadoresCapturaDTO.resultadoActualResultados),
                cumplimientoResultados: new FormControl(metasIndicadoresCapturaDTO.cumplimientoResultados),
                autorizadoNaresultados: new FormControl(metasIndicadoresCapturaDTO.autorizadoNaresultados),
                justificacionNaresultados: new FormControl(metasIndicadoresCapturaDTO.justificacionNaresultados),
                noAplicaResultados: new FormControl(metasIndicadoresCapturaDTO.noAplicaResultados),
                justificacion: new FormControl(metasIndicadoresCapturaDTO.justificacion ?? ''),

                fechaCreacion: new FormControl(metasIndicadoresCapturaDTO.fechaCreacion ?? new Date()),
                fechaModificacion: new FormControl(metasIndicadoresCapturaDTO.fechaModificacion ?? new Date()),
                // usuarioCreacion: new FormControl(metasIndicadoresCapturaDTO.usuarioCreacion ?? 0),
                activo: new FormControl(metasIndicadoresCapturaDTO.activo),
            }
        );
        return fg;
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }

}
