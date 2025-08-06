import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
//import { Noti } from 'src/app/utils/constants/class-styles';

@Component({
    selector: 'app-notification-antd',
    templateUrl: './notification-antd.component.html',
    styleUrls: ['./notification-antd.component.scss'],
    standalone: false
})

export class NotificationAntdComponent implements OnInit {
  @Input() txtBtn?: string;
  @Input() msj?: string;
  @Input() types?: string;
  @Input() bol: boolean;
  testArray: any[] = [
    [ 'access',
      {
        color: '#fff',
        background: '#1FBB71'
      }
    ],
    [ 'info',
      {
        color: '#fff',
        background: '#0d6efd'
      }
    ],
  ];
  
  typeArray: any[] = [
    {
      success:{
        color: '#fff',
        background: '#1FBB71'
       }
    },
    {
      info:{
        color: '#fff',
        background: '#0d6efd'
       }
    },
    {
      warning:{
        color: '#fff',
        background: '#ffc107'
       }
    },
    {
      error:{
        color: '#fff',
        background: '#dc3545'
       }
    }
  ];

  constructor(private notification: NzNotificationService) { }

  createBasicNotification(types: string, msj: string): void {

    this.notification.create(
        types,
        '',
        msj,
        { 
          nzDuration: 3000,
          nzStyle: {
            top: '40px',
            right: '-24px',
            width: '480px',
            padding: '8px 12px',
            //background: this.typeArray[0][type].background
          },
          nzClass: 'noti-'+types
        }
      )
      .onClick.subscribe(() => {
        console.log('notification clicked!');
      });

  }

  ngOnInit(): void {
    
  }

}
