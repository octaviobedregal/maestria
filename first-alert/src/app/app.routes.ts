import { Routes, RouterModule } from "@angular/router";
import { InicioComponent } from "./components/inicio/inicio.component";
import { MapasComponent } from "./components/mapa/mapas.component";
import { Guardian } from "./services/guardian.services";
import { IngresoComponent } from "./components/usuario/ingreso.component";
import { MapaComponent } from "./components/mapa/mapa.component";

const APP_ROUTES: Routes = [
    { path: 'ingreso', component: IngresoComponent },
    { path: 'inicio', component: InicioComponent, canActivate: [Guardian] },
    { path: 'mapas', component: MapasComponent, canActivate: [Guardian] },
    { path: 'mapa/:id', component: MapaComponent, canActivate: [Guardian] },
    { path: '**', pathMatch: 'full', redirectTo: 'ingreso' },
    { path: '', pathMatch: 'full', redirectTo: 'ingreso' },

];

export const APP_ROUNTING = RouterModule.forRoot(APP_ROUTES);