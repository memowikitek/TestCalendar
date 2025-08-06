import { DateHelper } from "./date-helper";

export class validationCycle {

    static Etapa1Error: boolean = false;
    static Etapa2Error: boolean = false;
    static Etapa3Error: boolean = false;
    static Etapa4Error: boolean = false;
    static Etapa5Error: boolean = false;
    static Etapa6Error: boolean = false;
    static Etapa7Error: boolean = false;
    static Etapa8Error: boolean = false;
    static Etapa8ErrorF: boolean = false;
    static Etapa1ErrorE: boolean = false;
    static Etapa3ErrorE: boolean = false;
    static Etapa6ErrorE: boolean = false;
    static Etapa7ErrorE: boolean = false;

    static validarFechasE2(fechaInicioE2R: Date, recordForm: any) {
        const fechaInicioE1R = recordForm.get('fechaInicioE1R').value;
        /*REGLA ETAPA 2 
        La fecha inicial debe ser igual o mayor a la fecha inicial de captura de metas (Etapa 1). 
        La fecha final debe ser igual a la fecha final de la Revisión de la Autoevaluación.*/
        if (DateHelper.convertToStringYYMMD(fechaInicioE2R) < DateHelper.convertToStringYYMMD(fechaInicioE1R)) {
            this.Etapa2Error = true; // Mostrar el error
            recordForm.get('fechaInicioE3R').disable();
            recordForm.get('fechaFinE3R').disable();
            recordForm.get('fechaInicioE4R').disable();
            recordForm.get('fechaFinE4R').disable();
            recordForm.get('fechaInicioE5R').disable();
            recordForm.get('fechaFinE5R').disable();
            recordForm.get('fechaInicioE6R').disable();
            recordForm.get('fechaFinE6R').disable();
            recordForm.get('fechaInicioE7R').disable();
            recordForm.get('fechaFinE7R').disable();
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
        } else {
            this.Etapa2Error = false; // No mostrar el error
            recordForm.get('fechaInicioE3R').enable();
            recordForm.get('fechaFinE3R').enable();
            recordForm.get('fechaInicioE4R').enable();
            recordForm.get('fechaFinE4R').enable();
            recordForm.get('fechaInicioE5R').enable();
            recordForm.get('fechaFinE5R').enable();
            recordForm.get('fechaInicioE6R').enable();
            recordForm.get('fechaFinE6R').enable();
            recordForm.get('fechaInicioE7R').enable();
            recordForm.get('fechaFinE7R').enable();
            recordForm.get('fechaInicioE8R').enable();
            recordForm.get('fechaFinE8R').enable();
        } //console.log('this.Etapa2Error', this.Etapa2Error);
        return this.Etapa2Error;
    }

    static validarFechasE3(fechaInicioE3R: Date, recordForm: any) {
        const fechaFinE1R = recordForm.get('fechaFinE1R').value;
        /*REGLA ETAPA 3 
        La fecha inicial debe ser mayor a la fecha final de captura de metas (Etapa 1). 
        La fecha final debe ser mayor a la fecha inicial de captura de resultados.*/
        if (DateHelper.convertToStringYYMMD(fechaInicioE3R) <= DateHelper.convertToStringYYMMD(fechaFinE1R)) {
            this.Etapa3Error = true; // Mostrar el error
            recordForm.get('fechaInicioE4R').disable();
            recordForm.get('fechaFinE4R').disable();
            recordForm.get('fechaInicioE5R').disable();
            recordForm.get('fechaFinE5R').disable();
            recordForm.get('fechaInicioE6R').disable();
            recordForm.get('fechaFinE6R').disable();
            recordForm.get('fechaInicioE7R').disable();
            recordForm.get('fechaFinE7R').disable();
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
        } else {
            this.Etapa3Error = false; // No mostrar el error
            recordForm.get('fechaInicioE4R').enable();
            recordForm.get('fechaFinE4R').enable();
            recordForm.get('fechaInicioE5R').enable();
            recordForm.get('fechaFinE5R').enable();
            recordForm.get('fechaInicioE6R').enable();
            recordForm.get('fechaFinE6R').enable();
            recordForm.get('fechaInicioE7R').enable();
            recordForm.get('fechaFinE7R').enable();
            recordForm.get('fechaInicioE8R').enable();
            recordForm.get('fechaFinE8R').enable();
        } //console.log('this.Etapa3Error', this.Etapa3Error);
        return this.Etapa3Error;
    }

