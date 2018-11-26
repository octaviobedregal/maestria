import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class RutaCriticaService {
    API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/mapa';
    //API_ENDPOINT: string = 'http://50.63.12.52:8080/first_alert/controlador/emergencia';


    constructor(private http: Http) {

    }

    public buscarRutaCritica(codigoNodo) {
        return this.http.get(this.API_ENDPOINT + '/buscar-ruta-critica/' + codigoNodo);
    }

}