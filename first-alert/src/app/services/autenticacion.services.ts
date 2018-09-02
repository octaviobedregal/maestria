import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class AutenticacionService {
    API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/mapa';

    constructor(private http: Http) {

    }

    logearUsuario(){
        
    }

    iniciarSesion(usuario) {
        sessionStorage.setItem('sessionUsuario', usuario);
    }

    cerrarSesion() {
        sessionStorage.removeItem('sessionUsuario');
    }

    estaLogeado() {
        let logeado: boolean = false;
        if (sessionStorage.getItem('sessionUsuario')) {
            logeado = true;
        }
        return logeado;
    }
}