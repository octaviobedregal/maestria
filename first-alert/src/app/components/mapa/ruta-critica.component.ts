import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { EmergenciaService } from '../../services/emergencia.service';
import { RutaCriticaService } from 'src/app/services/ruta-critica.service';

declare var vis: any;

@Component({
    selector: 'app-ruta-critica',
    templateUrl: './ruta-critica.component.html'
})


export class RutaCriticaComponent {
    nodoSeleccionado: any = {};
    nodo: any = { codigo: '' };
    nodos: any = [];

    id: string = '0';
    controlDtNodos: any;
    @ViewChild('dtNodos') dtNodos: ElementRef;
    nodes: any = new vis.DataSet();
    edges: any = new vis.DataSet();
    network: any;
    mapa: any = { idCompanhia: 1, nuevoPath: false, path: '', contentPath: '', nombre: '-', descripcion: '--' };
    emergencias: any[] = [];
    backgroundImg: SafeStyle;

    constructor(private route: ActivatedRoute,
        private mapaService: MapaService,
        private rutaCriticaService: RutaCriticaService) {
        this.route.params.subscribe(parametros => {
            this.id = parametros['id'];
            this.mapaService.buscar(this.id).subscribe((data) => {
                this.mapa = data.json();
                this.nodos = this.mapa.nodos;
                this.backgroundImg = 'url(' + this.mapaService.contruirPathImagen(this.mapa.id) + ')';
                this.contruirMapa();
            }, error => {
                console.error(error);
            })
        });
    }

    contruirMapa() {

        for (let nodo of this.mapa.nodos) {
            this.nodes.add({ id: nodo.numero, label: nodo.codigo, x: nodo.x, y: nodo.y });
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
    }

    buscarRutaCritica() {
        this.rutaCriticaService.buscarRutaCritica(this.nodoSeleccionado.codigo).subscribe((data) => {
            console.log(data);
          }, error => {
            
          });
    }
}