    static validarFechasE4(fechaInicioE4R: Date, recordForm: any) {
        const fechaFinE3R = recordForm.get('fechaFinE3R').value;
        /*REGLA ETAPA 4 
        La fecha inicial debe ser mayor a la fecha final de captura de resultados. 
        La fecha final debe ser mayor a la fecha inicial de autoevaluación.*/
        if (DateHelper.convertToStringYYMMD(fechaInicioE4R) <= DateHelper.convertToStringYYMMD(fechaFinE3R)) {
            this.Etapa4Error = true; // Mostrar el error
            recordForm.get('fechaInicioE5R').disable();
            recordForm.get('fechaFinE5R').disable();
            recordForm.get('fechaInicioE6R').disable();
            recordForm.get('fechaFinE6R').disable();
            recordForm.get('fechaInicioE7R').disable();
            recordForm.get('fechaFinE7R').disable();
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
        } else {
            this.Etapa4Error = false; // No mostrar el error
            recordForm.get('fechaInicioE5R').enable();
            recordForm.get('fechaFinE5R').enable();
            recordForm.get('fechaInicioE6R').enable();
            recordForm.get('fechaFinE6R').enable();
            recordForm.get('fechaInicioE7R').enable();
            recordForm.get('fechaFinE7R').enable();
            recordForm.get('fechaInicioE8R').enable();
            recordForm.get('fechaFinE8R').enable();
        } //console.log('this.Etapa4Error', this.Etapa4Error);
        return this.Etapa4Error;
    }

    static validarFechasE5(fechaInicioE5R: Date, recordForm: any) {
        const fechaFinE4R = recordForm.get('fechaFinE4R').value;
        /*REGLA ETAPA 5 
        La fecha inicial debe ser mayor a la fecha final de Autoevaluación. 
        La fecha final debe ser mayor a la fecha inicial de revisión de autoevaluación.*/
        if (DateHelper.convertToStringYYMMD(fechaInicioE5R) <= DateHelper.convertToStringYYMMD(fechaFinE4R)) {
            this.Etapa5Error = true; // Mostrar el error
            recordForm.get('fechaInicioE6R').disable();
            recordForm.get('fechaFinE6R').disable();
            recordForm.get('fechaInicioE7R').disable();
            recordForm.get('fechaFinE7R').disable();
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
        } else {
            this.Etapa5Error = false; // No mostrar el error
            recordForm.get('fechaInicioE6R').enable();
            recordForm.get('fechaFinE6R').enable();
            recordForm.get('fechaInicioE7R').enable();
            recordForm.get('fechaFinE7R').enable();
            recordForm.get('fechaInicioE8R').enable();
            recordForm.get('fechaFinE8R').enable();
        } //console.log('this.Etapa5Error', this.Etapa5Error);
        return this.Etapa5Error;
    }

    static validarFechasE6(fechaInicioE6R: Date, recordForm: any) {
        const fechaFinE5R = recordForm.get('fechaFinE5R').value;
        /*REGLA ETAPA 6 - 6 
        La fecha inicial debe ser mayor a la fecha final de la Revisión de la Autoevaluación. 
        La fecha final debe ser mayor a la fecha inicial del plan de mejora (Diseño).*/
        if (DateHelper.convertToStringYYMMD(fechaInicioE6R) <= DateHelper.convertToStringYYMMD(fechaFinE5R)) {
            this.Etapa6Error = true; // Mostrar el error
            recordForm.get('fechaInicioE7R').disable();
            recordForm.get('fechaFinE7R').disable();
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
        } else {
            this.Etapa6Error = false; // No mostrar el error
            recordForm.get('fechaInicioE7R').enable();
            recordForm.get('fechaFinE7R').enable();
            recordForm.get('fechaInicioE8R').enable();
            recordForm.get('fechaFinE8R').enable();
        } //console.log('this.Etapa6Error', this.Etapa6Error);
        return this.Etapa6Error;
    }

