// import * as THREE from "three"
import * as THREE from "./engines/three.min"

import { Camera } from './Camera'
import { Map } from './Map'
import { Player } from './Player'

const RESOURCES_PATH = './resources/'

export class Game
{
  protected elements: any
  protected map: Map
  protected player: Player
  
  public camera: any
  public renderer: any
  public resources: Array<any>
  public scene: any

  
  constructor(main: any) {
    console.log('GAME')
    
    this.scene = new THREE.Scene()
    // this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000)
    this.camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 100);
    this.renderer = new THREE.WebGLRenderer({antialias: false})//, preserveDrawingBuffer: true})

    this.renderer.setClearColor(0x000, 1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)
    var that = this    
    document.body.addEventListener('keydown', function(_event){ that.keyboardEvent(_event.keyCode) })
    document.body.addEventListener('mousemove', function(_event){ that.mouseEvent(_event) })


    this.resources = new Array<any>()
    this.map = new Map(this);
    this.player = new Player(this)


    let data = {
      map: {
        name: 'Map 1',
        width: 100,
        height: 100,
        materials: [
          {name: 'tile_0', sprite: 'tiles/tile_0.png', width: 35, height: 35},
          {name: 'bg_0', sprite: 'backgrounds/bg_0.png', width: 700, height: 200},
          {name: 'bg_hill_0', sprite: 'backgrounds/hill.png', width: 1200, height: 610},
        ],
        elements: [
          {type: 'tile', material: 'tile_0', x: 0, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 35, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 70, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 105, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 140, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 175, y: 0, z: -1},
          {type: 'background', material: 'bg_0', x: 0, y: 0, z: -3},
          {type: 'background', material: 'bg_hill_0', x: 450, y: -132, z: -2},
          {type: 'background', material: 'bg_hill_0', x: -750, y: -200, z: -2},
        ]
      },
      camera: {
        position: { x: 0, y: 0, z: 10 }
      },
    }

    data.map.materials.forEach(item => {
      this.tryLoadTexture(item.name, item.sprite)
    });
    this.map.build(data.map)
    this.camera.position.x = data.camera.position.x
    this.camera.position.y = data.camera.position.y
    this.camera.position.z = data.camera.position.z
  }
  
  /* Run method */
  run(): void {
    // ToDo - verificar elementos essenciais para rodar
    
  }
  
  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  update(): void { 
    this.map.update()
  }

  keyboardEvent(key) {
    console.log(key)
    
  }

  mouseEvent(_event) {
    this.map.elements.forEach(item =>{
      item.overlap(_event.screenX-window.innerWidth/2, _event.clientY-window.innerHeight/2)
    })
  }

  /* RESOURCES METHODS */
  tryLoadTexture(_name: string, _sprite: string = '') {
    if(!this.resources[_name]) {
      let texture = new THREE.ImageUtils.loadTexture(`${RESOURCES_PATH}${_sprite}`);
      texture.minFilter = THREE.LinearFilter;
      
      this.resources[_name] = texture;      
    }

    return this.resources[_name]
  }
}