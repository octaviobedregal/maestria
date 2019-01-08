import { Component, ViewChild, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core'
import { MapaService } from '../../services/mapa.service';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.services';

@Component({
    selector: 'app-ingreso',
    templateUrl: './ingreso.component.html'
})

export class IngresoComponent implements OnInit, OnDestroy {
    usuario: any = { nombre: '', clave: '' };
    showMensajeError: boolean = false;
    mensaje: String = '';

    constructor(private mapaService: MapaService,
        private router: Router,
        private _ngZone: NgZone,
        private autenticacionService: AutenticacionService) {

    }

    ngOnInit() {
    }
    ngOnDestroy() {
        window.functions = {};
    }

    ingresarSistema() {
        this.showMensajeError = false;
        this.autenticacionService.logearUsuario(this.usuario.nombre, this.usuario.clave).subscribe((data) => {
            let sesion = data.json();
            if (sesion != null && sesion.usuario.id > 0) {
                this.autenticacionService.iniciarSesion(sesion);
                location.href = '/inicio';
            } else {
                this.showMensajeError = true;
                this.mensaje = "Usuario / Clave Incorrecto";
            }
        }, error => {
            console.log(error);
        });
    }
}