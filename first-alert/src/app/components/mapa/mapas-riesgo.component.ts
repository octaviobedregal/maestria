import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapaService } from '../../services/mapa.service';
import { Router } from '@angular/router';

declare var vis: any;

@Component({
    selector: 'app-mapas-riesgo',
    templateUrl: './mapas-riesgo.component.html'
})
export class MapasRiesgoComponent implements OnInit, OnDestroy {
    controlDtMapas: any;
    @ViewChild('dtMapas') dtMapas: ElementRef;

    constructor(private mapaService: MapaService,
        private router: Router,
        private _ngZone: NgZone) {
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
                width: '20%'
            }, {
                title: 'Descripción',
                data: 'descripcion',
                width: 'auto'
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

        window.functions = window.functions || {};
        window.functions.seleccionarMapa = this.seleccionarMapa.bind(this);
    }

    seleccionarMapa(index) {
        let id = this.controlDtMapas.row(index).data().id;
        this._ngZone.run(() => {
            window.open('/mapa-riesgo-api/' + id, '_blank');
        });
    }

}