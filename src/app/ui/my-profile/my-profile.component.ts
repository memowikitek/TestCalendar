import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  procesosRoles: any;
  data: any[] = [];

  constructor(readonly users: UsersService) { }

  ngOnInit(): void {
    this.procesosRoles = this.users.userSession.usuarioProcesoRolPerfil; //console.log(this.procesosRoles);
     this.procesosRoles.forEach((item: { procesoNombre: any; rolNombre: any; }) => {
      const procesoExistente = this.data.find((obj: { procesoNombre: any; }) => obj.procesoNombre === item.procesoNombre);
      if (procesoExistente) {
        procesoExistente.roles.push({nombre: item.rolNombre});
      } else {
        this.data.push({
          procesoNombre: item.procesoNombre,
          roles: [{nombre: item.rolNombre}]
        });
      }
    });//console.log(this.data);
  }

  close(){
    history.back();//window.location.assign("/welcome-cycle");
  }

}
