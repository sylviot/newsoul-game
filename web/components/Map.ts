import * as THREE from "three"

import { Element } from './Element'
import { IScene, IElement } from "./Interface";
import { Player } from "./Player";
import { Parallax, ParallaxElement } from "./Parallax";

const RESOURCES_PATH = './resources/'

export class Map {

  private _name: string
  private _width: number
  private _height: number
  private _gravity: number = 18.0

  private _collisions: any
  private _elements: any
  // private enemies: Array<any>
  // private npcs: Array<any>
  private _player: Player
  private _dummyPlayers: Array<Player>
  // private textures: any
  // private teleports: Array<any>
  // public parallax: Parallax

  constructor(public game: IScene){
    this._dummyPlayers = new Array<Player>();
    // this.parallax = new Parallax(this);

    this._name = 'unknow map'
    this._width = 100
    this._height = 100
    this._gravity = 18.0
  }

  addPlayer(_player: Player): void {
    this._player = _player
  }

  addDummyPlayer(_dummyPlayer: Player): void {
    this._dummyPlayers[_dummyPlayer.name] = _dummyPlayer
  }

  removeDummyPLayer(_dummyPlayer: Player): void {
    delete this._dummyPlayers[_dummyPlayer.name]
  }

  build(_data: any): void {
    this._name = _data.name
    this._width = _data.width
    this._height = _data.height

    this._collisions = _data.collisions

    for(let item of _data.collisions) {
      let mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(35, 35),
        new THREE.MeshBasicMaterial({transparent: true, color: 0x0f0f0f})
      )
      
      mesh.position.set(item.x, item.y, 2)

      this.game.scene.add(mesh)
    }

    /** ADD Parallax */
    // let colors = [0x3dc0d3, 0x00ff00, 0x00ffff, 0xffff00]
    // let v = [0, -0.8, -0.5, 0.1]
    // let bgs = [3,3,3,3,3,3,3,3,2,1]
    // for(let i in bgs) {
    //   let texture = new THREE.TextureLoader().load('resources/parallax/bg_0'+bgs[i]+'.png')

    //   let mesh = (new THREE.Mesh(
    //     new THREE.PlaneGeometry(640, 480),
    //     new THREE.MeshBasicMaterial({map: texture, transparent: true})//, color: colors[i]})
    //   ));

    //   mesh.position.x = (bgs[i] == 3 ? 640 * i: 320);
    //   mesh.position.y = 170;
    //   mesh.position.z = bgs[i];

    //   let layer = new ParallaxElement( mesh );


    //   this.parallax.addLayer(layer);
    //   console.log('add bg parallax')
    // }

    this._elements = _data.elements.map((item) => {
      let element = new Element(this.game)
      element.loadData(item)
      
      this.game.scene.add(element.mesh)

      return element;
    })

    this.showName()
  }

  private showName(): void {
    let name = document.createElement('h1')
    name.style.color = 'white'
    name.style.fontFamily = 'Arial'
    name.style.textShadow = '1px 1px 3px red'
    name.style.width = '300px'
    name.style.height = '30px'
    name.style.position = 'fixed'
    name.style.top = '5%'
    name.style.left = '50%'
    name.style.marginLeft = '-150px'

    name.textContent = "<< "+this._name+" >>"

    document.body.appendChild(name)
    setTimeout(() =>{
      name.style.opacity = '0.7'
      name.style.opacity = '0.3'
      name.style.opacity = '0.1'
      name.remove()
    }, 3000)
  }

  update(_delta): void {
    this._elements.forEach(_element => {
      _element.update(_delta)
    });

    this._dummyPlayers.forEach(_dummyPlayer => {
      _dummyPlayer.update(_delta)
    })

    this.applyPlayerCollision(_delta)
    // this.parallax.update(_delta)
  }

  hasUpCollision(_element: IElement, _acceleration: any, tile: any, SIZE: number = 35): boolean {
    return _element.y+_acceleration.y-_element.height > tile.y
  }
  hasDownCollision(_element: IElement, _acceleration: any, tile: any, SIZE: number = 35): boolean {
    return _element.y+_acceleration.y < tile.y-SIZE
  }
  hasLeftCollision(_element: IElement, _acceleration: any, tile: any, SIZE: number = 35): boolean {
    return _element.x+_acceleration.x+_element.width  < tile.x
  }
  hasRightCollision(_element: IElement, _acceleration: any, tile: any, SIZE: number = 35): boolean {
    return _element.x+_acceleration.x > tile.x+SIZE
  }
  
  hasCollision(_element: IElement, _acceleration: any): boolean {
    let SIZE = 35
    
    for(let tile of this._collisions) {
      let up = this.hasUpCollision(_element, _acceleration, tile),
      down = this.hasDownCollision(_element, _acceleration, tile),
      left = this.hasLeftCollision(_element, _acceleration, tile),
      right = this.hasRightCollision(_element, _acceleration, tile)
      
      if( ! ((left || right) || (up || down)) ){
        return true
      }
    }
    
    return false
  }

  applyPlayerCollision(_delta: number): void {

    if ( this.hasCollision(this._player, this._player.vectorY) ) {
      this._player.velocityV = -this.gravity * _delta
      
      if (this.game.control.isPressed('SPACE')) 
        this._player.velocityV = this._player.jumpForce
      
    } 
    else {
      this._player.velocityV -= this.gravity * _delta
    }

    if (this.game.control.isPressed('LEFT'))
      this._player.velocityH = this._player.moveLEFT().x

    if (this.game.control.isPressed('RIGHT'))
      this._player.velocityH = this._player.moveRIGHT().x

    if ( ! this.hasCollision(this._player, this._player.vectorY) ) {
      this._player.move('JUMP', this._player.vectorY )
    }

    if ( ! this.hasCollision(this._player, this._player.vectorX) ) {
      this._player.move('MOVE', this._player.vectorX )
      this._player.velocityH = 0
    }

  }

  get elements() {
    return this._elements
  }
  get name() {
    return this._name
  }
  get gravity() {
    return this._gravity
  }
}