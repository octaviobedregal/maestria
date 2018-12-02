import { Routes, RouterModule } from "@angular/router";
import { InicioComponent } from "./components/inicio/inicio.component";
import { MapasComponent } from "./components/mapa/mapas.component";
import { Guardian } from "./services/guardian.services";
import { IngresoComponent } from "./components/usuario/ingreso.component";
import { MapaComponent } from "./components/mapa/mapa.component";
import { EmergenciaComponent } from "./components/mapa/emergencia.component";
import { RutaCriticaComponent } from "./components/mapa/ruta-critica.component";
import { RutaCriticaApiComponent } from "./components/mapa/ruta-critica-api.component";

const APP_ROUTES: Routes = [
    { path: 'ruta-critica-api/:codigo', component: RutaCriticaApiComponent },
    { path: 'ingreso', component: IngresoComponent },
    { path: 'inicio', component: InicioComponent, canActivate: [Guardian] },
    { path: 'mapas', component: MapasComponent, canActivate: [Guardian] },
    { path: 'mapa/:id', component: MapaComponent, canActivate: [Guardian] },
    { path: 'emergencia/:id', component: EmergenciaComponent, canActivate: [Guardian] },
    { path: 'ruta-critica/:id', component: RutaCriticaComponent, canActivate: [Guardian] },
    { path: '**', pathMatch: 'full', redirectTo: 'ingreso' },
    { path: '', pathMatch: 'full', redirectTo: 'ingreso' },
];

export const APP_ROUNTING = RouterModule.forRoot(APP_ROUTES);