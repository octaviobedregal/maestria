import { Component, NgZone } from '@angular/core';
import { AutenticacionService } from './services/autenticacion.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nombreUsuario: any = '';
  constructor(private router: Router,
    private _ngZone: NgZone,
    private autenticacionService: AutenticacionService) {
    this.nombreUsuario = this.autenticacionService.traerNombreUsuarioSesion();
  }

  cerrarSesion() {
    this.autenticacionService.cerrarSesion();
    location.href = '/ingresar';
  }
}
