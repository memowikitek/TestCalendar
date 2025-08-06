import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { RolesService, UsersService } from 'src/app/core/services';
import { Auth } from 'src/app/utils/helpers';
import { Perfil } from 'src/app/utils/models';

@Directive({
    selector: '[appPermission]',
    standalone: false
})
export class PermissionDirective implements OnChanges {
    @Input() appPermission: string;
    DatosSesion: Perfil;
    router: any;

    constructor(
        private users: UsersService,
        private readonly roles: RolesService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
        this.DatosSesion = Auth.getSession();
        this.users.userSession = this.DatosSesion;
    }

    ngOnChanges(): void {
        this.updateView();
    }

    updateView(): void {
        this.viewContainer.clear();
        const userModules = this.users.userSession.modulos;
        const validUrl = userModules.find((item) => item.url.includes(this.appPermission));
        if (validUrl) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
        }
    }
}
