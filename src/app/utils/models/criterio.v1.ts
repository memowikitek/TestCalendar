import { Deserializable } from '../interfaces';
import { AcreditadoraProcesoDTOV1 } from './acreditadora.dto.v1';
import { CapituloDTOV1 } from './capitulo.v1';
import { CarreraDTOV1 } from './carrera.dto.v1';
import { TipoEvidenciaDTO } from './tipo-evidencia.dto';

export class CriterioDTOV1 implements Deserializable {
    clave: string;
    criterioId: string;
    descripcion: string;
    acreditadoraProcesoId: string;
    acreditadoraProceso: AcreditadoraProcesoDTOV1;
    carreraId: string;
    carrera: CarreraDTOV1;
    capituloId: string;
    capitulo: CapituloDTOV1;
    tipoEvidenciaId: number;
    tipoEvidencia: TipoEvidenciaDTO;
    fechaCreacion: Date | string;
    usuarioModificacion: number;
    fechaModificacion: Date | string;
    usuarioCreacion: number;
    apartados: [];
    evidencia: [];
    registroEvidencia: [];
    usuarioRolProcesoCriterios: [];

    constructor() {
        this.clave = null;
        this.criterioId = null;
        this.acreditadoraProcesoId = null;
        this.acreditadoraProceso = null;
        this.carreraId = null;
        this.carrera = null;
        this.capituloId = null;
        this.capitulo = null;
        this.tipoEvidenciaId = null;
        this.tipoEvidencia = null;
        this.descripcion = null;
        this.fechaCreacion = null;
        this.usuarioCreacion = null;
        this.fechaModificacion = null;
        this.usuarioModificacion = null;
        this.apartados = [];
        this.evidencia = [];
        this.registroEvidencia = [];
        this.usuarioRolProcesoCriterios = [];
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
