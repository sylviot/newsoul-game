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
  
  public camera: any
  public clock: any
  public control: Control
  public resources: Array<any>
  public scene: any

  
  constructor(public _main: Main) {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 1, 100);

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
      position: { x: 36, y: 35  },
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
        ],
        elements: [
          {type: 'tile', material: 'tile_0', x: 0, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 35, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 70, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 105, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 140, y: 0, z: -1},
          {type: 'tile', material: 'tile_0', x: 175, y: 0, z: -1},
          {type: 'fixed', material: 'pillar', x: -255, y: 166, z: -1},
          {type: 'fixed', material: 'pillar', x: -85, y: 166, z: -1},
          {type: 'fixed', material: 'pillar', x: 85, y: 166, z: -1},
          {type: 'fixed', material: 'pillar', x: 255, y: 166, z: -1},
          {type: 'background', material: 'bg_0', x: 0, y: 0, z: -3},
          {type: 'background', material: 'bg_hill_0', x: 450, y: -132, z: -2},
          {type: 'background', material: 'bg_hill_0', x: -750, y: -200, z: -2},
        ],
        collisions: [
          {x: -35, y: 105},
          {x: -35, y: 70},
          {x: -35, y: 35},
          {x: -35, y: 0},
          // {x: 0, y: 0},
          // {x: 35, y: 0},
          // {x: 70, y: 0},
          // {x: 105, y: 0},
          {x: 140, y: 0},
        ]
      },
      camera: {
        position: { x: 0, y: 0, z: 10 }
      },
    }

    this.resources = new Array<any>()
    this.control = new Control(this)
    this.control.loadDefaultHotkeys(hotkeys)

    this.player = new Player(this)
    this.player.loadData(info)
    this.scene.add(this.player.mesh)
    
    data.map.materials.forEach(item => {
      this.tryLoadTexture(item.name, item.sprite)
    });
    
    this.map = new Map(this);
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
  }

  update(): void { 
    let delta = this.clock.getDelta()

    this.map.update(delta)
    this.player.update(delta)

    // ToDo - Camera following IElement
    this.camera.position.x = lerp(this.camera.position.x, this.player.x, 0.07)
  }
  
  down(): void {
    console.log('down')
  }
  up(): void {
    console.log('up')    
  }
  
  /* EVENTS */
  _keyboadEvent(_hotkey: string) {
    if (_hotkey == "LEFT" || _hotkey == "RIGHT")
      if(!this.map.collision(this.player.x, 0, this.player.width, this.player.height))
        this.player.move(_hotkey)
  }

  _mouseEvent(_event) {
    console.log(_event)
  }

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