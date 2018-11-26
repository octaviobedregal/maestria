import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class AutenticacionService {
    API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/sesion';
    //API_ENDPOINT: string = 'http://50.63.12.52:8080/first_alert/controlador/sesion';

    constructor(private http: Http) {

    }

    logearUsuario(nombre, clave) {
        return this.http.get(this.API_ENDPOINT + '/ingresar-sistema/' + nombre + "/" + clave);
    }

    iniciarSesion(sesion) {
        sessionStorage.setItem('session', JSON.stringify(sesion));
    }

    cerrarSesion() {
        sessionStorage.removeItem('session');
    }

    estaLogeado() {
        let logeado: boolean = false;
        if (sessionStorage.getItem('session')) {
            logeado = true;
        }
        return logeado;
    }

    traerNombreUsuarioSesion() {
        let nombreUsuario: String = "";
        if (sessionStorage.getItem('session')) {
            nombreUsuario = sessionStorage.session.usuario.nombre;
        }
        return nombreUsuario;
    }
}