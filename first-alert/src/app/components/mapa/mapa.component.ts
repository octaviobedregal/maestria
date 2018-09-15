import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2'

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
    private sanitizer: DomSanitizer) {
    this.route.params.subscribe(parametros => {
      this.id = parametros['id'];
      if (this.id !== '0') {
        this.mapaService.buscar(this.id).subscribe((data) => {
          console.log(data.json());
        }, error => {
          console.log(error);
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
          title: 'Nodo',
          data: 'label',
          width: '35%'
        }, {
          title: 'X',
          data: 'x',
          width: '35%'
        }, {
          title: 'Y',
          data: 'y',
          width: '35%'
        }, {
          title: "",
          render: function (data, type, row, meta) {
            var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
            btn += 'onclick="functions.eliminarNodo(' + row.id + ')">'
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
        style: 'multi',
        selector: 'td:first-child'
      },
      bSort: false,
      responsive: true,
      pageLength: 5,
      language: { url: "./assets/Spanish.js" },
      dom: 'Bfrtip',
      buttons: []
    };


    window.functions = window.functions || {};




    window.functions.eliminarNodo = this.eliminarNodo.bind(this);
    //window.functions.editar = this.ver.bind(this);
    //window.functions.eliminar = this.eliminar.bind(this);

    this.controlDtNodos = $(this.dtNodos.nativeElement).DataTable(optNodos);
  }
  eliminarNodo(id) {
    this.nodes.remove({ id: id });
    let nodos = this.controlDtNodos.rows().data();
    let cont = 0;
    for (let nodoTmp of nodos) {
      if (nodoTmp.id === id) {
        this.controlDtNodos.row(cont).remove().draw();
        break;
      }
      cont++;
    }
  }

  editarCamino(id, peso) {
    let caminos = this.controlDtCaminos.rows().data();
    console.log(caminos);
    let cont = 0;
    for (let camino of caminos) {
      if (camino.id === id) {
        camino.id = this.contCamino;
        camino.peso = peso;
        this.edges.update({
          id: this.contCamino,
          idfrom: camino.nodoFin,
          to: camino.nodoInicio,
          label: camino.peso.toString()
        });
        this.controlDtCaminos.row(cont).data(camino).draw();
        break;
      }
      cont++;
    }
  }

  eliminarCamino(idCamino) {
    this.edges.remove({ id: idCamino });
    let caminos = this.controlDtCaminos.rows().data();
    let cont = 0;
    for (let camino of caminos) {
      if (camino.id === idCamino) {
        this.controlDtCaminos.row(cont).remove().draw();
        break;
      }
      cont++;
    }
  }

  contruirDataTableCaminos() {
    let optCaminos: any = {
      columns: [{
        title: 'Nodo Inicio',
        data: 'labelInicio',
        width: '35%'
      }, {
        title: 'Nodo Fin',
        data: 'labelFin',
        width: '35%'
      }, {
        title: 'Peso',
        data: 'peso',
        width: '35%'
      }, {
        title: "",
        render: function (data, type, row, meta) {
          var btn = '<div style="text-align:center;"><button type="button" class="btn btn-primary btn-sm"'
          btn += 'onclick="functions.editarCamino(' + row.id + ',' + 5 + ')">'
          btn += '<i class="fa fa-edit"></i>'
          btn += '</button></div>';
          return btn;
        },
        width: '5%'
      }, {
        title: "",
        render: function (data, type, row, meta) {
          var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
          btn += 'onclick="functions.eliminarCamino(' + row.id + ')">'
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

    window.functions.editarCamino = this.editarCamino.bind(this);
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

  cambiarPosicionNodo(puntos, node) {
    let nodos = this.controlDtNodos.rows().data();
    let cont = 0;
    for (let nodoTmp of nodos) {
      if (nodoTmp.id === node) {
        nodoTmp.x = puntos.x;
        nodoTmp.y = puntos.y;
        this.controlDtNodos.row(cont).data(nodoTmp).draw();
        break;
      }
      cont++;
    }
  }

  agregarNodo() {
    try {
      let label = 'BL' + this.contNodo.toString();
      let nodo = { id: this.contNodo, label: label, x: 0, y: 0 };
      this.nodes.add(nodo);
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
    let camino = { id: 0, nodoInicio: 0, labelInicio: '', nodoFin: 0, labelFin: '', peso: 0 };
    //console.log(seleccionados);
    for (let seleccionado of seleccionados) {
      if (cont === 0) {
        camino.nodoInicio = seleccionado.id;
        camino.labelInicio = seleccionado.label;
        cont++;
      } else {
        camino.nodoFin = seleccionado.id;
        camino.labelFin = seleccionado.label;
      }
    }
    this.controlDtCaminos.row.add(camino).draw();
    this.edges.add({
      id: this.contCamino,
      from: camino.nodoFin,
      to: camino.nodoInicio,
      label: camino.peso.toString()
    });
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
          let nodoServerTmp: any = {};
          nodoServerTmp.numero = nodoTmp.id;
          nodoServerTmp.codigo = nodoTmp.label;
          nodoServerTmp.x = nodoTmp.x;
          nodoServerTmp.y = nodoTmp.y;
          nodosServer.push(nodoServerTmp);
        }

        for (let caminoTmp of caminos) {
          let caminoServerTmp: any = {};
          caminoServerTmp.idNodoFin = caminoTmp.nodoFin;
          caminoServerTmp.idNodoInicio = caminoTmp.nodoInicio;
          caminoServerTmp.peso = caminoTmp.peso;
          caminosServer.push(caminoServerTmp);
        }

        this.mapa.nodos = nodosServer;
        this.mapa.caminos = caminosServer;

        this.mapaService.insertar(this.mapa).subscribe((data) => {
          toast({
            type: 'success',
            title: 'Mapa guardada con éxito'
          })
        }, error => {
          toast({
            type: 'error',
            title: 'Ocurrió un error en el servidor, inténtelo mas tarde'
          })
        })
      }
    }
    );
  }
}
