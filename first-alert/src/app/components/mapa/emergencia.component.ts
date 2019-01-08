import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { EmergenciaService } from '../../services/emergencia.service';

declare var vis: any;
const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    type: 'warning',
    showConfirmButton: false,
    timer: 3000
});


@Component({
    selector: 'app-emergencia',
    templateUrl: './emergencia.component.html'
})
export class EmergenciaComponent implements OnInit {
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
        private emergenciaService: EmergenciaService) {
        this.route.params.subscribe(parametros => {
            this.id = parametros['id'];
            this.mapaService.buscar(this.id).subscribe((data) => {
                this.mapa = data.json();
                this.backgroundImg = 'url(' + this.mapaService.contruirPathImagen(this.mapa.path) + ')';
                this.emergenciaService.listar(this.id).subscribe((data) => {
                    this.emergencias = data.json();
                    this.contruirMapa();
                    this.contruirEmergencias();
                }, error => {
                    console.error(error);
                })
            }, error => {
                console.error(error);
            });
        });
    }

    contruirEmergencias() {
        this.controlDtNodos.rows.add(this.mapa.nodos).draw();
        let nodos = this.controlDtNodos.rows().data();
        let cont = 0;
        for (let emergencia of this.emergencias) {
            cont = 0;
            for (let nodo of nodos) {
                console.log(nodo);
                if (nodo.id === emergencia.idNodo) {
                    this.controlDtNodos.row(':eq(' + cont + ')').select();
                }
                cont++;
            }
            cont++;
        }

        for (let emergencia of this.emergencias) {
            for (let nodo of this.mapa.nodos) {
                if (nodo.id === emergencia.idNodo) {
                    this.nodes.update([{ id: nodo.numero, color: 'red' }]);
                }
            }
        }
    }
    ngOnInit() {
        this.contruirDataTableNodos();
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

    cambiarColores() {
        this.nodes.update([{ id: 1, color: 'red' }]);
    }

    @ViewChild('canvas') public canvasEl: ElementRef;

    contruirDataTableNodos() {
        let optNodos: any = {
            columns: [
                {
                    title: '¿Emergencia?',
                    defaultContent: '',
                    className: 'select-checkbox',
                    width: '5%',
                    targets: 0
                }, {
                    title: 'Nodo',
                    data: 'codigo',
                    width: 'auto'
                }],
            paging: false,
            bFilter: false,
            bSearchable: false,
            bInfo: false,
            select: {
                style: 'multi'
            },
            bSort: false,
            responsive: true,
            pageLength: 5,
            language: { url: "./assets/Spanish.js" },
            dom: 'Bfrtip',
            buttons: []
        };

        this.controlDtNodos = $(this.dtNodos.nativeElement).DataTable(optNodos);
        this.controlDtNodos.on('select', function (e, dt, type, indexes) {
            if (type === 'row') {
                window.functions.pintarNodoSeleccionado(indexes[0], true);
            }
        });
        this.controlDtNodos.on('deselect', function (e, dt, type, indexes) {
            if (type === 'row') {
                window.functions.pintarNodoSeleccionado(indexes[0], false);
            }
        });

        window.functions = window.functions || {};
        window.functions.pintarNodoSeleccionado = this.pintarNodoSeleccionado.bind(this);
    }

    pintarNodoSeleccionado(index, emergencia) {
        let numero = this.controlDtNodos.row(index).data().numero;
        if (emergencia) {
            this.nodes.update([{ id: numero, color: 'red' }]);
        } else {
            this.nodes.update([{ id: numero, color: '#D2E5FF' }]);
        }
    }

    guardarEmergencia() {
        Swal({
            title: '¿Desea guardar la emergencia?',
            //text: "¡No podras revertir esta acción!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '<i class="fa fa-check">&nbsp;</i>Confirmar',
            cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
        }).then((result) => {
            if (result.value) {
                let seleccionados = this.controlDtNodos.rows({ selected: true }).data();
                let emergencias: any = [];
                let emergencia: any = {};
                for (let seleccionado of seleccionados) {
                    emergencia = {};
                    emergencia.idMapa = seleccionado.idMapa;
                    emergencia.idNodo = seleccionado.id;
                    emergencia.fecha = new Date();
                    emergencias.push(emergencia);
                }
                this.emergenciaService.guardar(this.id, emergencias).subscribe((data) => {
                    toast({
                        type: 'success',
                        title: 'Emergencia guardada con éxito'
                    })
                }, error => {
                    toast({
                        type: 'error',
                        title: 'Ocurrió un error en el servidor, inténtelo mas tarde'
                    })
                })
            }
        })

    }

}