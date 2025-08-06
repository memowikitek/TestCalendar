import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CicloEvaDTOV1, TablePaginatorSearch, Vista } from 'src/app/utils/models';
import { EvaluationCycleService, SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-institutional-reviews',
  templateUrl: './my-institutional-reviews.component.html',
  styleUrls: ['./my-institutional-reviews.component.scss']
})
export class MyInstitutionalReviewsComponent implements OnInit {
  data: CicloEvaDTOV1[];
  showCard: boolean = false;
  ciclos: any;
  proceso: any;
  pagesChild: boolean;

  constructor(
    private readonly router: Router,
    private readonly EvaCS: EvaluationCycleService,
  ){}

  ngOnInit(): void {
    this.pagesChild = this.getCurrentRoute.includes('/mis-revisiones-institucionales/ciclo-etapas');//console.log(this.pagesChild);
    if (!this.pagesChild) {
      this.getProcess();
      this.getAllCycleEva();
    }
  }

  //METHODS
  private getAllCycleEva(): void {
    let filters = new TablePaginatorSearch();
    filters.filter = {
      procesoEvaluacion: this.proceso,
      activo: true
    };
    filters.pageSize = 0;
    filters.pageNumber = 0;
    const today = this.fechaActual();
    this.EvaCS.getCEEvaluacion(filters, today).subscribe((response) => {
      if (response.output) {
        this.data = response.output.map((eva) => new CicloEvaDTOV1().deserialize(eva)); //console.log(this.data);
        this.ciclos = this.data; //console.log(this.ciclos);
        this.showCard = this.ciclos.length > 0; //console.log(this.showCard);
      }
    });
  }

  getProcess() {
    const process = JSON.parse(localStorage.getItem('process')); //console.log(process);
    if (process) {
      const { rol, proceso } = process;
      this.proceso = proceso;
    }
  }

  get getCurrentRoute(): string {
    return this.router.url;
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

}
