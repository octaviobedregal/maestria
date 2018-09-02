import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MapasComponent } from './components/mapa/mapas.component';
import { MapaService } from './services/mapa.service';
import { HttpModule } from '@angular/http';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { MapaComponent } from './components/mapa/mapa.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { AutenticacionService } from './services/autenticacion.services';
import { APP_ROUNTING } from './app.routes';
import { Guardian } from './services/guardian.services';
import { IngresoComponent } from './components/usuario/ingreso.component';



@NgModule({
  declarations: [
    AppComponent,
    IngresoComponent,
    InicioComponent,
    MapasComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    FormsModule,
    DataTablesModule,
    HttpModule,
    APP_ROUNTING,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    MapaService,
    AutenticacionService,
    Guardian
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule, BsDropdownModule, TooltipModule, ModalModule]
})
export class AppModule { }
