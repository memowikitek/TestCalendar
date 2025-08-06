import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services';

@Component({
    selector: 'app-title-graf',
    templateUrl: './title-graf.component.html',
    styleUrls: ['./title-graf.component.scss'],
    standalone: false
})
export class TitleGrafComponent implements OnInit {
  @Input() porcentaje: number;
  @Input() datoEtapa: string;
  @Input() datoDes: string;
  @Input() datoClave: string;
  @Input() datoDesc: string;
  @Input() grafActivo: any;
  @Input() label: any;
  showAvance: boolean = false;
  revIns: any;


  constructor(readonly users: UsersService) { }

  ngOnInit(): void {
    
    this.revIns = JSON.parse(localStorage.getItem("revIns"));
    this.showAvance = !this.revIns && this.users.userSession.tipoRol == 1;//this.users.userSession.tipoRol != 2//this.users.userSession.usuarioDePerfil != 'Área Central';
  }

}
