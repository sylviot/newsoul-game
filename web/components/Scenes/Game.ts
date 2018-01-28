import * as THREE from "three"

import { Camera } from '../Camera'
import { Control } from '../Control'
import { Main, lerp } from '../Main'
import { Map } from '../Map'
import { Player } from '../Player'

import { IScene } from '../Interface'

const RESOURCES_PATH = './resources/'

export class GameScene implements IScene
{

  protected elements: any
  protected map: Map
  protected player: Player

  private players: any
  
  public camera: any
  public clock: THREE.Clock
  public control: Control
  public resources: Array<any>
  public scene: any

  
  constructor(public _main: Main) {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 100)


    let that = this

    let hotkeys = [
      { action:'LEFT', code: 65},
      { action:'DOWN', code: 83},
      { action:'RIGHT', code: 68},
      { action:'UP', code: 87},
      { action:'SPACE', code: 32},
    ]

    let info = {
      name: '[ADM] SylvioT',
      position: { x: 900, y: 320  },
      velocity: 1.45,
      level: 1,
      experience: 1,
      attributes: {
        str: 1,
        agi: 1,
        vit: 1,
        dex: 1,
      }
    }

    let data = {
      map: {
        name: 'Map 1',
        width: 100,
        height: 100,
        materials: [
          {name: 'tile_0', sprite: 'tiles/tile_0.png', width: 35, height: 35},
          {name: 'bg_0', sprite: 'backgrounds/bg_0.png', width: 700, height: 200},
          {name: 'bg_hill_0', sprite: 'backgrounds/hill.png', width: 1200, height: 610},
          {name: 'pillar', sprite: 'backgrounds/pillar.png', width: 361, height: 593},
          {name: 'crystal', sprite: 'backgrounds/crystal.png', width: 361, height: 593},
        ],
        elements: [
          {type: 'tile', material: 'tile_0', x: 0, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 35, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 70, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 105, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 140, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 175, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 210, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 245, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 280, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 315, y: 0, z: -1},
          {type: 'fixed', material: 'pillar', x: 900, y: 169, z: -1},
          {type: 'fixed', material: 'crystal', x: 900, y: 480, z: -1},
          {type: 'background', material: 'bg_0', x: 0, y: -600, z: -3},
          {type: 'background', material: 'bg_0', x: 0, y: 0, z: -3},
          {type: 'background', material: 'bg_0', x: 0, y: 600, z: -3},
          {type: 'background', material: 'bg_0', x: 1200, y: -400, z: -3},
          {type: 'background', material: 'bg_0', x: 1200, y: 200, z: -3},
          {type: 'background', material: 'bg_0', x: 1200, y: 800, z: -3},
          {type: 'background', material: 'bg_hill_0', x: 300, y: 132, z: -2},
          {type: 'background', material: 'bg_hill_0', x: 1500, y: 200, z: -2},
        ],
        collisions: [
          /* platforms */
          {x:140,y:140},
          {x:175,y:140},
          {x:210,y:140},
          {x:245,y:140},

          {x:385,y:245},
          {x:420,y:245},
          {x:455,y:245},
          {x:490,y:245},

          {x:630,y:140},
          {x:665,y:140},
          {x:700,y:140},
          {x:735,y:140},

          {x:1015,y:140},
          {x:1050,y:140},
          {x:1085,y:140},
          {x:1120,y:140},
        ]
      },
      camera: {
        position: { x: 0, y: 0, z: 10 }
      },
    }

    for(let i=0;i<10*4;i++) {
      data.map.collisions.push({x:35*i, y:0})
    }

    for(let i=0;i<10;i++) {
      data.map.collisions.push({x:0, y:i*35})
      data.map.collisions.push({x:1400, y:i*35})
    }

    this.resources = new Array<any>()
    this.control = new Control(this)
    this.control.loadDefaultHotkeys(hotkeys)

    this.player = new Player(this)
    this.player.loadData(info)
    this.scene.add(this.player.mesh)

    this._main.network.send({
      action: 'load_character', 
      character_id: 'Player-' + ~~(Math.random() * 999999)
    })

    this.players = [];
    
    this._main.network.hook('join', (_data) => {
      this.players[_data.nickname] = new Player(this)
      this.players[_data.nickname].loadData({
        name: _data.nickname,
        position: { x: 900, y: 320  }
      })
      
      this.scene.add(this.players[_data.nickname].mesh)
      console.log(_data, this.scene)
    })

    this._main.network.hook('movement', (_data) => {
      if(this.players[_data.nickname])
        this.players[_data.nickname].updatePosition(_data.x, _data.y)
    })
    
    data.map.materials.forEach(item => {
      this.tryLoadTexture(item.name, item.sprite)
    });
    
    this.map = new Map(this);
    this.map.build(data.map)
    
    this.camera.position.x = data.camera.position.x
    this.camera.position.y = data.camera.position.y
    this.camera.position.z = data.camera.position.z
  }
    
  render(): void {
  }

  velocityV: number = 0
  velocityH: number = 0

  update(): void { 
    let delta = this.clock.getDelta()

    this.map.update(delta)
    this.player.update(delta)

    for(let id in this.players) {
      this.players[id].update(delta)
    }

    // ToDo - Camera following IElement
    this.camera.position.x = lerp(this.camera.position.x, this.player.x, 0.07)
    this.camera.position.y = lerp(this.camera.position.y, this.player.y, 0.07)


    // ToDo - check if element is grounded nor collision (wrong)
    if( this.map.hasCollision(this.player, {x:0, y: this.velocityV}) ) {
      this.velocityV = -this.map.gravity * delta

      if (this.control.isPressed('SPACE')) 
        { this.velocityV = this.player.jumpForce }
      
    } 
    else {
      this.velocityV -= this.map.gravity * delta
    }

    if (this.control.isPressed('LEFT'))
      this.velocityH = this.player.moveLEFT().x

    if (this.control.isPressed('RIGHT'))
      this.velocityH = this.player.moveRIGHT().x

    if( ! this.map.hasCollision(this.player, {x:0, y:this.velocityV}) ) {
      this.player.move('JUMP', {x:0, y:this.velocityV} )
    }

    if( ! this.map.hasCollision(this.player, {x:this.velocityH, y:0}) ) {
      this.player.move('MOVE', {x:this.velocityH, y:0} )
      this.velocityH = 0
    }

    this._main.network.send({
      action: 'movement',
      x: this.player.x,
      y: this.player.y
    })
  }
  
  down(): void {
    console.log('down')
  }
  up(): void {
    console.log('up')    
  }
  
  /* EVENTS */
  /* ToDo - need adjust keyboard/mouse event */
  _keyboadEvent(_hotkey: string) {  }
  _mouseEvent(_event) {  }

  /* RESOURCES METHODS */
  tryLoadTexture(_name: string, _sprite: string = '') {
    if(!this.resources[_name]) {
      let texture = THREE.ImageUtils.loadTexture(`${RESOURCES_PATH}${_sprite}`);
      texture.minFilter = THREE.LinearFilter;
      
      this.resources[_name] = texture;      
    }

    return this.resources[_name]
  }
}