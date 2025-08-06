import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared';
//Modelos
import { UsersService } from 'src/app/core/services';//Servicios
//Helpers 

@Component({
    selector: 'app-my-profile',
    imports: [CommonModule, SharedModule],
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
})
export default class MyProfileComponent implements OnInit {
  //VARIABLES TYPESCRIPT
  roles: any;
  data: any[] = [];

  constructor(readonly users: UsersService) { }

  ngOnInit(): void {
    this.roles = this.users.userSession.roles; //console.log(this.roles);
  }

  //METODOS
  close() {
    history.back();//window.location.assign("/welcome");
  }

  //MODAL
  //BOTONES
}