    static validarFechasE7(fechaInicioE7R: Date, recordForm: any) {
        const fechaFinE6R = recordForm.get('fechaFinE6R').value;
        /*REGLA ETAPA 7 - 6 
        La fecha inicial debe ser mayor a la fecha final del Plan de mejora (Diseño). 
        La fecha final debe ser mayor a la fecha inicial de plan de mejora (Ejecución).*/
        if (DateHelper.convertToStringYYMMD(fechaInicioE7R) <= DateHelper.convertToStringYYMMD(fechaFinE6R)) {
            this.Etapa7Error = true; // Mostrar el error
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
        } else {
            this.Etapa7Error = false; // No mostrar el error
            recordForm.get('fechaInicioE8R').enable();
            recordForm.get('fechaFinE8R').enable();
        } //console.log('this.Etapa7Error', this.Etapa7Error);
        return this.Etapa7Error;
    }
    static validarFechasE8(fechaFinE8R: Date, recordForm: any) {
        const fechaInicioE1R = recordForm.get('fechaInicioE1R').value;
        /*REGLA ETAPA 8 - 7 
        La fecha inicial debe ser igual o mayor a la fecha de la captura de metas. 
        **La fecha fin queda abierta, pero debe ser mayor a la fecha final de plan de mejora (Ejecución).*/
        if (DateHelper.convertToStringYYMMD(fechaFinE8R) < DateHelper.convertToStringYYMMD(fechaInicioE1R)) {
            this.Etapa8Error = true; // Mostrar el error
        }else{
            this.Etapa8Error = false; // No mostrar el error
        }
        return this.Etapa8Error;
    }
    //FECHAS FIN
    static validarFechasE8F(fechaFinE8R: Date, recordForm: any) {
        const fechaFinE7R = recordForm.get('fechaFinE7R').value;
        /*REGLA ETAPA 8 - 7 
        La fecha inicial debe ser igual o mayor a la fecha de la captura de metas. 
        **La fecha fin queda abierta, pero debe ser mayor a la fecha final de plan de mejora (Ejecución).*/
        if (DateHelper.convertToStringYYMMD(fechaFinE8R) <= DateHelper.convertToStringYYMMD(fechaFinE7R)) {
            this.Etapa8ErrorF = true; // Mostrar el error
        }else{
            this.Etapa8ErrorF = false; // No mostrar el error
        }
        return this.Etapa8ErrorF;
    }


    static validarFechasE1E(fechaInicioE1E: Date, recordForm: any) {
        const fechaFinE1R = recordForm.get('fechaFinE1R').value;
        if (DateHelper.convertToStringYYMMD(fechaInicioE1E) <= DateHelper.convertToStringYYMMD(fechaFinE1R)) {
            this.Etapa1ErrorE = true;
        }else{
            this.Etapa1ErrorE = false;
        }
        return this.Etapa1ErrorE;
    }

    static validarFechasE3E(fechaInicioE3E: Date, recordForm: any) {
        const fechaFinE3R = recordForm.get('fechaFinE3R').value;
        if (DateHelper.convertToStringYYMMD(fechaInicioE3E) <= DateHelper.convertToStringYYMMD(fechaFinE3R)) {
            this.Etapa3ErrorE = true;
        }else{
            this.Etapa3ErrorE = false;
        }
        return this.Etapa3ErrorE;
    }

    static validarFechasE6E(fechaInicioE6E: Date, recordForm: any) {
        const fechaFinE6R = recordForm.get('fechaFinE6R').value;
        if (DateHelper.convertToStringYYMMD(fechaInicioE6E) <= DateHelper.convertToStringYYMMD(fechaFinE6R)) {
            this.Etapa3ErrorE = true;
        }else{
            this.Etapa3ErrorE = false;
        }
        return this.Etapa3ErrorE;
    }

    static validarFechasE7E(fechaInicioE7E: Date, recordForm: any) {
        const fechaFinE7R = recordForm.get('fechaFinE7R').value;
        if (DateHelper.convertToStringYYMMD(fechaInicioE7E) <= DateHelper.convertToStringYYMMD(fechaFinE7R)) {
            this.Etapa3ErrorE = true;
        }else{
            this.Etapa3ErrorE = false;
        }
        return this.Etapa3ErrorE;
    }

    static disabledDate(recordForm: any){
            recordForm.get('fechaInicioE1R').disable();
            recordForm.get('fechaFinE1R').disable();
            recordForm.get('fechaInicioE2R').disable();
            recordForm.get('fechaFinE2R').disable();
            recordForm.get('fechaInicioE3R').disable();
            recordForm.get('fechaFinE3R').disable();
            recordForm.get('fechaInicioE4R').disable();
            recordForm.get('fechaFinE4R').disable();
            recordForm.get('fechaInicioE5R').disable();
            recordForm.get('fechaFinE5R').disable();
            recordForm.get('fechaInicioE6R').disable();
            recordForm.get('fechaFinE6R').disable();
            recordForm.get('fechaInicioE7R').disable();
            recordForm.get('fechaFinE7R').disable();
            recordForm.get('fechaInicioE8R').disable();
            recordForm.get('fechaFinE8R').disable();
    }

    static fechaActual() {
        let date = new Date();
        let day = date.getDate();
        let dd = (day < 10) ? `0${day}` : day;
        let month = date.getMonth() + 1;
        let mm = (month < 10) ? `0${month}` : month;
        let yy = date.getFullYear();
        let fecha = `${yy}-${mm}-${dd}`;
        return fecha;
      }
}