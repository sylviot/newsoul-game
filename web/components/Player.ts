// import * as THREE from "three"
import * as THREE from "./engines/three.min"
import { Game } from './Game'

export class Player {
  private _name: string
  private _x: number
  private _y: number
  private _velocityX: number
  private _velocityY: number

  private _texture: any
  private _material: any
  private _mesh: any
  

  constructor(public game: Game) {
    this._texture = this.game.tryLoadTexture('tile_0', 'player.png')
    this._material = new THREE.MeshBasicMaterial({map: this._texture, color: 0x3dc0d3})
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(/*_data.width, _data.height*/35,35), this._material)

    this._mesh.position.set(13,35,1);

    this.game.scene.add(this._mesh)
  }

  changeName(_newName: string) {
    this._name = _newName
  }
}