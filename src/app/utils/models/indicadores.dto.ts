//import { Audit, Deserializable } from '../interfaces';

import { Deserializable } from "../interfaces/deserializable";
import { AuditDTO } from "./audit.dto";
import { ComponenteMIDTO } from "./componente-mi.dto";
export class IndicadoresDTO implements Deserializable {
  //ProcesoEvaluacionId: number;
  //ComponenteId: number;
  //ElementoEvaluacionId: number;
  IndicadorSiacid: number;
  //AreaCentralId: number;
  //SubAreaCentralId: number;
  Activo: boolean;
  //FechaCreacion: Date | string;
  //UsuarioCreacion: number | null;
  //FechaModificacion: Date | string;
  //UsuarioModificacion: number | null;
  Componente: any;
  ElementoEvaluacion: any; 
  IndicadorSiac: any;
  ProcesoEvaluacion: any;
  //TblIndicadoresAreaResponsable: any;
 // TblIndicadoresCiclo: any;     
 // TblIndicadoresEvidencia: any; 
 // TblIndicadoresNivelModalidad: any;
 // TblIndicadoresNormativa:  any;
 // TblIndicadoresRubrica: any;

  constructor() {
/*        this.ProcesoEvaluacionId = null;
      this.ComponenteId = null;
      this.ElementoEvaluacionId = null;
      this.AreaCentralId = null;
      this.SubAreaCentralId = null;*/
      this.IndicadorSiacid = null;
      this.Activo = null;
/*        this.FechaCreacion = null;
      this.UsuarioCreacion = null;
      this.FechaModificacion = null;
      this.UsuarioModificacion = null;
      */
      this.Componente = null;
      this.ElementoEvaluacion = null;
      this.IndicadorSiac = null;
      this.ProcesoEvaluacion = [];
   /*   this.TblIndicadoresCiclo = null;
      this.TblIndicadoresEvidencia = null;
      this.TblIndicadoresNivelModalidad = null;
      this.TblIndicadoresNormativa = null;
      this.TblIndicadoresRubrica = null;    */
  }

  deserialize(input: any): this {
      Object.assign(this, input);

      return this;
  }
}
