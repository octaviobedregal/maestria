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
        this.autenticacionService.iniciarSesion(this.usuario);
        this._ngZone.run(() => {
            this.router.navigate(['/inicio']);
        });
    }
}