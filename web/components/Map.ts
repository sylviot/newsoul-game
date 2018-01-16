// import * as THREE from "three"
import * as THREE from "./engines/three.min"

import { Element } from './Element'
import { Game } from './Game'

const RESOURCES_PATH = './resources/'

export class Map {

  private _name: string
  private _width: number
  private _height: number

  private _collisions: any
  private _elements: any
  private enemies: Array<any>
  private npcs: Array<any>
  private textures: any
  private teleports: Array<any>
  
  constructor(public game: Game){
    
  }

  build(_data: any): void {
    this._name = _data.name
    this._width = _data.width
    this._height = _data.height

    this._collisions = _data.collisions

    for(let item of _data.collisions) {
      let mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(35, 35),
        new THREE.MeshBasicMaterial({transparecent: true, color: 0x00ff})
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
  }

  update(_delta): void {
    this._elements.forEach(element => {
      element.update(_delta)
    });
  }

  collision(_x: number, _y: number, _width: number, _height: number): boolean {
    let hasCollision = false

    this._collisions.forEach(item => {
      if((_x+_width/2) < (item.x-17.5) || (_x-_width/2) > (item.x+17.5))
        return
      else
        hasCollision = true
    })
    console.log(hasCollision)
    return hasCollision
  }

  get elements() {
    return this._elements
  }
  get name() {
    return this._name
  }
}