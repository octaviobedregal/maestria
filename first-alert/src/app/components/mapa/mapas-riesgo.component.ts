import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapaService } from '../../services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

declare var vis: any;

@Component({
    selector: 'app-mapas-riesgo',
    templateUrl: './mapas-riesgo.component.html'
})
export class MapasRiesgoComponent implements OnInit, OnDestroy {
    controlDtMapas: any;
    @ViewChild('dtMapas') dtMapas: ElementRef;

    nodes: any = new vis.DataSet();
    edges: any = new vis.DataSet();
    network: any;
    mapa: any = { idCompanhia: 1, nuevoPath: false, path: '', contentPath: '', nombre: '-', descripcion: '--' };
    backgroundImg: SafeStyle;

    constructor(private mapaService: MapaService) {
    }

    ngOnInit() {
        this.contruirDataTableMapas();
    }
    ngOnDestroy() {
        this.controlDtMapas.destroy();
        window.functions = {};
    }

    contruirDataTableMapas() {
        let optMapas: any = {
            ajax: (dataTablesParameters: any, callback) => {
                this.mapaService.listar().subscribe((data) => {
                    console.log(data);
                    callback({
                        recordsTotal: 11,
                        recordsFiltered: 11,
                        data: data.json()
                    })
                }, error => {
                    console.log(error);
                })
            },
            columns: [{
                title: "#",
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
                width: '5%'
            }, {
                title: 'Nombre',
                data: 'nombre',
                width: '35%'
            }],
            select: {
                style: 'single'
            },
            bSort: false,
            responsive: true,
            pageLength: 5,
            language: { url: "./assets/Spanish.js" },
            dom: 'Bfrtip',
            buttons: []
        };

        this.controlDtMapas = $(this.dtMapas.nativeElement).DataTable(optMapas);
        this.controlDtMapas.on('select', function (e, dt, type, indexes) {
            if (type === 'row') {
                window.functions.seleccionarMapa(indexes[0]);
            }
        });
        this.controlDtMapas.on('deselect', function (e, dt, type, indexes) {
            if (type === 'row') {
                window.functions.deSeleccionarMapa(indexes[0]);
            }
        });

        window.functions = window.functions || {};
        window.functions.seleccionarMapa = this.seleccionarMapa.bind(this);
        window.functions.deSeleccionarMapa = this.deSeleccionarMapa.bind(this);
    }

    seleccionarMapa(index) {
        let id = this.controlDtMapas.row(index).data().id;
        this.mapaService.buscar(id).subscribe((data) => {
            this.mapa = data.json();
            this.backgroundImg = 'url(' + this.mapaService.contruirPathImagen(this.mapa.path) + ')';
            this.contruirMapa();
        }, error => {
            console.error(error);
        });
    }

    deSeleccionarMapa(index) {
        this.backgroundImg = '';
        let lista1 = this.edges.get({ returnType: 'Array' });
        let lista2 = this.nodes.get({ returnType: 'Array' });

        for (let edge of lista1) {
            this.edges.remove({ id: edge.id });
        }
        for (let node of lista2) {
            this.nodes.remove({ id: node.id });
        }
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
    }

}