import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SidenavService {
    //constructor() { }
    private toggleSidenavSubject = new Subject<void>();

    toggleSidenav$ = this.toggleSidenavSubject.asObservable();

    toggleSidenav() {
        this.toggleSidenavSubject.next();
    }
}
