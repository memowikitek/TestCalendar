import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    standalone: false
})
export class SidenavComponent {
    @ViewChild('sidenavRight') sidenav!: MatSidenav;

    togglePanel() {
        this.sidenav.toggle();
    }
}
