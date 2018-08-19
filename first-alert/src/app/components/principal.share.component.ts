import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'principal-share-root',
  templateUrl: 'principal.share.component.html',
  styleUrls: ['./principal.share.component.css']
})
export class PrincipalShareComponent implements AfterViewInit, OnInit {
  /** Template reference to the canvas element */
  @ViewChild('image_canvas') myCanvas: ElementRef;

  /** Canvas 2d context */
  //private context: CanvasRenderingContext2D;

  context: CanvasRenderingContext2D;
  //private context: CanvasRenderingContext2D;
  private element: HTMLImageElement;

  src: string = './assets/imagen.png';

  startX: number = null;
  startY: number = null;
  drag = false;
  puntos: any[] = [];
  punto: any = {};


  mdEvent(e) {
    /*
    //persist starting position
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.drag = true;
    */
  }

  mmEvent(e) {

    //this.addOnClick(e);
    /*
        if (this.drag) {
    
          //redraw image on canvas
          let base_image = new Image();
          base_image.src = this.src;//'https://ak3.picdn.net/shutterstock/videos/10826363/thumb/1.jpg';
          let context: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext("2d");
          base_image.onload = function () {
            context.canvas.height = 400;//base_image.height;
            context.canvas.width = 400;//base_image.width;
            context.drawImage(base_image, 0, 0);
          };
    
          //draw rectangle on canvas
          let x = this.startX - this.myCanvas.nativeElement.getBoundingClientRect().left;
          let y = this.startY - this.myCanvas.nativeElement.getBoundingClientRect().top;
          let w = e.clientX - this.myCanvas.nativeElement.getBoundingClientRect().left - x;
          let h = e.clientY - this.myCanvas.nativeElement.getBoundingClientRect().top - y;
          context.setLineDash([6]);
          context.strokeRect(x, y, w, h);
        }
        */
  }

  muEvent(e) {
    /*
    //draw final rectangle on canvas
    let x = this.startX - this.myCanvas.nativeElement.getBoundingClientRect().left;
    let y = this.startY - this.myCanvas.nativeElement.getBoundingClientRect().top;
    let w = e.clientX - this.myCanvas.nativeElement.getBoundingClientRect().left - x;
    let h = e.clientY - this.myCanvas.nativeElement.getBoundingClientRect().top - y;
    this.myCanvas.nativeElement.getContext("2d").setLineDash([6]);
    this.myCanvas.nativeElement.getContext("2d").strokeRect(x, y, w, h);

    this.drag = false;
    */
  }


  constructor() { }


  limpiarLinea() {
    //this.puntos = [];
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.needFirstPoint=true;
    //this.context.stroke();
/*
    for(let punto of this.puntos){
      this.context.clearRect(punto.x, punto.y, this.context.canvas.width, this.context.canvas.height);
    }*/
    this.puntos = [];
  }

  guardarPuntos() {
    console.log(JSON.stringify(this.puntos));
  }


  needFirstPoint: boolean = true;
  addOnClick(event) {
    var x = event.x;
    var y = event.y;
    var offsetX = event.offsetX;//event.x;
    var offsetY = event.offsetY;//event.y;
    //var offsetX = event.offsetX;
    //var offsetY = event.offsetY;
    this.contruirLinea(offsetX, offsetY, x, y);

    /*
        this.context.beginPath();
        this.context.lineTo(offsetX, offsetY);
        //this.context.moveTo(100, 150);
        this.context.lineTo(offsetX+5, offsetY+5);
        this.context.stroke();
        this.context.fill();
    */
    //</script>
    //console.log(x, y, offsetX, offsetY);
  };

  contruirLinea(x, y, offsetX, offsetY) {

    if (this.needFirstPoint) {
      this.context.strokeStyle = 'purple';
      this.context.lineCap = 'round';
      this.context.lineWidth = 5;
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.arc(x, y, 4, 4, 12 * Math.PI, false);
      this.context.fillText('Punto 0', x + 10, y + 10);
      this.context.stroke();
      //this.context.fillRect(10,10,1,1);
      this.needFirstPoint = false;
    }
    else {
      this.context.fillText('Punto 1', x + 10, y + 10);
      this.context.arc(x, y, 4, 4, 12 * Math.PI, false);
      //this.context.arc(2, 1, 1, 0, 2 * Math.PI, true);
      //this.context.stroke();
      this.context.lineTo(x, y);
      this.context.stroke();
    }
    this.punto = { x: x, y: y, offsetX: offsetX, offsetY: offsetY };
    this.puntos.push(this.punto);
  }

  ngOnInit() {
    this.context = this.myCanvas.nativeElement.getContext("2d");
    
    this.puntos = [];
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    //draw image on canvas
    let img = new Image();
    img.src = this.src;//'https://ak3.picdn.net/shutterstock/videos/10826363/thumb/1.jpg';
    //let context = this.context;
    /*
        var scale = Math.min((200 / img.width), (200 / img.height));
        img.width = img.width * scale;
        img.height = img.height * scale;*/
    //clearCanvas();


    img.onload = function () {
      //base_image.height = 400;
      //base_image.width = 400;
      //context.canvas.height = 400;//base_image.height;
      //context.canvas.width = 1000;//base_image.width;

      //context.drawImage(img, 0, 0);


      //context.drawImage(base_image, 0, 0);
    }




  }

  contruirPuntos() {


    this.contruirLinea(144, 65, 394, 131);
    this.contruirLinea(219, 148, 469, 214);
    this.contruirLinea(306, 222, 556, 288);
  }
  ngAfterViewInit() {
  }

  /**
   * Draws something using the context we obtained earlier on
   */
  private draw() {
    /*
        var canvas: HTMLCanvasElement = document.getElementById("image_canvas") as HTMLCanvasElement;
        var context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
        var image: HTMLImageElement = document.getElementById('image') as HTMLImageElement;
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
    
    
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(300, 150);
        this.context.stroke();
        */
  }
}
