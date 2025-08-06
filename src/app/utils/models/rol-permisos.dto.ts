import { Deserializable } from '../interfaces';
import { Vista } from './vista';
import { TipoRolDTO } from './tipo-rol.dto'
import { PermisoPorVistaDTO } from './permisos-por-vista.dto';

export class RolPermisosDTO implements Deserializable {
  id: number;
  nombre: string;
  activo: boolean;
  isAllAreas: boolean;
  tipoRolId: number;
  fechaCreacion: Date | string;
  usuarioCreacion: number;
  fechaModificacion: Date | string;
  usuarioModificacion: number;

  vistasId: number[];
  permisos: PermisoPorVistaDTO[];

  constructor(){
      this.id = null;
      this.nombre = null;
      this.activo = null;
      this.isAllAreas = null;
      this.tipoRolId = null;
      this.fechaCreacion = null;
      this.usuarioCreacion = null;
      this.fechaModificacion = null;
      this.usuarioModificacion = null;
      this.vistasId = [];
      this.permisos = [];
  }

  // public addPermisoPorVista(vistaId: number, permisoId: number){
  //   var relacion = this.permisos.find( r => r.vistaId == vistaId);
  //   if(relacion){
  //     relacion.permisosId.push(permisoId);
  //   }
  //   else{
  //     relacion = new PermisosPorVistaDTO();
  //     relacion.vistaId = vistaId;
  //     relacion.permisosId.push(permisoId);
  //     this.permisos.push(relacion);
  //   }
  // }

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
