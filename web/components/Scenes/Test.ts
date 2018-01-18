import * as THREE from 'three'

import { IScene } from '../Interface'
import { Main } from '../Main';

export class TestScene implements IScene
{

  public camera: any
  public clock: THREE.Clock
  public renderer: any
  public scene: any

  _uniforms: any

  elements: Array<any>
  boxs: Array<any>

  constructor(public _main: Main) {
    this.elements = new Array<any>();
    this.boxs = new Array<any>();

    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    // this.camera = new THREE.PerspectiveCamera(65, window.devicePixelRatio, 0.1, 2000)

    this.camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 100);
    this.renderer = new THREE.WebGLRenderer({antialias: false})//, preserveDrawingBuffer: true})
    this.renderer.setClearColor(0x000, 1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)


    this._uniforms = {
      time: { type: 'f', value: 1.0}
    }

    for(var i=0; i < 1000; i++) {
      this.elements.push(this.createCircle());
      this.scene.add(this.elements[i]);
    }
    let WIDTH = 30;
    let HEIGHT = 30;

    for(var w=0;w<(window.innerWidth/WIDTH);w++) {
      for(var h=0;h<(window.innerHeight/HEIGHT);h++) {
        this.createTile(w*WIDTH-window.innerWidth/2,h*HEIGHT-window.innerHeight/2,WIDTH, HEIGHT, -1)
      }
    }

    for(var i=0; i < 10; i++) {
      this.boxs.push({x: i*WIDTH-500, y: 0})
      this.createTile(i*WIDTH-500,0,WIDTH,HEIGHT, Math.abs(i%4));
    }

    for(var i=0; i < 10; i++) {
      this.boxs.push({x: i*WIDTH, y: 0})
      this.createTile(i*WIDTH,0,WIDTH,HEIGHT, Math.abs(i%4));
    }

    this.camera.position.set(0,0,10)
  }

  _keyboadEvent(hotkey: string) {
    throw new Error("Method not implemented.");
  }
  _mouseEvent(hotkey: string) {
    throw new Error("Method not implemented.");
  }
  tryLoadTexture(_name: string) {
    throw new Error("Method not implemented.");
  }

  public createCircle() {
    var geometry = new THREE.CircleGeometry(2, 32)
    var material = new THREE.MeshBasicMaterial({color: 0xffff00})
    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: document.getElementById('verterShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    })
    shaderMaterial.depthTest = false
    var circle = new THREE.Mesh(geometry, shaderMaterial)
    circle.position.set(
      (Math.random() * window.innerWidth - window.innerWidth/2), 
      100,
      // (Math.random() * window.innerHeight - window.innerHeight/2),
       1
    )
    circle.velocity = {}
    let v = 7;
    circle.velocity.x = Math.random() * v
    circle.velocity.y = Math.random() * v

    return circle
  }

  public createLine(x0, y0, x1, y1){
    var line = new THREE.Geometry()
    line.vertices.push(new THREE.Vector3(x0, y0, 0))
    line.vertices.push(new THREE.Vector3(x1, y1, 0))
    var lineLine = new THREE.Line(
      line, 
      new THREE.LineBasicMaterial({color: 0x3dc0d3})
    )
    this.scene.add(lineLine)
  }

  public createTile(x, y, w, h, p) {
    var box = new THREE.Geometry()
    
    box.vertices.push(
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x+w, y, 0),
      new THREE.Vector3(x+w, y+h, 0),
      new THREE.Vector3(x, y+h, 0),
      new THREE.Vector3(x, y, 0),
    )

    if(p >= 0) {
      var form = [
        [new THREE.Vector3(x, y+h, 0), new THREE.Vector3(x+w, y+h, 0)],
        [new THREE.Vector3(x, y+h, 0), new THREE.Vector3(x+w, y, 0)],
        [new THREE.Vector3(x, y, 0), new THREE.Vector3(x+w, y, 0)],
        [new THREE.Vector3(x, y, 0), new THREE.Vector3(x+w, y+h, 0)],
      ]
      
      
      var line = new THREE.Geometry()
      line.vertices.push(form[p][0])
      line.vertices.push(form[p][1])
      var lineLine = new THREE.Line(
        line, 
        new THREE.LineBasicMaterial({color: 0x3dc0d3})
      )

      this.scene.add(lineLine)
    }


    var boxLine = new THREE.Line(
      box,
      new THREE.LineBasicMaterial({color: 0x00ff00, opacity: 0.1, transparent: true})
    )
    this.scene.add(boxLine)
  }

  collision(x1, y1, r) {
    let w = 30
    for(let box of this.boxs) {
      if( (x1+r/2 < box.x || x1 > box.x+w) || (y1+r/2 < box.y || y1 > box.y+w) )
        continue

      return true
    }

    return false
  }

  public update(): void {
    let v = 0.8
    this._uniforms.time.value = this.clock.getElapsedTime()

    this.elements.forEach((item: THREE.Mesh) => {
      item.position.x -= item.velocity.x
      item.position.y += item.velocity.y

      if(item.position.x < -window.innerWidth/2 || item.position.x > window.innerWidth/2) {
        // this.createLine(item.position.x, item.position.y, item.position.x + 1, item.position.y)
        // item.material = new THREE.MeshBasicMaterial({color: 0x3dc0de})        
        item.velocity.x *= -1;
      }

      if(
        (item.position.y < -window.innerHeight/2 || item.position.y > window.innerHeight/2)  ||
         this.collision(item.position.x, item.position.y, 3) ) {
        // this.createLine(item.position.x, item.position.y, item.position.x + 1, item.position.y)
        // item.material = new THREE.MeshBasicMaterial({color: 0x3dc0de})        

        item.velocity.y *= -1;        
      }

    })
  }

  public render(): void {
  }
  down(): void {
    throw new Error("Method not implemented.");
  }
  up(): void {
    throw new Error("Method not implemented.");
  }
}