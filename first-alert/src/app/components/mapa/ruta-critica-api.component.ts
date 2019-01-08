import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapaService } from 'src/app/services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { RutaCriticaService } from 'src/app/services/ruta-critica.service';

declare var vis: any;

@Component({
    selector: 'ruta-critica-api-root',
    templateUrl: './ruta-critica-api.component.html'
})
export class RutaCriticaApiComponent {
    nodos: any = [];

    codigo: string = '0';
    controlDtNodos: any;
    @ViewChild('dtNodos') dtNodos: ElementRef;
    nodes: any = new vis.DataSet();
    edges: any = new vis.DataSet();
    network: any;
    mapa: any = { idCompanhia: 1, nuevoPath: false, path: '', contentPath: '', nombre: '-', descripcion: '--' };
    emergencias: any[] = [];
    idNodosEliminar: any = [];
    backgroundImg: SafeStyle;

    constructor(private route: ActivatedRoute,
        private mapaService: MapaService,
        private rutaCriticaService: RutaCriticaService) {

        window.functions = window.functions || {};
        window.functions.borrarMenu = this.borrarMenu.bind(this);
        window.functions.borrarMenu();

        this.route.params.subscribe(parametros => {
            this.codigo = parametros['codigo'];
            this.mapaService.buscarPorCodigo(this.codigo).subscribe((data) => {
                this.mapa = data.json();
                this.nodos = this.mapa.nodos;
                this.backgroundImg = 'url(' + this.mapaService.contruirPathImagen(this.mapa.path) + ')';
                this.contruirMapa();
            }, error => {
                console.error(error);
            })
        });
    }
    borrarMenu() {
        $('ul,footer,nav').hide();
        $('#content-wrapper').attr('id', '');
        $('.container-fluid').removeClass('container-fluid');
    }

    contruirMapa() {

        for (let nodo of this.mapa.nodos) {
            this.nodes.add({ id: nodo.numero, label: nodo.numero.toString(), x: nodo.x, y: nodo.y, color: '#D2E5FF' });
        }
        for (let camino of this.mapa.caminos) {
            this.edges.add({ from: camino.numeroNodoInicio, to: camino.numeroNodoFin, label: camino.peso.toString(), font: { color: 'blue' } });
        }

        var container = document.getElementById('network');
        var data = {
            nodes: this.nodes,
            edges: this.edges
        };

        var locales = {
            en: {
                edit: 'Edit',
                del: 'Delete selected',
                back: 'Back',
                addNode: 'Add Node',
                addEdge: 'Add Edge',
                editNode: 'Edit Node',
                editEdge: 'Edit Edge',
                addDescription: 'Click in an empty space to place a new node.',
                edgeDescription: 'Click on a node and drag the edge to another node to connect them.',
                editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
                createEdgeError: 'Cannot link edges to a cluster.',
                deleteClusterError: 'Clusters cannot be deleted.',
                editClusterError: 'Clusters cannot be edited.'
            }
        }

        var options = {
            autoResize: false,
            height: '100%',
            width: '100%',
            locale: 'en',
            locales: locales,
            clickToUse: false,
            "edges": {
                "smooth": false
            },
            physics: {
                enabled: false,     // Stops node movement during display
                stabilization: {    // Determines an initial layout; enabled by default
                    enabled: false,
                    iterations: 1000
                }
            },      // defined in the physics module.
            "interaction": {
                "dragView": false,
                zoomView: false,
                "dragNodes": false
            }
        };

        this.network = new vis.Network(container, data);
        this.network.setOptions(options);

        this.rutaCriticaService.buscarRutaCritica(this.codigo).subscribe((data) => {
            let ids: any = data.json();
            this.generarNodosEliminar(ids);

            for (let id of this.idNodosEliminar) {
                let numero = this.buscarNumeroNodo(id);
                this.nodes.remove({ id: numero });
            }

            for (let id of ids) {
                let numero = this.buscarNumeroNodo(id);
                this.nodes.update([{ id: numero, color: 'green' }]);
            }

        }, error => {
            console.error(error);
        });
    }
    generarNodosEliminar(idsRutaCritica) {
        this.idNodosEliminar = this.nodos.map(function (nodo) {
            return nodo.id;
        });

        for (let id of idsRutaCritica) {
            this.eliminarIdNodoNodosEliminar(id);
        }
    }

    buscarNumeroNodo(id) {
        for (let nodo of this.mapa.nodos) {
            if (id === nodo.id) {
                return nodo.numero;
            }
        }
    }

    eliminarIdNodoNodosEliminar(id) {
        let cont = 0;
        for (let idNodoEliminar of this.idNodosEliminar) {
            if (idNodoEliminar === id) {
                this.idNodosEliminar.splice(cont, 1);
                break;
            }
            cont++;
        }
    }
}