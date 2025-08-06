export class NotificacionesNaDto {
  cicloEvaluacionId: number;
  titulo: string;
  mensaje: string;
  fechaCreacion: Date;
  usuarioCreacion: number;
 
  constructor() {
       this.fechaCreacion = new Date();
  }
}