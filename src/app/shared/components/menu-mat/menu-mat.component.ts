import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services';
import { MenuService } from 'src/app/core/services/api/menu/menu.service';
import { TablePaginatorSearch } from 'src/app/utils/models';
import { MenuDTO } from 'src/app/utils/models/menu.dto';

@Component({
    selector: 'app-menu-mat',
    templateUrl: './menu-mat.component.html',
    styleUrls: ['./menu-mat.component.scss'],
    standalone: false
})
export class MenuMatComponent implements OnInit {
    @ViewChild('myElement') myElement: ElementRef;
    @Input() showSubmenuSeguridad?: boolean;
    @Input() sidenav?: any;
    //route: string = '';
    //show: boolean = false;
    data: MenuDTO[];
    filters: TablePaginatorSearch;
    pageIndex: number;
    pageSize: number;
    menuArray3: MenuDTO[] = [];

    constructor(
        private readonly router: Router, 
        private readonly menuService: MenuService,
        private users: UsersService) {
        this.filters = new TablePaginatorSearch();
        this.data = [];
    }

    ngOnInit(): void {
        this.filters.pageSize = 50;
        this.filters.filter = { activo: true };
        const validaMenu= localStorage.getItem("validMenu");
        this.menuArray3 = JSON.parse(localStorage.getItem("menuArray3"))
        if(validaMenu === "true" || !this.menuArray3 ){
            localStorage.setItem("validMenu", "false");            
            // var rolId= localStorage.getItem("roleSelectedId");
            this.getAllMenus(this.users.userSession.rolSelectedId);
            // this.getAllMenus(this.filters);
        }
        this.onMenuMat();
    }

    private getAllMenus(rolId: number) {
        this.data = [];
        //console.log("rolId " + rolId);
       if(rolId != null){
        this.menuService.getMenusByRolId(rolId).subscribe((response) => {
            if (response.output) {
                this.data = response.output.map((menu) => new MenuDTO().deserialize(menu));
                this.menuArray3 = this.data;
                localStorage.setItem("menuArray3", JSON.stringify(this.menuArray3));
            }
        });
       }
        
    }

    onMenuMat() {
        const menu = document.getElementById('menu-mat') as HTMLFormElement;
        menu.addEventListener('mouseover', (e) => {
            const tar: any = e.target; //console.log(e.target)
            const opc = tar?.children[0]?.children[0]; //console.log(opc);
            if(opc != undefined){
                opc.style.color = '#fff'; // Cambiar a color blanco
                // Agregar evento para cambiar el color de nuevo a negro cuando el mouse sale
                tar.addEventListener('mouseleave', () => {
                    opc.style.color = 'inherit'; // Cambiar a color negro
                });    
            }
        });
    }

    get getCurrentRoute(): string {
        return this.router.url;
    }

    redirectUrl(url: any){
        window.location.assign(url);
    }

}
