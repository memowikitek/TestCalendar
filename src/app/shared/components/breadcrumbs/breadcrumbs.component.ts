import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import bread from 'src/assets/data/breadcrumbs.json';
import { UsersService } from 'src/app/core/services';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    standalone: false
})
export class BreadcrumbsComponent implements OnInit {
  tipo: any;
  showBread: boolean = false;
  breadJson: any = bread;
  menu1: any;
  menu2: any;
  menu3: any;
  menu4: any;
  url1: any;
  url2: any;
  url3: any;
  url4: any;
  path: any;
  params: any;
  exeption = [
    {url:'/indicator-goals-capture/autoevaluation-review-capture-campusdeparea-detail'},
    {url:'/indicator-goals-capture/improvementplan-autoriza'},
    {url:'indicator-goals-capture/improvement-plandesign-capture-autorization?vw=1'},
    {url:'/indicator-goals-capture/autoevaluation-review-capture'},
    {url:'/indicator-goals-capture/improvementplan-execution-capture?vw=1'}
  ];
  retroE5: any;
  //capturaE6: any;

  constructor(private users: UsersService,private router: Router) { }

  ngOnInit(): void {//console.log(this.breadJson);
    this.tipo = this.users.userSession.tipoRol;
    this.params = window.location.search; //console.log(this.params);
    this.path = window.location.pathname; //const { pathname } = window.location; console.log(pathname);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('URL Cambiada desde el menu:', event.url);
        this.path = event.url;//this.load(this.path);
        this.showBread = false;
        if(this.path == this.exeption[0].url){
          this.showBread = true;
          this.nivel4E5();
          this.etapa5(0);
        }
        if(this.path == this.exeption[1].url){
          this.showBread = true;
          this.nivel4E5();
          this.etapa5(1);
        }
        if(this.path == this.exeption[4].url){
          this.showBread = true;
          this.nivel4E5();
          this.etapa5(4);
        }
      }
    });
    this.load(this.path);
  }

  load(pathname: any) {
    //Creamos la instancia
    //const urlParams = new URLSearchParams(this.params);
    //let vw = urlParams.get('vw'); console.log('vw:',vw);
    for (let i = 0; i < this.breadJson.length; i++) {
      const { pantalla, nivel1, url1, nivel2, url2, nivel3, url3 } = this.breadJson[i];
      const { indi1, indi2 } = this.breadJson[0].urlIndicadores;
      const newPathname = pathname + this.params;
      //this.showBread = pantalla == newPathname; console.log('this.showBread',this.showBread);
      if (pantalla == newPathname) {//console.log((pantalla + ' = ' + newPathname)); //console.log(this.breadJson[i]);
        //Actualización para mis-revisiones-institucionales
        const urlMisRev = '/mis-revisiones-institucionales';
        const urlMisEva = '/mis-evaluaciones';
        (newPathname.includes(urlMisRev)) ? localStorage.setItem("revIns", JSON.stringify(true)) : (newPathname.includes(urlMisEva)) ? localStorage.setItem("revIns", JSON.stringify(false)) : null;
        const revIns = (((i > 0 && i <= 9) && pantalla == newPathname) || (newPathname.includes(urlMisRev))) ? JSON.parse(localStorage.getItem("revIns")) : false;
        console.log('Rev', revIns);
        // Mostrar Breadcrumbs cuando entramos a los indicadores por etapa y no mostrar en la cofiguración de indicadores (/detalles-indicadores-ce)
        this.showBread = true;
        if (pantalla == '/detalles-indicadores-ce') {
          const idIndicadorSiac = JSON.parse(localStorage.getItem('idIndicadorSiac'));
          this.showBread = idIndicadorSiac.etapaId != undefined; //console.log('this.showBread',this.showBread);
        }
        if((pantalla == this.exeption[0].url || pantalla == this.exeption[4].url || (pantalla == this.exeption[1].url && this.tipo == 1)) && !revIns){this.nivel4E5();}
        const consulta = (pantalla == this.exeption[3].url && this.tipo == 1) ? ' - Consulta' : ''; //console.log(consulta);
        //Actualizar en Detalles de Indicador
        if ((i > 0 && i <= 14) && pantalla == newPathname) { //console.log(i,(pantalla + ' = ' + newPathname));
          const opc1 = { menu: nivel3 + consulta, url: pantalla }; //console.log(opc1);
          localStorage.setItem("breadcrumbs", JSON.stringify(opc1));
        }
        const newMenu = JSON.parse(localStorage.getItem("breadcrumbs")); //console.log(newMenu);
        if (newMenu) {var { menu, url } = newMenu;}
        //BREADCRUMBS
        this.menu1 = (revIns) ? 'Mis Revisiones Institucionales' : (pantalla == indi1 || pantalla == indi2) ? menu : nivel1;
        this.menu2 = nivel2;
        this.menu3 = ((this.menu4 || url3) ? this.retroE5.menu3 : nivel3) + consulta;
        this.url1 = (revIns) ? url1.replace(urlMisEva, urlMisRev) : (pantalla == indi1 || pantalla == indi2) ? url : url1;
        this.url2 = (revIns && url2) ? url2.replace(urlMisEva, urlMisRev) : url2;
        //this.url3 = (this.menu4) ? this.retroE5.url3 : url3;
      }
    }
  }

  etapa5(n: number){
    const newMenu = JSON.parse(localStorage.getItem("breadcrumbs")); //console.log(newMenu);
    const opc1 = { menu: newMenu.menu, url: this.exeption[n].url};
    localStorage.setItem("breadcrumbs", JSON.stringify(opc1));
  }

  nivel4E5(){
    this.retroE5 = JSON.parse(localStorage.getItem('retroE5')); //console.log(this.retroE5);
    this.menu4 = this.retroE5.menu4; 
    this.url3 = this.retroE5.url3; //console.log(this.retroE5.url3);
  }
}
