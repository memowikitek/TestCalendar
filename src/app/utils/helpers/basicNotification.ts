import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { from, Observable } from 'rxjs';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';


@Injectable({
    providedIn: 'root',
})
export class BasicNotification {
    

  constructor( private notification: NzNotificationService,){}

   notif(types: string, message: string, durationMessage = 3000) {
    
    this.notification.create(
        types,
        '',
        message,
        { 
          nzDuration: durationMessage,
          nzStyle: {
            top: '40px',
            right: '-24px',
            width: '480px',
            padding: '5px 24px 5px 0px',
            //background: this.typeArray[0][type].background
          },
          nzClass: 'noti-'+types
        }
      )

  }


}
