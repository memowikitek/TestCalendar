import { Perfil, UsuarioDTO } from '../models';
import { LocalStorage } from './local-storage';

export class Auth {
    private static SESSION = 'session';

    static getSession(): Perfil | null {
        return LocalStorage.get(Auth.SESSION);
    }

    static login(session: Perfil): void {
        LocalStorage.set(session, Auth.SESSION);
        //Se borran los permisosHeredados para que se carguen cuando se invocan las pantallas
        LocalStorage.delete('permisosHeredados')
    }

    static logout(): void {
        LocalStorage.delete(Auth.SESSION);
        LocalStorage.delete('permisosHeredados')
        localStorage.clear();
    }

    static modules(session: Perfil): void {
        LocalStorage.set(session, Auth.SESSION);
    }

    static checkSession(): boolean {
        const session = Auth.getSession();
        return session !== null;
    }
}
