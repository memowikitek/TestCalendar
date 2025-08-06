import { from, Observable } from 'rxjs';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

export interface AlertExtendedConfig extends AlertConfig {
  icon: SweetAlertIcon;
}

export interface AlertConfig {
  acceptText?: string;
  cancelText?: string;
  isHTML?: boolean;
  time?: number | null;
  showConfirmButton?: boolean;
}

export class Alert {
  private static CANCEL_TEXT = 'CANCELAR';
  private static ACCEPT_TEXT = 'ACEPTAR';

  static success(
    message: string,
    title: string = 'Guardado correctamente',
    config?: AlertConfig
  ): Observable<SweetAlertResult> {
    return Alert.alert(title, message || '', {
      icon: 'success',
      acceptText: config ? config.acceptText || '' : '',
      cancelText: config ? config.cancelText || '' : '',
      isHTML: config ? config.isHTML || false : false,
      time: config ? config.time || null : null,
      showConfirmButton: config ? config.showConfirmButton : false,
    });
  }

  static error(message: string, title: string = 'Error', config?: AlertConfig): Observable<SweetAlertResult> {
    return Alert.alert(title, message || '', {
      icon: 'error',
      acceptText: config ? config.acceptText || '' : '',
      cancelText: config ? config.cancelText || '' : '',
      isHTML: config ? config.isHTML || false : false,
      time: config ? config.time || null : null,
      showConfirmButton: config ? config.showConfirmButton : false,
    });
  }

  static warn(message: string, title: string = 'Advertencia', config?: AlertConfig): Observable<SweetAlertResult> {
    return Alert.alert(title, message || '', {
      icon: 'warning',
      acceptText: config ? config.acceptText || '' : '',
      cancelText: config ? config.cancelText || '' : '',
      isHTML: config ? config.isHTML || false : false,
      time: config ? config.time || null : null,
      showConfirmButton: config ? config.showConfirmButton : false,
    });
  }

  static info(message: string, title: string = 'Información', config?: AlertConfig): Observable<SweetAlertResult> {
    return Alert.alert(title, message || '', {
      icon: 'info',
      acceptText: config ? config.acceptText || '' : '',
      cancelText: config ? config.cancelText || '' : '',
      isHTML: config ? config.isHTML || false : false,
      time: config ? config.time || null : null,
      showConfirmButton: config ? config.showConfirmButton : false,
    });
  }

  static confirm(title: string, message?: string, config?: AlertExtendedConfig): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        heightAuto: false,
        title,
        text: message || '',
        icon: config ? config.icon || 'warning' : 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F15A22',
        /* cancelButtonColor: '#F1C40F',
        customClass: { cancelButton: 'alert__btn-cancel' }, */
        confirmButtonText: config ? config.acceptText || Alert.ACCEPT_TEXT : Alert.ACCEPT_TEXT,
        cancelButtonText: config ? config.cancelText || Alert.CANCEL_TEXT : Alert.CANCEL_TEXT,
      })
    );
  }

  static confirmSession(title: string, message?: string, config?: AlertExtendedConfig): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        heightAuto: false,
        title,
        text: '',
        html: message ,
        icon: config ? config.icon || 'warning' : 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F15A22',
        /* cancelButtonColor: '#F1C40F',
        customClass: { cancelButton: 'alert__btn-cancel' }, */
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
      })
    );
  }

  static confirmAreaConsolidada(title: string, message?: string, config?: AlertExtendedConfig): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        heightAuto: false,
        title,
        text: '',
        html: message ,
        icon: config ? config.icon || 'warning' : 'warning',
        showCancelButton: false,
        confirmButtonColor: '#F15A22',
        /* cancelButtonColor: '#F1C40F',
        customClass: { cancelButton: 'alert__btn-cancel' }, */
        confirmButtonText: 'Continuar',
      })
    );
  }

  static confirmEstatusEtapa(title: string, message?: string, config?: AlertExtendedConfig): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        heightAuto: false,
        title,
        text: '',
        html: message ,
        icon: config ? config.icon || 'warning' : 'warning',
        showCancelButton: false,
        confirmButtonColor: '#F15A22',
        /* cancelButtonColor: '#F1C40F',
        customClass: { cancelButton: 'alert__btn-cancel' }, */
        confirmButtonText: 'Continuar',
      })
    );
  }


  static confirmarea(title: string, message?: string, config?: AlertExtendedConfig): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        heightAuto: false,
        title,
        text: '',
        html: message ,
        icon: config ? config.icon || 'warning' : 'warning',
        showCancelButton: false,
        confirmButtonColor: '#F15A22',
        /* cancelButtonColor: '#F1C40F',
        customClass: { cancelButton: 'alert__btn-cancel' }, */
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
      })
    );
  }

  private static alert(title: string, message: string, config: AlertExtendedConfig): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        heightAuto: false,
        icon: config.icon,
        title,
        text: config.isHTML ? '' : message || '',
        html: config.isHTML ? message : '',
        showConfirmButton: config.showConfirmButton || false,
        confirmButtonText: config.acceptText || Alert.ACCEPT_TEXT,
        cancelButtonText: config.cancelText || Alert.CANCEL_TEXT,
        customClass: { cancelButton: 'alert__btn-cancel' },
        timer: config.showConfirmButton ? undefined : config.time !== null ? config.time : 4000,
      })
    );
  }

  static showPreviewModal(title: string, base64: string): void {
    const imageUrl = 'URL_DE_LA_IMAGEN'; // Reemplaza con la URL de la imagen
    const imageHtml = `<img src="${imageUrl}" alt="Vista previa">`; // Crear la etiqueta de imagen HTML

    Swal.fire({
      title: 'Vista previa de la imagen',
      html: imageHtml, // Pasar la etiqueta de imagen como contenido HTML
    });
  }

  static formModal(title: string, Html: string): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: `<h1>${title}</h1>`,
        html: Html,
        showCancelButton: true,
        confirmButtonColor: '#F15A22',
        confirmButtonText: `Guardar`,
        cancelButtonText: `Cancelar`,
        preConfirm: () => {
          const form = document.getElementById('busquedaCicloForm') as HTMLFormElement;
          if (form) {
            const formValues = {
              procesoName: (form.querySelector('#proceso') as HTMLInputElement).value,
              procesoId: (form.querySelector('#procesoCeId') as HTMLInputElement).value,
              institucionName: (form.querySelector('#institucion') as HTMLInputElement).value,
              institucionId: (form.querySelector('#institucionCeId') as HTMLInputElement).value,
              anio: (form.querySelector('#anio') as HTMLInputElement).value,
              ciclo: (form.querySelector('#ciclo') as HTMLInputElement).value,
              cicloId: (form.querySelector('#cId') as HTMLInputElement).value,
              cicloName: (form.querySelector('#cName') as HTMLInputElement).value
            };

            if (formValues.anio == "null" || formValues.ciclo == "null") {
              Swal.showValidationMessage('Ingrese año o ciclo.');
              return false; // Prevent closing the modal
            }
            if(formValues.cicloId=='' && formValues.cicloName==''){
              Swal.showValidationMessage('Seleccione un ciclo de evaluación');
              return false; // Prevent closing the modal
            }
            return formValues;
          }
          return null;
        }
      })
    );
  }


  static modalInfo(title: string, Html: string): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        //icon: 'info',
        title: `<h1>${title}</h1>`,
        html: Html,
        confirmButtonColor: '#F15A22',
        confirmButtonText: `Cerrar`,
      })
    );
  }
}
