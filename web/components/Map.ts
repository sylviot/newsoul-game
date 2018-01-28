import * as THREE from "three"

import { Element } from './Element'
import { IScene, IElement } from "./Interface";

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
  // private textures: any
  // private teleports: Array<any>

  constructor(public game: IScene){
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
    name.style.textShadow = '1px 1px 1px black'
    name.style.width = '300px'
    name.style.height = '30px'
    name.style.position = 'fixed'
    name.style.top = '5%'
    name.style.left = '50%'
    name.style.marginLeft = '-150px'

    name.textContent = "<< "+this._name+" >>"

    document.body.appendChild(name)
    setTimeout(() =>{
      name.style.opacity = '0.3'
      name.remove()
    }, 3000)
  }

  update(_delta): void {
    this._elements.forEach(element => {
      element.update(_delta)
    });
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
  
  applyCollision(_element: IElement): void { }
  applyGravity(_acceleration: any): any { 
    _acceleration.y -= 3.5;
    
    return _acceleration;
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