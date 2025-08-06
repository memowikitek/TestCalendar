import { Component, Host, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, } from '@angular/material/dialog';
import { Alert, clearForm, validationCycle } from 'src/app/utils/helpers';
import { ValidatorService } from 'src/app/shared/validators';
import { filter, Observable, ReplaySubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BasicNotification } from 'src/app/utils/helpers/basicNotification';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateHelper } from 'src/app/utils/helpers';
import { EvaluationCycleService, UsersService, SettingsWelcomeService } from 'src/app/core/services';
import { CycleEvaDTOV1, FechasEtapas, TablePaginatorSearch, Vista, ListaArchivosModuloBienvenida, SettingsWelcomeDTO, SettingsWelcomeDTO1 } from 'src/app/utils/models';
import { CycleEvaluationData } from './cycle-record.service';
import years from 'src/assets/data/anios.json';
import ciclos from 'src/assets/data/ciclos.json';
import { LIMIT_BLOB_SIZE_CE, LIMIT_BLOB_SIZE_FILE, LIMIT_BLOB_SIZE_FMP, LIMIT_SIZE_CE, LIMIT_SIZE_FILE, LIMIT_SIZE_FMP, } from 'src/app/utils/constants';


import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { PermisosHeredadosDTO } from 'src/app/utils/models/permisos-heredados.dto';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YY', // Modificamos el formato de visualización aquí
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export enum ModalTitle {
  NEW = 'Nuevo ciclo de evaluación',
  NEWD = 'Ingresa los datos para crear un nuevo ciclo.',
  EDIT = 'Editar ciclo de evaluación',
  EDITD = 'Edita los datos para este ciclo.'
}

