// import * as THREE from "three"
import * as THREE from "./engines/three.min"

import { Element } from './Element'
import { Game } from './Game'

const RESOURCES_PATH = './resources/'

export class Map {

  protected name: string
  protected width: number
  protected height: number

  private _elements: any
  private enemies: Array<any>
  private npcs: Array<any>
  private textures: any
  private teleports: Array<any>
  
  constructor(public game: Game){
    
  }

  build(_data: any): void {
    this.name = _data.name
    this.width = _data.width
    this.height = _data.height

    this._elements = _data.elements.map((item) => {
      let element = new Element(this.game, item)
      this.game.scene.add(element.mesh)

      return element;
    })
  }

  update(): void {
    this._elements.forEach((item, idx) => {
      // this.cubes[idx].rotation.x += item.rotation;
      // this.cubes[idx].rotation.y += item.rotation;  
    });
  }

  get elements() {
    return this._elements
  }
}