import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var vis: any;
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  type: 'warning',
  showConfirmButton: false,
  timer: 3000
});



@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html'
})
export class MapaComponent implements OnInit {
  nodes: any = new vis.DataSet();
  edges: any = new vis.DataSet();
  network: any;
  contNodo: number = 1;
  contCamino: number = 1;
  backgroundImg: SafeStyle;
  modalRef: BsModalRef;
  codigoTmp: any = "";
  numeroTmp: any = 0;
  objetivoTmp: any = false;
  Math: any;

  @ViewChild('tplNodo') private tplNodo;

  controlDtNodos: any;
  @ViewChild('dtNodos') dtNodos: ElementRef;

  controlDtCaminos: any;
  @ViewChild('dtCaminos') dtCaminos: ElementRef;

  mapa: any = { idCompanhia: 1, nuevoPath: false, path: '', contentPath: '', nombre: '-', descripcion: '--' };



  id: string = '0';


  constructor(private router: Router,
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private mapaService: MapaService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) {
    this.Math = Math;
    this.route.params.subscribe(parametros => {
      this.id = parametros['id'];
      if (this.id !== '0') {
        this.mapaService.buscar(this.id).subscribe((data) => {
          this.mapa = data.json();
          console.log(this.mapa);
          this.backgroundImg = 'url(' + this.mapaService.contruirPathImagen(this.mapa.path) + ')';

          for (let nodo of this.mapa.nodos) {
            this.contNodo = nodo.numero;
            let nodoTmp = { id: nodo.numero, label: nodo.codigo, x: nodo.x, y: nodo.y, color: '#D2E5FF' };
            this.nodes.add(nodoTmp);
            this.controlDtNodos.row.add(nodo).draw();
          }
          this.contNodo++;

          for (let camino of this.mapa.caminos) {
            this.contCamino = camino.numero;
            let caminoTmp = { id: camino.numero, from: camino.numeroNodoInicio, to: camino.numeroNodoFin, label: camino.peso.toString(), font: { color: 'blue' } };
            this.edges.add(caminoTmp);
            this.controlDtCaminos.row.add(camino).draw();
          }
          this.contCamino++;

          this.contruirMapa();

        }, error => {
          console.error(error);
        })
      }
    });
  }



  ngOnInit() {
    this.contruirMapa();
    this.contruirDataTableNodos();
    this.contruirDataTableCaminos();
  }

  draw() {

  }

  ngAfterViewInit() {
  }

