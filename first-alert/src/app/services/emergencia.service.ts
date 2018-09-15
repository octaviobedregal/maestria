import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class EmergenciaService {
    API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/emergencia';


    constructor(private http: Http) {

    }

    public listar(idMapa) {
        return this.http.get(this.API_ENDPOINT + '/listar/' + idMapa);
    }

    public guardar(emergencias) {
        let body = emergencias;
        return this.http.post(this.API_ENDPOINT + '/crear-emergencia', body);
    }

}