import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class MapaService {
    //API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/mapa';
    API_ENDPOINT: string = 'http://50.63.12.52:8080/first_alert/controlador/mapa';

    constructor(private http: Http) {

    }

    public listar() {
        return this.http.get(this.API_ENDPOINT + '/listar-mapas');
    }

    public guardar(mapa) {
        let body = mapa;
        return this.http.post(this.API_ENDPOINT + '/guardar-mapa', body);
    }

    public buscar(id) {
        return this.http.get(this.API_ENDPOINT + '/buscar-mapa-por-id/' + id);
    }

    public buscarPorCodigo(codigo) {
        return this.http.get(this.API_ENDPOINT + '/buscar-mapa-por-codigo-nodo/' + codigo);
    }

    public contruirPathImagen(imagen) {
        return (this.API_ENDPOINT + '/ver-imagen/' + encodeURI(imagen));
    }

    public eliminar(id) {
        return this.http.get(this.API_ENDPOINT + '/eliminar-mapa/' + id);
    }
}