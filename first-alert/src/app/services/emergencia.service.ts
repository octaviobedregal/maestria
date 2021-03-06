import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class EmergenciaService {
    //API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/emergencia';
    API_ENDPOINT: string = 'http://50.63.12.52:8080/first_alert/controlador/emergencia';

    constructor(private http: Http) {

    }

    public listar(idMapa) {
        return this.http.get(this.API_ENDPOINT + '/listar-emergencias/' + idMapa);
    }

    public guardar(idMapa, emergencias) {
        let body = emergencias;
        return this.http.post(this.API_ENDPOINT + '/guardar-emergencia/' + idMapa, body);
    }

}