@Component({
  selector: 'app-cycle-record',
  templateUrl: './cycle-record.component.html',
  styleUrls: ['./cycle-record.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class CycleRecordComponent implements OnInit {
  filters: TablePaginatorSearch;
  today = new Date();
  cicloEvaRecordForm: FormGroup;
  title: ModalTitle;
  description: ModalTitle;
  edit: boolean;
  errorFile1: boolean;
  errorFile2: boolean;
  subscription: Subscription;
  estatusRecord: boolean;
  estatus: string;
  disabled: boolean;
  UsuarioCreacion: any;
  evaluacionList: any;
  procesoList: any;
  subAreaCentralList: any;
  areaCentralList: any;
  componentesList: any;
  regionData: any;
  activo: any;
  thisAccess: Vista;
  permission: boolean;
  permissions: boolean[];
  data: CycleEvaDTOV1;
  mode: boolean;
  date = new FormControl(moment());
  selectedOption: any;
  anios: any[] = years[0].anios;
  ciclos: any[] = ciclos[0].ciclos;
  etapas: any[];
  procesos: any[];
  instituciones: any[];

  Etapa1Error: boolean = false;
  Etapa2Error: boolean = false;
  Etapa3Error: boolean = false;
  Etapa4Error: boolean = false;
  Etapa5Error: boolean = false;
  Etapa6Error: boolean = false;
  Etapa7Error: boolean = false;
  Etapa8Error: boolean = false;

  Etapa8ErrorF: boolean = false;

  Etapa1ErrorE: boolean = false;
  Etapa3ErrorE: boolean = false;
  Etapa6ErrorE: boolean = false;
  Etapa7ErrorE: boolean = false;
  path: number;
  files: any[];
  filesFpm: any[];
  archivos: FormData[];
  //listaArchivos: ListaArchivosModuloBienvenida[];
  wId: number;
  uploadFile: any = null;
  uploadFileFpm: any = null;
  errFile: string = null;
  errFileFpm: string = null;
  delFile: boolean = false;
  delFileFpm: boolean = false;
  ciclosAnteriores: any[];
  filter: any;
  cicloAnterior: any;
  //cicloAnterior: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly interfaceData: CycleEvaluationData,
    private EvaCService: EvaluationCycleService,
    private readonly formBuilder: FormBuilder,
    private readonly ref: MatDialogRef<never>,
    private readonly validator: ValidatorService,
    private basicNotification: BasicNotification,
    private readonly settingsWelcomeService: SettingsWelcomeService,
    private users: UsersService,
    private router: Router
    //private datePip: DatePipe
  ) {
    this.title = ModalTitle.NEW;
    this.description = ModalTitle.NEWD;
    this.data = new CycleEvaDTOV1();
    this.edit = null;
    this.errorFile1 = null;
    this.errorFile2 = null;
    this.estatus = "Activo";
    this.estatusRecord = true;
    this.subscription = new Subscription();
    this.permission = null;
    this.thisAccess = new Vista();
    this.permissions = [false, false, false];
    //this.disabled = null;
    this.cicloEvaRecordForm = this.formBuilder.group({
      activo: [true, []],
      cicloEvaluacionId: [null, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      cicloEvaluacion: [null, [Validators.required, Validators.maxLength(100), this.validator.noWhitespace]],
      procesoEvaluacionId: [null, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      institucionId: [null, [Validators.required, Validators.maxLength(5), this.validator.noWhitespace]],
      anio: [null, Validators.required],
      ciclo: [null, Validators.required],
      etapaEvaluacion: [null],
      fechaInicioE1R: [null],
      fechaFinE1R: [null],
      fechaInicioE1E: [null],
      fechaFinE1E: [null],
      fechaInicioE2R: [null],
      fechaFinE2R: [null],
      fechaInicioE2E: [null],
      fechaFinE2E: [null],
      fechaInicioE3R: [null],
      fechaFinE3R: [null],
      fechaInicioE3E: [null],
      fechaFinE3E: [null],
      fechaInicioE4R: [null],
      fechaFinE4R: [null],
      fechaInicioE4E: [null],
      fechaFinE4E: [null],
      fechaInicioE5R: [null],
      fechaFinE5R: [null],
      fechaInicioE5E: [null],
      fechaFinE5E: [null],
      fechaInicioE6R: [null],
      fechaFinE6R: [null],
      fechaInicioE6E: [null],
      fechaFinE6E: [null],
      fechaInicioE7R: [null],
      fechaFinE7R: [null],
      fechaInicioE7E: [null],
      fechaFinE7E: [null],
      fechaInicioE8R: [null],
      fechaFinE8R: [null],
      fechaInicioE8E: [null],
      fechaFinE8E: [null],

      cicloAnteriorId: [null],
      nombreCicloAnterior: [null, []],
      anioAnterior: [null, [Validators.maxLength(4)]],
      cicloAnterior: [null, [Validators.maxLength(2)]],

      imagenCiclo: [null],
      nombreFormato: [null],
      formatoCiclo: [null],
      nombreFmp: [null],
      archivoAzureId: [null]
    });
    //REGLAS INICIO
    this.cicloEvaRecordForm.get('fechaInicioE1R').valueChanges.subscribe((value) => {
      this.cicloEvaRecordForm.get('fechaInicioE8R').setValue(value);
    });
    this.cicloEvaRecordForm.get('fechaInicioE2R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa2Error = validationCycle.validarFechasE2(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE3R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa3Error = validationCycle.validarFechasE3(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE4R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa4Error = validationCycle.validarFechasE4(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE5R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa5Error = validationCycle.validarFechasE5(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE6R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa6Error = validationCycle.validarFechasE6(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE7R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa7Error = validationCycle.validarFechasE7(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE8R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa8Error = validationCycle.validarFechasE8(value, this.cicloEvaRecordForm); }
    });
    //FECHAS FIN
    this.cicloEvaRecordForm.get('fechaFinE8R').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa8ErrorF = validationCycle.validarFechasE8F(value, this.cicloEvaRecordForm); }
    });
    //FECHAS EXTEMPORANEAS
    this.cicloEvaRecordForm.get('fechaInicioE1E').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa1ErrorE = validationCycle.validarFechasE1E(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE3E').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa3ErrorE = validationCycle.validarFechasE3E(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE6E').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa6ErrorE = validationCycle.validarFechasE6E(value, this.cicloEvaRecordForm); }
    });
    this.cicloEvaRecordForm.get('fechaInicioE7E').valueChanges.subscribe((value) => {
      if (value != null) { this.Etapa7ErrorE = validationCycle.validarFechasE7E(value, this.cicloEvaRecordForm); }
    });
  };

  ngOnInit(): void {
    this.path = window.location.pathname.search("evaluation-generation"); //console.log(this.path);
    //todo: revisar seguridad
    //this.setPermissions();
    this.getAllCategorys();
    this.title = this.interfaceData ? ModalTitle.EDIT : ModalTitle.NEW;
    this.description = this.interfaceData ? ModalTitle.EDITD : ModalTitle.NEWD;
    this.estatusRecord = this.interfaceData ? this.interfaceData.data.activo : true;
    this.estatus = this.interfaceData ? this.interfaceData.data.activo ? "Activo" : "Inactivo" : "Activo";
    this.mode = this.interfaceData ? true : false;
    if (this.mode) {
      this.cicloEvaRecordForm.get('procesoEvaluacionId').disable();
      this.cicloEvaRecordForm.get('institucionId').disable();
    }
    //
    this.cicloEvaRecordForm.get('nombreCicloAnterior').disable();
    this.cicloEvaRecordForm.get('anioAnterior').disable();
    this.cicloEvaRecordForm.get('cicloAnterior').disable();
    
    if (this.interfaceData) {
      console.log('Data Service:', this.interfaceData);
      const { cicloEvaluacionId, cicloAnteriorId } = this.interfaceData.data;
      if (cicloEvaluacionId) {
        this.EvaCService.getEvaluacionCycleById(cicloEvaluacionId).subscribe((response) => {
          if (!response.output) { return; }
          const data = new CycleEvaDTOV1().deserialize(response.output); console.log('data', data);
          this.data = data; console.log('nombreArchivo', this.data.nombreArchivo, this.data.bienvenidaArchivoId);
          this.etapasArr(data.etapaEvaluacion);
          this.cicloEvaRecordForm.patchValue(data);
          this.trackingStatusForm();
          //
          const { fechaInicio } = this.data;
          const today = validationCycle.fechaActual();
          if (fechaInicio <= today) {
            console.log('Deshabilitar');
            this.disabledDate();
          }
        });
      }
      if (cicloAnteriorId) {
        this.EvaCService.getEvaluacionCycleById(cicloAnteriorId).subscribe((response) => {
          if (!response.output) { return; }
          this.cicloAnterior = response.output; console.log('CICLO ANTERIOR', this.cicloAnterior.cicloEvaluacion);
          this.cicloEvaRecordForm.get('nombreCicloAnterior').patchValue(this.cicloAnterior.cicloEvaluacion);
          this.cicloEvaRecordForm.get('anioAnterior').patchValue(this.cicloAnterior.anio);
          this.cicloEvaRecordForm.get('cicloAnterior').patchValue(this.cicloAnterior.ciclo);
        });
      }
      //Editar - Crear config
      this.createConfigWel(this.interfaceData.data.cicloEvaluacionId);
    } else {
      console.log('trackingStatusForm');
      this.trackingStatusForm();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private trackingStatusForm(): void {
    this.subscription.add(this.cicloEvaRecordForm.statusChanges.subscribe(() => (this.edit = true)));
  }

  private getAllCategorys(): void {
    this.EvaCService.getCategory().subscribe((response) => {
      const { output } = response
      if (output) { //console.log('Catalagos', output);
        this.etapas = output.etapaEvaluacion; //console.log(this.etapas);
        this.procesos = output.procesoEvaluaciones.filter((row: { activo: boolean; }) => row.activo === true);//Filtro activos
        this.instituciones = output.instituciones.filter((row: { activo: boolean; }) => row.activo === true);//Filtro activos
      }
    });
  }

  async submit(): Promise<void> {
    if (this.files && this.data.procesoEvaluacionId) {
      var error = await this.uploadSave();
      if (error){
        return;
      }
      var error2 = await this.uploadSaveFPM();
      if (error2){
        return;
      }
    }
    // setTimeout(async () => {
      console.log('UploadFILE-Editar:', this.uploadFile);
      console.log('UploadFILE-FPM-Editar:', this.uploadFileFpm);
      const uploadFileId = (this.data.bienvenidaArchivoId && this.delFile == false) ? this.data.bienvenidaArchivoId : (this.files && this.data.procesoEvaluacionId && this.uploadFile) ? this.uploadFile.id : null;
      if (uploadFileId == null) { console.log(uploadFileId, "No se ha generado uploadFileId."); }
      const uploadFileFpmId = (this.data.fpmArchivoId && this.delFile == false) ? this.data.fpmArchivoId : (this.filesFpm && this.data.procesoEvaluacionId && this.uploadFileFpm) ? this.uploadFileFpm.id : null;
      if (uploadFileFpmId == null) { console.log(uploadFileFpmId, "No se ha generado uploadFileFpmId."); }
      //const uploadFileId = (this.data.bienvenidaArchivoId)?this.data.bienvenidaArchivoId:(this.files)?this.uploadFile.id:null;
      this.cicloEvaRecordForm.markAllAsTouched();
      /*if (this.cicloEvaRecordForm.invalid) {
        console.log('this.cicloEvaRecordForm.invalid:',this.cicloEvaRecordForm.invalid);
        this.basicNotification.notif("warning", "Verifique que los campos sean correctos");
        return;
      }*/
      //clearForm(this.cicloEvaRecordForm);
      const form = this.cicloEvaRecordForm.getRawValue();
      const model: CycleEvaDTOV1 = new CycleEvaDTOV1();
      const idUser = JSON.parse(localStorage.getItem('session'));
      const Id = form.institucionId;
      const getIns = this.instituciones.filter((row: { id: number; }) => row.id === Id);
      const { clave, nombre } = getIns[0]; //console.log(clave, nombre);
      //Default
      model.cicloEvaluacion = form.cicloEvaluacion;
      model.procesoEvaluacionId = form.procesoEvaluacionId;
      model.institucionId = form.institucionId;
      model.claveInstitucion = clave;
      model.institucion = nombre;
      model.anio = form.anio;
      model.ciclo = form.ciclo;
      model.fechaInicio = DateHelper.convertToStringYYMMD(form.fechaInicioE1R);
      model.fechaFin = DateHelper.convertToStringYYMMD(form.fechaFinE8R);
      if (form.imagenCiclo && form.imagenCiclo.length > 0) {
        console.log(form.imagenCiclo);
        for (const item of form.imagenCiclo) {
          const base64 = await this.convertFileToBase64(item);
          // Asignar valores al modelo
          model.fileBase64String = base64
          model.nombreFormato = item.name;
          model.nombreArchivo = form.nombreArchivo ? form.nombreArchivo : item.name;
        }
      }
      if (form.formatoCiclo && form.formatoCiclo.length > 0) {
        console.log(form.formatoCiclo);
        for (const item of form.formatoCiclo) {
          const base64 = await this.convertFileToBase64(item);
          // Asignar valores al modelo
          model.fileBase64FpmString = base64
          model.nombreFmp = form.nombreArchivoFpm ? form.nombreArchivoFpm : item.name;
        }
      }
      model.cicloAnteriorId = form.cicloAnteriorId;//Agregado
      if (this.data.procesoEvaluacionId) {
        model.cicloEvaluacionId = this.data.cicloEvaluacionId;
        model.procesoEvaluacion = this.data.procesoEvaluacion;
        model.totalIndicadores = this.data.totalIndicadores;
        model.activo = this.estatusRecord;
        model.fechaCreacion = this.data.fechaCreacion;
        model.usuarioCreacion = this.data.usuarioCreacion;
        model.fechaModificacion = new Date();
        model.usuarioModificacion = idUser.id;
        model.bienvenidaArchivoId = uploadFileId;//Nuevo
        model.fpmArchivoId = uploadFileFpmId;

        //Agregar etapaEvaluacion
        const etapaEvaluacion = [];
        const n = this.etapas.length;
        for (let i = 1; i <= n; i++) {
          const getEtapas = this.etapas.filter((row: { etapaId: number; }) => row.etapaId === i);
          const { claveEtapa, etapa, etapaId } = getEtapas[0];
          const fechaInicio = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE6R').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE' + i + 'R').value);
          const fechaFin = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE6R').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE' + i + 'R').value);
          const fechaInicioExt = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE6E').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE' + i + 'E').value);
          const fechaFinExt = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE6E').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE' + i + 'E').value);
          etapaEvaluacion.push({
            activo: true,
            cicloEvaluacionId: this.data.cicloEvaluacionId,
            etapaId,
            etapa,
            claveEtapa,
            fechaInicio,
            fechaFin,
            fechaInicioExt,
            fechaFinExt,
            fechaCreacion: this.data.fechaCreacion,
            usuarioCreacion: this.data.usuarioCreacion,
            fechaModificacion: new Date(),
            usuarioModificacion: idUser.id
          });
        }//console.log('etapaEvaluacion',etapaEvaluacion);
        model.etapaEvaluacion = etapaEvaluacion;
        console.log('model', model);
        this.EvaCService.updateEvaluacionCycle(model).subscribe((response) => {
          if (response.exito) {
            console.log('EDITADO');
            if (this.path > 0) {
              const id: any = response.output;
              this.EvaCService.getEvaluacionCycleById(id).subscribe((response) => {
                if (response.exito) { //console.log('RES-EDITADO',response.output);
                  this.reloadDetail(response.output);
                } else { localStorage.setItem('editCicloStatus', 'error'); }
              });
              this.ref.close(true);
            } else {
              this.basicNotification.notif("success", 'Ciclo de Evaluación actualizado correctamente');
              this.ref.close(true);
            }
          } else {
            if (this.path == 0) {
              this.basicNotification.notif("error", 'Ciclo de Evaluación No se actualizo correctamente');
            }
          }
        });
      } else {
        model.cicloEvaluacionId = 0;
        //model.procesoEvaluacion = null;
        //model.totalIndicadores = 0;
        model.activo = this.estatusRecord;
        model.fechaCreacion = new Date();
        model.usuarioCreacion = idUser.id;
        model.fechaModificacion = null;
        model.usuarioModificacion = 0;
        //Agregar etapaEvaluacion
        const etapaEvaluacion = [];
        const n = this.etapas.length;
        for (let i = 1; i <= n; i++) {
          const getEtapas = this.etapas.filter((row: { etapaId: number; }) => row.etapaId === i);
          const { claveEtapa, etapa, etapaId } = getEtapas[0];
          const fechaInicio = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE6R').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE' + i + 'R').value);
          const fechaFin = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE6R').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE' + i + 'R').value);
          const fechaInicioExt = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE6E').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaInicioE' + i + 'E').value);
          const fechaFinExt = (i == 9) ? DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE6E').value) : DateHelper.convertToStringYYMMD(this.cicloEvaRecordForm.get('fechaFinE' + i + 'E').value);
          etapaEvaluacion.push({
            activo: true,
            cicloEvaluacionId: 0,
            etapaId,
            etapa,
            claveEtapa,
            fechaInicio,
            fechaFin,
            fechaInicioExt,
            fechaFinExt,
            fechaCreacion: new Date(),
            usuarioCreacion: idUser.id,
            fechaModificacion: null,
            usuarioModificacion: 0
          });
        }//console.log('etapaEvaluacion',etapaEvaluacion);
        model.etapaEvaluacion = etapaEvaluacion;
        console.log('model', model);
        this.EvaCService.createEvaluacionCycleAll(model).subscribe((response) => {
          if (response.exito) {
            console.log('CREADO', response);
            const { id } = response; console.log('ciclo-Id:', id);
            this.getCicloId(id);
            //this.basicNotification.notif("success", 'Ciclo de Evaluación guardado correctamente');
            //this.ref.close(true);
          } else {
            this.basicNotification.notif("error", 'Ciclo de evaluación No se guardado correctamente');
          }
        });
      }
    // }, 1200);
  }

  getCicloId(Id: number) {
    this.EvaCService.getEvaluacionCycleById(Id).subscribe((response) => {
      if (response.exito) {
        console.log(response.output);
        this.redirectDetail(response.output);
      } else {
        this.basicNotification.notif("error", 'Ciclo de evaluación No se guardado correctamente');
      }
    });
  }

  redirectDetail(data: any): void {
    const urlRedirect = "/evaluation-generation";
    this.setPermisosHeredados(urlRedirect)
    localStorage.setItem('cicloEva', JSON.stringify(data));
    localStorage.setItem('newCiclo', JSON.stringify(true));
    setTimeout(() => {
      window.location.assign(urlRedirect);
    }, 300);
  }

  setPermisosHeredados(urlRedirect: string) {
    var permiso = new PermisosHeredadosDTO();
    permiso.vistaPadre = this.router.url;
    permiso.vistaHijo = urlRedirect;

    var permisosHeredados: PermisosHeredadosDTO[] = JSON.parse(localStorage.getItem('permisosHeredados'));
    if (permisosHeredados == null) {
      permisosHeredados = [];
      permisosHeredados.push(permiso);
    } else {
      var permisoFind = permisosHeredados.find(p => p.vistaHijo == urlRedirect)
      if (permisoFind == null) {
        permisosHeredados.push(permiso);
      }
    }
    localStorage.setItem('permisosHeredados', JSON.stringify(permisosHeredados));
  }

  reloadDetail(data: any): void {
    const urlRedirect = "/evaluation-generation";
    this.setPermisosHeredados(urlRedirect)

    localStorage.setItem('cicloEva', JSON.stringify(data));
    localStorage.setItem('editCicloStatus', 'success');
    window.location.assign(urlRedirect);
  }

  closeModalByConfimation(): void {
    Alert.confirm('Alerta', '¿Está seguro de que desea salir? Los datos ingresados no serán guardados.').subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      this.ref.close(result);
    });
  }

  changeStatusDescription($event: any): void {
    const estatusRecord: boolean = $event.checked;
    this.estatusRecord = estatusRecord;
    this.estatus = estatusRecord ? "Activo" : "Inactivo";
  }

  searchList(id: number, lista: any) {
    return lista.filter((row: { id: number; }) => row.id === id);
  }

  etapasArr(data: any[]) {
    for (let i = 0; i < data.length; i++) {
      const { fechaInicio, fechaFin, fechaInicioExt, fechaFinExt } = data[i];
      if (fechaInicio != '0001-01-01' && fechaInicio != null) {
        this.cicloEvaRecordForm.get('fechaInicioE' + (i + 1) + 'R').setValue(fechaInicio);
      }
      if (fechaFin != '0001-01-01' && fechaFin != null) {
        this.cicloEvaRecordForm.get('fechaFinE' + (i + 1) + 'R').setValue(fechaFin);
      }
      if (fechaInicioExt != '0001-01-01' && fechaInicioExt != null) {
        this.cicloEvaRecordForm.get('fechaInicioE' + (i + 1) + 'E').setValue(fechaInicioExt);
      }
      if (fechaInicioExt != '0001-01-01' && fechaFinExt != null) {
        this.cicloEvaRecordForm.get('fechaFinE' + (i + 1) + 'E').setValue(fechaFinExt);
      }
    }
  }

  getEtapas(data: { etapaEvaluacion: any[]; }) {
    const fechasEtapas: FechasEtapas = {};
    data.etapaEvaluacion.forEach((etapa, index) => {
      fechasEtapas[`fechaInicioE${index + 1}R`] = etapa.fechaInicio;
      fechasEtapas[`fechaFinE${index + 1}R`] = etapa.fechaFin;
      fechasEtapas[`fechaInicioE${index + 1}E`] = etapa.fechaInicioExt;
      fechasEtapas[`fechaFinE${index + 1}E`] = etapa.fechaFinExt;
    }); //console.log(fechasEtapas);
    const data2 = { ...data, ...fechasEtapas };
    return data2;
  }

  resetFinE(etapa: number) {
    if (etapa == 1) {
      //E1
      this.cicloEvaRecordForm.get('fechaInicioE1E').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE1E').setValue(null);
      //E2
      this.cicloEvaRecordForm.get('fechaInicioE2R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE2R').setValue(null);
      this.Etapa1ErrorE = this.Etapa2Error = false;
    }
    if (etapa >= 1 && etapa <= 2) {
      //E3
      this.cicloEvaRecordForm.get('fechaInicioE3R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE3R').setValue(null);
      this.Etapa3Error = false;
    }
    if (etapa >= 1 && etapa <= 3) {
      //E3
      this.cicloEvaRecordForm.get('fechaInicioE3E').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE3E').setValue(null);
      //E4
      this.cicloEvaRecordForm.get('fechaInicioE4R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE4R').setValue(null);
      this.Etapa3ErrorE = this.Etapa4Error = false;
    }
    if (etapa >= 1 && etapa <= 4) {
      //E5
      this.cicloEvaRecordForm.get('fechaInicioE5R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE5R').setValue(null);
      this.Etapa5Error = false;
    }
    if (etapa >= 1 && etapa <= 5) {
      //E6
      this.cicloEvaRecordForm.get('fechaInicioE6R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE6R').setValue(null);
      this.Etapa6Error = false;
    }
    if (etapa >= 1 && etapa <= 6) {
      //E6
      this.cicloEvaRecordForm.get('fechaInicioE6E').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE6E').setValue(null);
      //E7
      this.cicloEvaRecordForm.get('fechaInicioE7R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE7R').setValue(null);
      this.Etapa6ErrorE = this.Etapa7Error = false;
      this.cicloEvaRecordForm.get('fechaInicioE8R').enable();
      this.cicloEvaRecordForm.get('fechaFinE8R').enable();
    }
    if (etapa >= 1 && etapa <= 7) {
      //E7
      this.cicloEvaRecordForm.get('fechaInicioE7E').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE7E').setValue(null);
      //E8
      //this.cicloEvaRecordForm.get('fechaInicioE8R').setValue(null);
      this.cicloEvaRecordForm.get('fechaFinE8R').setValue(null);
      this.Etapa7ErrorE = this.Etapa8Error = false;
    }
  }

  disabledDate() {
    validationCycle.disabledDate(this.cicloEvaRecordForm);
    this.edit = false;
  }

  fechaActual() {
    let date = new Date();
    let day = date.getDate();
    let dd = (day < 10) ? `0${day}` : day;
    let month = date.getMonth() + 1;
    let mm = (month < 10) ? `0${month}` : month;
    let yy = date.getFullYear();
    let fecha = `${yy}-${mm}-${dd}`;
    return fecha;
  }

  private getConfigWelcome(Id: any): void {
    let filters = new TablePaginatorSearch();
    filters.filter = {
      cicloEvaluacionId: Id
    };
    filters.pageSize = 0;
    filters.pageNumber = 0;
    this.settingsWelcomeService.getAllConfigPantallaBienvenida(filters).subscribe((response) => {
      if (response.output) {
        const data = new SettingsWelcomeDTO().deserialize(response.output[0]); //console.log(data);
        this.wId = data.id; console.log('this.wId', this.wId);
      }
    });
  }

  createConfigWel(Id: any) {
    console.log('Ciclo:', Id);
    this.getConfigWelcome(Id);
    setTimeout(() => {
      console.log('WID', this.wId);
      if (!this.wId) {
        console.log('Crear Configuracion');
        const idUser = JSON.parse(localStorage.getItem('session'));
        const setting: SettingsWelcomeDTO1 = new SettingsWelcomeDTO1();
        setting.id = 0;
        setting.html = '';
        setting.activo = true;
        setting.fechaCreacion = new Date();
        setting.usuarioCreacion = idUser.id;
        //setting.fechaModificacion = new Date();
        setting.usuarioModificacion = 0;
        setting.cicloEvaluacionId = Id;
        //console.log(setting);
        this.settingsWelcomeService.createPantallaBienvenida(setting).subscribe((response) => {
          if (response.exito) {
            const data: any = response.output; //console.log(data);
            console.warn('Configuración de Bienvenida creada correctamente');//this.basicNotification.notif("success", 'Configuración de Bienvenida creada correctamente');
            this.getConfigWelcome(Id);
          } else {
            console.warn('Hubo un error');
            this.basicNotification.notif("error", 'Hubo un error');
            //RELOAD window.location.assign("/ciclo-evaluacion");
          }
        });
      }
    }, 1000);
  }

  public fileValidation(files: File[]): void {
    this.files = files; console.log('this.files', this.files);
    this.edit = (this.files) ? true : false;
    const imageExtensions = ['jpg', 'jpeg', 'png']; // Agrega aquí más extensiones
    const fileExtension = (this.files.length > 0) ? this.files[0].name.split('.').pop()?.toLowerCase() : 'png';
    if (this.files.length > 0) {
      if (fileExtension && imageExtensions.includes(fileExtension)) {
        console.log('Formato aceptado', fileExtension);
        this.errorFile1 = false;
        this.errFile = this.files[0].name.includes('ñ') ? 'Formato nombre No aceptado' : null;
      } else {
        this.errFile = 'Formato *.' + fileExtension + ' No aceptado';
        this.errorFile1 = true;
        this.edit = false;
        console.log("edit1 " +  this.edit)
        this.edit = false;
        return;
      }
      this.files.forEach(async (item) => {
        if (item.size >= LIMIT_BLOB_SIZE_CE) {
          this.errFile = 'El archivo' + item.name + ' no debe sobrepasar los ' + LIMIT_SIZE_CE + ' MB';
          this.errorFile1 = true;
          this.edit = false;
          return;
        }
      });
      this.errName(this.files[0]);
    }
  }

  public fileValidationFormat(files: File[]): void {
    this.filesFpm = files; console.log('this.files', this.filesFpm);
    this.edit = (this.filesFpm) ? true : false;
    const imageExtensions = ['jpg', 'jpeg', 'png','pdf','docx', 'xlsx', 'pptx', 'txt']; // Agrega aquí más extensiones de imagen si es necesario
    const fileExtension = (this.filesFpm.length > 0) ? this.filesFpm[0].name.split('.').pop()?.toLowerCase() : 'pdf';
    if (this.filesFpm.length > 0) {
      this.filesFpm.forEach(async (item) => {
        if (fileExtension && imageExtensions.includes(fileExtension)) {
          this.errorFile2 = false;
          console.log('Formato aceptado', fileExtension);
          this.errFileFpm = this.filesFpm[0].name.includes('ñ') ? 'Formato nombre No aceptado' : null;
        } else {
          this.errFileFpm = 'Formato *.' + fileExtension + ' No aceptado';
          this.errorFile2 = true;
          this.edit = false;
          return;
        }
        if (item.size >= LIMIT_BLOB_SIZE_FILE) {
          this.errFileFpm = 'El archivo' + item.name + ' no debe sobrepasar los ' + LIMIT_SIZE_FILE + ' MB';
          this.errorFile2 = true;
          this.edit = false;
          return;
        }
      });
      this.errName(this.filesFpm[0]);
    }
  }

  async uploadSave(): Promise<boolean> {
    this.archivos = [];
    for (const item of this.files) {
    // this.files.forEach(async (item) => {
     
      if (item.size >= LIMIT_BLOB_SIZE_FILE) {
        this.basicNotification.notif("error", 'El archivo' + item.name + ' no debe sobrepasar los 20 mb');
        return true;
    
    }
      const formData: FormData = new FormData();
      formData.append('file', item, item.name);
      formData.append('usuarioCreacion', `${this.users.userSession.id}`);
      formData.append('bienvenidaId', `${this.wId}`);
      formData.append('icono', `${this.edit}`);
      this.archivos.push(formData);
      for (let item of this.archivos) {
        const res = await this.settingsWelcomeService.uploadAzureStorageFile(item);
        this.uploadFile = res.output; console.log('UploadFILE:', this.uploadFile);
      }
      console.log("success", 'Tu archivo se ha subido correctamente.');
      //this.basicNotification.notif("success", 'Tu archivo se ha subido correctamente.');
      //this.errName(item);
    }
    return false;
  }

  async uploadSaveFPM(): Promise<boolean> {
    this.archivos = [];
    for (const item of this.filesFpm) {
      this.fileValidation(item);
      if (item.size >= LIMIT_BLOB_SIZE_FILE) {
        this.basicNotification.notif("error", 'El archivo ' + item.name + ' no debe sobrepasar los 20 mb');
        return true;
    
    }
    // this.filesFpm.forEach(async (item) => {
      const formData: FormData = new FormData();
      formData.append('file', item, item.name);
      formData.append('usuarioCreacion', `${this.users.userSession.id}`);
      formData.append('cicloId', `${this.interfaceData.data.cicloEvaluacionId}`);
      this.archivos.push(formData);
      
      for (const item of this.archivos) {
        const res = await this.settingsWelcomeService.uploadAzureStorageFileFPM(item);
        this.uploadFileFpm = res.output; console.log('UploadFILE-FPM:', this.uploadFileFpm);
      }
      console.log("success", 'Tu archivo se ha subido correctamente.');
      //this.basicNotification.notif("success", 'Tu archivo se ha subido correctamente.');
      //this.errName(item);
    }
    return false;
  }

  errName(data: any) {
    if (data.name.includes('ñ')) {
      let msj = 'El nombre de su archivo no debe contener acentos o letra eñe, los caracteres especiales permitidos son "." "_" "-"';
      console.warn(msj);
      this.basicNotification.notif("error", msj, 5000);
      //setTimeout(() => {this.deleteFile(this.files);}, 5000);
      return;
    }
  }

  async deleteFile(file: any): Promise<void> {
    console.log(file);
    this.delFile = true;
    const resp = await this.settingsWelcomeService.deleteAzureStorageFile(file); console.log(resp);
    if(resp.exito){
      this.data.nombreArchivo = null;
      this.edit = true;
      this.errorFile1 = false;
      this.errorFile2 = false;
      console.log('La imagen ha sido eliminada.');
      //this.basicNotification.notif("success", 'La imagen ha sido eliminada.');  
    }else{console.log('La imagen No ha sido eliminada.');}
  }

  async deleteFileFpm(Id: any): Promise<void> {
    console.log(Id);
    this.delFileFpm = true;
    const resp = await this.settingsWelcomeService.deleteAzureStorageFileFPM(Id); console.log(resp);
    if(resp.exito){
      this.data.nombreArchivoFpm = null;
      this.data.fpmArchivoId = null;
      this.edit = true;
      this.errorFile1 = false;
      this.errorFile2 = false;
      console.log('El archivo ha sido eliminado.');
      //this.basicNotification.notif("success", 'El archivo ha sido eliminado.');  
    }else{console.log('El archivo No ha sido eliminado.');}
  }

  private setPermissions(): void {
    this.permissions = this.thisAccess.getPermissions(
      this.users.userSession.modulos,
      this.users.userSession.vistas,
      this.router.url
    );
  }

  checkPermission(p: number): boolean {
    //todo: revisar seguridad
    return true;
    return this.permissions[p];
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  buscarCicloAnterior(procesoId: any, institucionId: any): void {
    //console.log('Buscar Ciclo Anterior');
    const procesoName = this.procesos.filter((x) => x.id == procesoId);
    const institucionName = this.instituciones.filter((x) => x.id == institucionId);
    let selectAnio = '';
    for (let i = 0; i < this.anios.length; i++) {
      selectAnio += `<option value="${this.anios[i]}">${this.anios[i]}</option>`;
    }
    let selectCiclo = '';
    for (let i = 0; i < this.ciclos.length; i++) {
      selectCiclo += `<option value="${this.ciclos[i]}">${this.ciclos[i]}</option>`;
    }
    const form = `
    <form [formGroup]="busquedaCicloForm" id="busquedaCicloForm">
      <div class="row mx-0 mt-0 mb-2">
          <mat-form-field appearance="outline" class="col-md-6">                        
            <mat-label>Proceso de evaluación</mat-label>
            <input appInputRestriction="APLHA_NUMERIC" matInput class="swal2-input" style="font-size: 14px; height: 50px; margin:0; width:95%;" id="proceso" formControlName="proceso" value="${procesoName[0].nombre}" disabled />
            <input type="hidden" matInput class="swal2-input" style="font-size: 14px; height: 50px; margin:0; width:95%;" id="procesoCeId" formControlName="procesoCeId" value="${procesoId}" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-md-6">                        
            <mat-label>Institución</mat-label>
            <input appInputRestriction="APLHA_NUMERIC" matInput class="swal2-input" style="font-size: 14px; height: 50px; margin:0; width:95%;" id="institucion" formControlName="institucion" value="${institucionName[0].clave}" disabled />
            <input type="hidden" matInput class="swal2-input" style="font-size: 14px; height: 50px; margin:0; width:95%;" id="institucionCeId" formControlName="institucionCeId" value="${institucionId}" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-md-6">
            <div class="form-group">
              <label for="anio" class="form-label" style="font-size:14px;">Año</label>
              <select id="anio" name="anio" class="swal2-input form-select" required>
                <option value="null">Selecciona</option>
                ${selectAnio}
              </select>
            </div>        
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-md-6">
            <div class="form-group">
              <label for="ciclo" class="form-label" style="font-size:14px;">Ciclo</label>
              <select id="ciclo" name="ciclo" class="swal2-input form-select" required>
                <option value="null">Selecciona</option>
                ${selectCiclo}
              </select>
            </div>        
          </mat-form-field>
        <div class="col-md-6">
          <input type="hidden" matInput class="swal2-input" style="font-size: 14px; height: 50px; margin:0; width:95%;" id="cId" formControlName="cId" />
        </div>
        <div class="col-md-6">
          <input type="hidden" matInput class="swal2-input" style="font-size: 14px; height: 50px; margin:0; width:95%;" id="cName" formControlName="cName" />
        </div>
        <div class="col-md-12 mt-4">
          <table id="lista" style="width: 99%; box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);"></table>
        </div>
      </div>
    </form>`;
    Alert.formModal('Ciclo anterior', form).subscribe((result) => {
      if (!result || !result.isConfirmed) { return; }
      console.log('Form Values:', result.value);
      const { anio, ciclo, cicloId, cicloName } = result.value;
      this.cicloEvaRecordForm.get('anioAnterior').patchValue(anio);
      this.cicloEvaRecordForm.get('cicloAnterior').patchValue(ciclo);
      this.cicloEvaRecordForm.get('nombreCicloAnterior').patchValue(cicloName);
      this.cicloEvaRecordForm.get('cicloAnteriorId').patchValue(cicloId);
    });
    //
    this.onSelectChange();
  }

  quitarCicloAnterior(){
    this.cicloEvaRecordForm.get('anioAnterior').reset();
      this.cicloEvaRecordForm.get('cicloAnterior').reset();
      this.cicloEvaRecordForm.get('nombreCicloAnterior').reset();
      this.cicloEvaRecordForm.get('cicloAnteriorId').reset();
  }

  onSelectChange() {
    const sel = document.getElementById('ciclo');
    if (sel) {
      sel.addEventListener("change", (e) => {
        const procesoId = document.getElementById('procesoCeId') as HTMLFormElement;
        const institucionId = document.getElementById('institucionCeId') as HTMLFormElement;
        const anio = document.getElementById('anio') as HTMLFormElement;
        const ciclo = document.getElementById('ciclo') as HTMLFormElement;
        let cId = document.getElementById('cId') as HTMLFormElement;
        let cName = document.getElementById('cName') as HTMLFormElement;
        //
        let filters = new TablePaginatorSearch();
        filters.filter = {
          ProcesoEvaluacionId: parseInt(procesoId.value),
          InstitucionId: parseInt(institucionId.value),
          anio: parseInt(anio.value),
          Ciclo: ciclo.value
        }; //console.log(filters);
        this.EvaCService.getLastCE(filters).subscribe((response) => {
          if (response.exito) {
            this.ciclosAnteriores = response.output;
            this.ciclosAnteriores = this.ciclosAnteriores.map(item => ({
              cicloEvaluacionId: item.cicloEvaluacionId,
              cicloEvaluacion: item.cicloEvaluacion
            }));
            console.log(this.ciclosAnteriores);
            const lista = document.getElementById('lista') as HTMLFormElement;
            let content = `<tr style="background-color:#f7c7a8;border-bottom: 1px solid #ccc;">
              <th class="table__header table__cell-name" style="color: #111;font-size: 14px;font-weight: 600;padding: 16px 0px;"></th>
              <th class="table__header table__cell-name" style="color: #111;font-size: 14px;font-weight: 600;padding: 16px 0px;">Nombre del ciclo</th>
            </tr>`;
            if (lista) {
              if(this.ciclosAnteriores.length!=0){
                for (let i = 0; i < this.ciclosAnteriores.length; i++) {
                  content += `<tr style="border-bottom: 1px solid #ccc;">
                    <td class="table__cell table__cell-name" style="padding: 16px 0px;">
                      <label>
                        <input type="radio" name="cicloAnt" id="${this.ciclosAnteriores[i].cicloEvaluacionId}" value="${this.ciclosAnteriores[i].cicloEvaluacion}" />
                      </label>
                    </td>
                    <td class="table__cell table__cell-name" style="padding: 16px 0px;">${this.ciclosAnteriores[i].cicloEvaluacion}</td>
                  </tr>`;
                }
              }else{
                content += `<tr style="border-bottom: 1px solid #ccc;">
                    <td class="table__cell table__cell-name" style="padding: 16px 0px;"></td>
                    <td class="table__cell table__cell-name" style="padding: 16px 0px;">
                      <p class="empty-table mt-4">No hay datos para mostrar</p>
                    </td>
                  </tr>`;
              }
            }
            lista.innerHTML = content;
            setTimeout(() => {
              const lista = document.getElementById('lista') as HTMLFormElement; //console.log(lista);
              lista.addEventListener("change", (e) => {
                const tar: any = e.target;
                cId.value = tar.id;
                cName.value = tar.value;
              });
            }, 200);
          }
        });
      });
    }
  }

}