  contruirDataTableNodos() {
    let optNodos: any = {
      columns: [
        {
          title: '',
          defaultContent: '',
          className: 'select-checkbox',
          width: '5%',
          targets: 0
        }, {
          title: 'BL',
          data: 'codigo',
          width: 'auto'
        }, {
          title: 'X',
          data: 'x',
          visible: false
        }, {
          title: 'Y',
          data: 'y',
          visible: false
        }, {
          title: "Objectivo",
          render: function (data, type, row, meta) {
            var txt = (row.objetivo ? "Si" : "No")
            return txt;
          },
          width: '5%'
        }, {
          title: "",
          render: function (data, type, row, meta) {
            var btn = '<div style="text-align:center;"><button type="button" class="btn btn-primary btn-sm"'
            btn += 'onclick="functions.editarNodo(' + row.numero;
            btn += ",'" + row.codigo + "'";
            btn += "," + row.objetivo
            btn += ')">';
            btn += '<i class="fa fa-edit"></i>'
            btn += '</button></div>';
            return btn;
          },
          width: '5%'
        }, {
          title: "",
          render: function (data, type, row, meta) {
            var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
            btn += 'onclick="functions.eliminarNodo(' + row.numero + ')">'
            btn += '<i class="fa fa-trash-o"></i>'
            btn += '</button></div>';
            return btn;
          },
          width: '5%'
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

    window.functions = window.functions || {};

    window.functions.editarNodo = this.editarNodo.bind(this);
    window.functions.eliminarNodo = this.eliminarNodo.bind(this);
    //window.functions.editar = this.ver.bind(this);
    //window.functions.eliminar = this.eliminar.bind(this);

    this.controlDtNodos = $(this.dtNodos.nativeElement).DataTable(optNodos);
  }
  eliminarNodo(numero) {
    this.nodes.remove({ id: numero });
    let nodos = this.controlDtNodos.rows().data();
    let cont = 0;
    for (let nodoTmp of nodos) {
      if (nodoTmp.numero === numero) {
        this.controlDtNodos.row(cont).remove().draw();
        break;
      }
      cont++;
    }
  }

  editarNodo(numero, codigo, objetivo) {
    this.modalRef = this.modalService.show(this.tplNodo, { class: 'modal-sm' });
    this.numeroTmp = numero;
    this.codigoTmp = codigo;
    this.objetivoTmp = objetivo;
  }

  guardarNodo() {
    let nodos = this.controlDtNodos.rows().data();
    let cont = 0;
    for (let nodoTmp of nodos) {
      if (nodoTmp.numero === this.numeroTmp) {
        nodoTmp.codigo = this.codigoTmp;
        nodoTmp.objetivo = this.objetivoTmp;
        this.controlDtNodos.row(cont).data(nodoTmp).draw();
        break;
      }
      cont++;
    }
    this.modalRef.hide();
  }

  guardarCamino() {
    /*
    let caminos = this.controlDtCaminos.rows().data();
    let cont = 0;
    for (let camino of caminos) {
      if (camino.numero === this.numeroTmp) {
        camino.peso = this.pesoTmp;
        this.edges.update({
          id: camino.numero,
          idfrom: camino.numeroNodoInicio,
          to: camino.numeroNodoFin,
          label: camino.peso.toString()
        });
        this.controlDtCaminos.row(cont).data(camino).draw();
        break;
      }
      cont++;
    }
    this.modalRef.hide();*/
  }

  eliminarCamino(numero) {
    this.edges.remove({ id: numero });
    let caminos = this.controlDtCaminos.rows().data();
    let cont = 0;
    for (let camino of caminos) {
      if (camino.numero === numero) {
        this.controlDtCaminos.row(cont).remove().draw();
        break;
      }
      cont++;
    }
  }

  contruirDataTableCaminos() {
    let optCaminos: any = {
      columns: [{
        title: 'BL Inicio',
        data: 'codigoNodoInicio',
        width: '35%'
      }, {
        title: 'BL Fin',
        data: 'codigoNodoFin',
        width: '35%'
      }, {
        title: 'Peso',
        data: 'peso',
        width: '35%'
      }, {
        title: "",
        render: function (data, type, row, meta) {
          var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
          btn += 'onclick="functions.eliminarCamino(' + row.numero + ')">'
          btn += '<i class="fa fa-trash-o"></i>'
          btn += '</button></div>';
          return btn;
        },
        width: '5%'
      }],
      paging: false,
      bFilter: false,
      bSearchable: false,
      bInfo: false,
      select: false,
      bSort: false,
      responsive: true,
      pageLength: 5,
      language: { url: "./assets/Spanish.js" },
      dom: 'Bfrtip',
      buttons: []
    };

    window.functions = window.functions || {};

    window.functions.eliminarCamino = this.eliminarCamino.bind(this);

    this.controlDtCaminos = $(this.dtCaminos.nativeElement).DataTable(optCaminos);
  }

  contruirMapa() {
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
        zoomView: false
      }
    };

    this.network = new vis.Network(container, data);
    this.network.setOptions(options);

    /*this.network.on('click', function (properties) {
      console.log(properties);
      //var ids = properties.nodes;
      //var clickedNodes = this.nodes.get(ids);
      //console.log('clicked nodes:', clickedNodes);
    });*/

    this.network.on("dragging", function (params) {
      params.event = "[original event]";
      //console.log(params.pointer.DOM);
      //console.log(JSON.stringify(params, null, 4));
      window.functions.cambiarPosicionNodo(params.pointer.canvas, params.nodes[0]);

    });


    window.functions = window.functions || {};

    window.functions.cambiarPosicionNodo = this.cambiarPosicionNodo.bind(this);
  }

  buscarNodoPorNumero(numero) {
    let nodos = this.controlDtNodos.rows().data();
    for (let nodo of nodos) {
      if (nodo.numero === numero) {
        return nodo;
      }
    }
  }

  cambiarPosicionNodo(puntos, numero) {
    let nodos = this.controlDtNodos.rows().data();
    let cont = 0;
    for (let nodoTmp of nodos) {
      if (nodoTmp.numero === numero) {
        nodoTmp.x = puntos.x;
        nodoTmp.y = puntos.y;
        this.controlDtNodos.row(cont).data(nodoTmp).draw();
        break;
      }
      cont++;
    }

    let caminos = this.controlDtCaminos.rows().data();
    cont = 0;
    for (let camino of caminos) {
      if (camino.numeroNodoInicio === numero || camino.numeroNodoFin === numero) {
        let nodoInicio: any = this.buscarNodoPorNumero(camino.numeroNodoInicio);
        let nodoFin: any = this.buscarNodoPorNumero(camino.numeroNodoFin);
        camino.peso = (this.Math.abs(nodoInicio.x - nodoFin.x) + this.Math.abs(nodoInicio.y - nodoFin.y)) * 2;
        this.edges.update({
          id: camino.numero,
          idfrom: camino.numeroNodoInicio,
          to: camino.numeroNodoFin,
          label: camino.peso.toString()
        });
        this.controlDtCaminos.row(cont).data(camino).draw();
      }
      cont++;
    }
  }

  agregarNodo() {
    try {
      let codigo = 'BL' + this.contNodo.toString();
      let nodo = { id: 0, numero: this.contNodo, codigo: codigo, x: 0, y: 0, objetivo: false };
      let nodoVis = { id: nodo.numero, label: nodo.codigo, x: 0, y: 0, color: '#D2E5FF' };
      this.nodes.add(nodoVis);
      this.controlDtNodos.row.add(nodo).draw();
      this.contNodo++;
    }
    catch (err) {
      console.error(err);
    }
  }

  unirNodos() {
    let seleccionados = this.controlDtNodos.rows({ selected: true }).data();
    let cont = 0;
    let camino = { id: 0, numero: this.contCamino, numeroNodoInicio: 0, codigoNodoInicio: '', numeroNodoFin: 0, codigoNodoFin: '', peso: 0 };

    let nodoInicio: any;
    let nodoFin: any;

    for (let seleccionado of seleccionados) {
      if (cont === 0) {
        nodoInicio = seleccionado;
        cont++;
      } else {
        nodoFin = seleccionado;
      }
    }

    camino.numeroNodoInicio = nodoInicio.numero;
    camino.codigoNodoInicio = nodoInicio.codigo;

    camino.numeroNodoFin = nodoFin.numero;
    camino.codigoNodoFin = nodoFin.codigo;

    camino.peso = (this.Math.abs(nodoInicio.x - nodoFin.x) + this.Math.abs(nodoInicio.y - nodoFin.y)) * 2;

    let caminoVis = { id: camino.numero, from: camino.numeroNodoInicio, to: camino.numeroNodoFin, label: camino.peso.toString() };
    this.controlDtCaminos.row.add(camino).draw();
    this.edges.add(caminoVis);
    this.contCamino++;
  }

  leerPath(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.mapa.contentPath = (<FileReader>event.target).result;
        this.backgroundImg = 'url(' + this.mapa.contentPath + ')';
        this.mapa.nuevoPath = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  guardarMapa() {
    Swal({
      title: '¿Desea guardar el mapa?',
      //text: "¡No podras revertir esta acción!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check">&nbsp;</i>Confirmar',
      cancelButtonText: '<i class="fa fa-ban">&nbsp;</i>Cancelar'
    }).then((result) => {
      if (result.value) {
        let nodos = this.controlDtNodos.rows().data();
        let caminos = this.controlDtCaminos.rows().data();
        let nodosServer: any = [];
        let caminosServer: any = [];

        for (let nodoTmp of nodos) {
          nodosServer.push(nodoTmp);
        }

        for (let caminoTmp of caminos) {
          caminosServer.push(caminoTmp);
        }

        this.mapa.nodos = nodosServer;
        this.mapa.caminos = caminosServer;

        this.mapaService.guardar(this.mapa).subscribe((data) => {
          toast({
            type: 'success',
            title: 'Mapa guardada con éxito'
          })
        }, error => {
          toast({
            type: 'error',
            title: 'Ocurrió un error en el servidor, inténtelo mas tarde'
          })
        });
      }
    }
    );
  }
}
