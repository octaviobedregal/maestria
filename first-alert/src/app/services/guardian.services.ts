import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AutenticacionService } from "./autenticacion.services";
@Injectable()
export class Guardian implements CanActivate {
    loggedIn = false;
    constructor(private autenticacionService: AutenticacionService) {
    }
    canActivate() {
        return this.autenticacionService.estaLogeado();
    }
}