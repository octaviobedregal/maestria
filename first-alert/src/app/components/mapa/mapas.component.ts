import { Component, ViewChild, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core'
import { MapaService } from '../../services/mapa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    type: 'warning',
    showConfirmButton: false,
    timer: 3000
});


@Component({
    selector: 'app-mapas',
    templateUrl: './mapas.component.html'
})

export class MapasComponent implements OnInit, OnDestroy {
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
                width: '35%'
            }, {
                title: 'Descripción',
                data: 'descripcion',
                width: '35%'
            }, {
                title: "",
                render: function (data, type, row, meta) {
                    var btn = '<div style="text-align:center;"><button type="button" class="btn btn-primary btn-sm"'
                    btn += 'onclick="functions.verRutaCritica(' + row.id + ')">'
                    btn += '<i class="fa fa-edit">&nbsp;</i>Ruta Crítica'
                    btn += '</button></div>';
                    return btn;
                },
                width: '5%'
            }, {
                title: "",
                render: function (data, type, row, meta) {
                    var btn = '<div style="text-align:center;"><button type="button" class="btn btn-primary btn-sm"'
                    btn += 'onclick="functions.verEmergencia(' + row.id + ')">'
                    btn += '<i class="fa fa-edit">&nbsp;</i>Emergencia'
                    btn += '</button></div>';
                    return btn;
                },
                width: '5%'
            }, {
                title: "",
                render: function (data, type, row, meta) {
                    var btn = '<div style="text-align:center;"><button type="button" class="btn btn-primary btn-sm"'
                    btn += 'onclick="functions.editar(' + row.id + ')">'
                    btn += '<i class="fa fa-edit">&nbsp;</i>Editar'
                    btn += '</button></div>';
                    return btn;
                },
                width: '5%'
            }, {
                title: "",
                render: function (data, type, row, meta) {
                    var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
                    btn += 'onclick="functions.eliminar(' + row.id + ')">'
                    btn += '<i class="fa fa-trash-o">&nbsp;</i>Eliminar'
                    btn += '</button></div>';
                    return btn;
                },
                width: '5%'
            }],
            select: false,
            bSort: false,
            responsive: true,
            pageLength: 5,
            language: { url: "./assets/Spanish.js" },
            dom: 'Bfrtip',
            buttons: []
        };

        window.functions = window.functions || {};
        window.functions.editar = this.ver.bind(this);
        window.functions.eliminar = this.eliminar.bind(this);
        window.functions.verEmergencia = this.verEmergencia.bind(this);
        window.functions.verRutaCritica = this.verRutaCritica.bind(this);

        this.controlDtMapas = $(this.dtMapas.nativeElement).DataTable(optMapas);
    }

    eliminar(id) {
        this.mapaService.eliminar(id).subscribe((data) => {
            if (data.json()) {
                this.controlDtMapas.ajax.reload();
            }
            toast({
                type: 'success',
                title: 'Mapa eliminado con éxito'
            })
        }, error => {
            toast({
                type: 'error',
                title: 'Ocurrió un error en el servidor, inténtelo mas tarde'
            })
        });
    }

    ver(id) {
        this._ngZone.run(() => {
            this.router.navigate(['/mapa/' + id]);
        });
    }

    verEmergencia(id) {
        this._ngZone.run(() => {
            this.router.navigate(['/emergencia/' + id]);
        });
    }

    verRutaCritica(id) {
        this._ngZone.run(() => {
            this.router.navigate(['/ruta-critica/' + id]);
        });
    }

    nuevo() {
        this._ngZone.run(() => {
            this.router.navigate(['/mapa/0']);
        });
    }
}