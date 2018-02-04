import * as THREE from "three"

import { Chat } from '../Chat'
import { Camera } from '../Camera'
import { Control } from '../Control'
import { Main, lerp } from '../Main'
import { Map } from '../Map'
import { Player } from '../Player'

import { IScene } from '../Interface'
import { Network } from "../Network";

const RESOURCES_PATH = './resources/'

export class GameScene implements IScene
{

  protected elements: any
  protected map: Map
  protected player: Player

  private _dummyPlayers: Array<Player>
  
  public chat: Chat
  public camera: THREE.Camera
  public clock: THREE.Clock
  public control: Control
  public resources: Array<any>
  public scene: any

  
  constructor(public _main: Main) {
    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 100)
    this._dummyPlayers = new Array<Player>()


    let that = this

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
    this.chat = new Chat(this);
    this.control = new Control(this)

    this.player = new Player(this)
    this.player.loadData(info)

    this._main.network.send({
      action: 'load_character', 
      character_id: 'Player-' + ~~(Math.random() * 999999)
    })

    this._dummyPlayers = [];

    let addPlayer = data => {
      let player = this._dummyPlayers[data.nickname] = new Player(this)

      player.loadData({
        name: data.nickname,
        position: { x: 900, y: 320  }
      })
      
      this.scene.add(player.mesh)
      this.map.addDummyPlayer(player)
    }
    
    this._main.network.hook('join', data => {
      let player = this._dummyPlayers[data.nickname] = new Player(this)

      player.loadData({
        name: data.nickname,
        position: { x: 900, y: 320  }
      })
      
      this.scene.add(player.mesh)
      this.map.addDummyPlayer(player)
    })

    this._main.network.hook('leave', _data => {
      this.map.removeDummyPLayer(this._dummyPlayers[_data.nickname])

      this._dummyPlayers[_data.nickname].remove()
    })

    this._main.network.hook('movement', data => {
      if(!this._dummyPlayers[data.nickname]) {
        addPlayer(data);
      }

        this._dummyPlayers[data.nickname].updatePosition(data.x, data.y)
    })
    
    data.map.materials.forEach(item => {
      this.tryLoadTexture(item.name, item.sprite)
    });
    
    this.map = new Map(this);
    this.map.addPlayer(this.player)
    this.map.build(data.map)
    
    this.camera.position.x = data.camera.position.x
    this.camera.position.y = data.camera.position.y
    this.camera.position.z = data.camera.position.z
  }
    
  render(): void {
  }

  update(): void { 
    let delta = this.clock.getDelta()

    this.map.update(delta)
    this.player.update(delta)

    for(let id in this._dummyPlayers) {
      this._dummyPlayers[id].update(delta)
    }

    // ToDo - Camera following IElement
    this.camera.position.x = lerp(this.camera.position.x, this.player.x, 0.07)
    this.camera.position.y = lerp(this.camera.position.y, this.player.y, 0.07)

    
    this._main.network.send({
      action: 'movement',
      x: this.player.x,
      y: this.player.y
    })
  }
  
  down(): void {
    console.log('down game')
  }
  up(): void {
    console.log('up GaME')
  }
  
  /* EVENTS */
  /* ToDo - need adjust keyboard/mouse event */
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
