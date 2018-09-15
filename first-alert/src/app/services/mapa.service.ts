import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

@Injectable()
export class MapaService {
    API_ENDPOINT: string = 'http://localhost:8090/first_alert/controlador/mapa';


    constructor(private http: Http) {

    }
    public listar() {
        return this.http.get(this.API_ENDPOINT + '/listar');
    }

    public insertar(mapa) {
        let body = mapa;
        return this.http.post(this.API_ENDPOINT + '/crear', body);
    }

    public buscar(id) {
        return this.http.get(this.API_ENDPOINT + '/buscar/'+id);
    }

    public contruirPathImagen(id) {
        return (this.API_ENDPOINT + '/ver-imagen/'+id);
    }

    /*
        public editar(mapa) {
            let body = mapa;
            return this.http.put(this.API_ENDPOINT + '/' + mapa.id, body);
        }
    
        public eliminar(id) {
            return this.http.delete(this.API_ENDPOINT + '/' + id);
        }*/
}