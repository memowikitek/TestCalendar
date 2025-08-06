import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsWelcomeService, UsersService } from 'src/app/core/services';
import { SettingsWelcomeDTO, TablePaginatorSearch } from 'src/app/utils/models';

@Component({
    selector: 'app-welcome-screen',
    templateUrl: './welcome-screen.component.html',
    styleUrls: ['./welcome-screen.component.scss'],
})
export class WelcomeScreenComponent implements OnInit {
    filters: TablePaginatorSearch;
    data: SettingsWelcomeDTO;
    dataSource: MatTableDataSource<SettingsWelcomeDTO>;
    selection: SelectionModel<SettingsWelcomeDTO>;
    disabled: boolean;
    permission: boolean;
    subscription: Subscription;
    html: any = null;
    CEId: any;
    CE: any;

    constructor(private readonly config: SettingsWelcomeService) {}

    ngOnInit(): void {
        //Por Ciclo Id
        const CE = JSON.parse(localStorage.getItem('CE')); 
        this.CE = CE[0];
        const CEId = JSON.parse(localStorage.getItem('welcomeId'));

         /**NEW */
         let filters = new TablePaginatorSearch();
         filters.filter = { cicloEvaluacionId: CEId };
         filters.pageSize = 0;
         filters.pageNumber = 0;
         this.config.getAllConfigPantallaBienvenida(filters).subscribe((response) => {
            if (!response.output) {return;}
            if(response.exito){
                const data = new SettingsWelcomeDTO().deserialize(response.output[0]);
                this.data = data; //console.log(this.data);
                this.html = this.data.html && CEId
                ? this.data.html
                : `<h2 style="text-align: center;">Configure la pantalla de bienvenida</h2>`;
            }
         });
         /***/

        /*this.config.getConfigPantallaBienvenida().subscribe((response) => {
            if (!response.output) {return;}
            const data = response.output[0];//new SettingsWelcomeDTO().deserialize(response.output[0]);
            this.data = data; console.log(this.data);
            this.html = this.data.html
                ? this.data.html
                : '<h2 style="text-align: center;">Configure la pantalla de bienvenida</h2>';
        });*/
    }
}
