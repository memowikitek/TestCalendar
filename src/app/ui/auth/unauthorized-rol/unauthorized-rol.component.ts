import { Component, OnInit } from '@angular/core';
import { AuthMsalService } from 'src/app/core/services';
import { LocalStorage } from 'src/app/utils/helpers';

@Component({
    selector: 'app-unauthorized-rol',
    templateUrl: './unauthorized-rol.component.html',
    styleUrls: ['./unauthorized-rol.component.scss'],
    standalone: false
})
export class UnauthorizedRolComponent implements OnInit {
  rol: string;//
  roles: any;//

  constructor(private readonly authMsal: AuthMsalService) { }

  ngOnInit(): void {
    this.roles = localStorage.getItem('process'); //
    if (this.roles) {console.log(this.roles);//
      //const { rol } = JSON.parse(this.roles);//
      //this.rol = rol; console.log(this.rol);//    
    }//
    LocalStorage.clear();
  }

  goToLogin() {
    this.authMsal.logout('/login');
  }
}
