import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MapasComponent } from './components/mapa/mapas.component';
import { MapaService } from './services/mapa.service';
import { HttpModule } from '@angular/http';
import { DataTablesModule } from 'angular-datatables';
import { MapaComponent } from './components/mapa/mapa.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { AutenticacionService } from './services/autenticacion.services';
import { APP_ROUNTING } from './app.routes';
import { Guardian } from './services/guardian.services';
import { IngresoComponent } from './components/usuario/ingreso.component';
import { EmergenciaComponent } from './components/mapa/emergencia.component';
import { EmergenciaService } from './services/emergencia.service';
import { RutaCriticaComponent } from './components/mapa/ruta-critica.component';
import { RutaCriticaService } from './services/ruta-critica.service';
import { RutaCriticaApiComponent } from './components/mapa/ruta-critica-api.component';
import { MapasRiesgoComponent } from './components/mapa/mapas-riesgo.component';



@NgModule({
  declarations: [
    AppComponent,
    RutaCriticaApiComponent,
    IngresoComponent,
    InicioComponent,
    MapasComponent,
    MapasRiesgoComponent,
    MapaComponent,
    EmergenciaComponent,
    RutaCriticaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    DataTablesModule,
    HttpModule,
    APP_ROUNTING,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    MapaService,
    EmergenciaService,
    AutenticacionService,
    RutaCriticaService,
    Guardian
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule, BsDropdownModule, TooltipModule, ModalModule]
})
export class AppModule { }
