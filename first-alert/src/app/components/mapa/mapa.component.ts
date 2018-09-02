import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

declare var vis: any;

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
  pathFoto: any;


  controlDtNodos: any;
  @ViewChild('dtNodos') dtNodos: ElementRef;

  controlDtCaminos: any;
  @ViewChild('dtCaminos') dtCaminos: ElementRef;

  mapa: any = { nombre: '', descripcion: '' };



  id: string = '0';


  constructor(private router: Router,
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private mapaService: MapaService,
    private sanitizer: DomSanitizer) {
    this.route.params.subscribe(parametros => {
      this.id = parametros['id'];
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
          title: "#",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          width: '5%'
        }, {
          title: 'Nombre',
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
            var btn = '<div style="text-align:center;"><button type="button" class="btn btn-primary btn-sm"'
            btn += 'onclick="functions.editar(' + row.id + ')">'
            btn += '<i class="fa fa-edit"></i>'
            btn += '</button></div>';
            return btn;
          },
          width: '5%'
        }, {
          title: "",
          render: function (data, type, row, meta) {
            var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
            btn += 'onclick="functions.eliminar(' + row.id + ')">'
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




    //window.functions.editar = this.ver.bind(this);
    //window.functions.eliminar = this.eliminar.bind(this);

    this.controlDtNodos = $(this.dtNodos.nativeElement).DataTable(optNodos);
  }

  contruirDataTableCaminos() {
    let optCaminos: any = {
      columns: [{
        title: "#",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
        width: '5%'
      }, {
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
          btn += 'onclick="functions.editar(' + row.id + ')">'
          btn += '<i class="fa fa-edit"></i>'
          btn += '</button></div>';
          return btn;
        },
        width: '5%'
      }, {
        title: "",
        render: function (data, type, row, meta) {
          var btn = '<div style="text-align:center;"><button type="button" class="btn btn-danger btn-sm"'
          btn += 'onclick="functions.eliminar(' + row.id + ')">'
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

    //window.functions.editar = this.ver.bind(this);
    //window.functions.eliminar = this.eliminar.bind(this);

    this.controlDtCaminos = $(this.dtCaminos.nativeElement).DataTable(optCaminos);
  }

  contruirMapa() {
    /*
    this.nodes.add([
      { id: 1, label: 'x=200, y=200', x: 200, y: 200 },
      { id: 2, label: 'node 2', x: 0, y: 0 },
      { id: 3, label: 'node 3', x: 0, y: 400 },
      { id: 4, label: 'node 4', x: 400, y: 400 },
      { id: 5, label: 'node 5', x: 400, y: 0 }
    ]);

    this.edges.add([
      { from: 1, to: 2, label: 'to x=0, y=0', font: { color: 'blue' } },
      { from: 1, to: 3, label: 'to x=0, y=400', font: { color: 'blue' } },
      { from: 1, to: 4, label: 'to x=400, y=400', font: { color: 'blue' } },
      { from: 1, to: 5, label: 'to x=400, y=0', font: { color: 'blue' } }
    ]);*/

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
      clickToUse: true,

      physics: {
        enabled: false,     // Stops node movement during display
        stabilization: {    // Determines an initial layout; enabled by default
          enabled: false,
          iterations: 1000
        }
      },      // defined in the physics module.
    };

    this.network = new vis.Network(container, data);

    this.network.setOptions(options);

    this.network.on('click', function (properties) {
      console.log(properties);
      //var ids = properties.nodes;
      //var clickedNodes = this.nodes.get(ids);
      //console.log('clicked nodes:', clickedNodes);
    });
  }

  agregarNodo() {
    try {
      let nodo = { id: this.contNodo, label: 'x=200, y=200', x: 50, y: 100 };
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
    console.log(seleccionados);
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

  backgroundImg: SafeStyle;
  leerPath(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.pathFoto = (<FileReader>event.target).result;
        this.backgroundImg = 'url(' + this.pathFoto + ')';
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  guardarMapa() {

  }
}
