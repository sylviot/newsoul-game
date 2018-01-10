// import * as THREE from "three"
import * as THREE from "./engines/three.min"
import { Game } from './Game'

export class Element {
  private _x: number
  private _y: number
  private _width: number
  private _height: number

  private _texture: any
  private _material: any
  private _mesh: any

  constructor (public game: Game, private _data: any) {
    if(_data.type == 'tile') {
      this.makeTile(_data)
    }
    else if (_data.type == 'background') {
      this.makeBg(_data)
    }
  }

  // Smell code below :X

  makeTile(_data: any) {
    this._texture = this.game.tryLoadTexture(_data.material)
    this._material = new THREE.MeshBasicMaterial({map: this._texture})
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(/*_data.width, _data.height*/35,35), this._material)

    this._x = _data.x
    this._y = _data.y;

    this.mesh.position.set(_data.x, _data.y, _data.z);
  }

  makeBg(_data: any) {
    this._texture = this.game.tryLoadTexture(_data.material)
    this._material = new THREE.MeshBasicMaterial({map: this._texture, transparent: true})
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(/*_data.width, _data.height*/1200,610), this._material)

    this._x = _data.x + 10000
    this._y = _data.y
    this.mesh.position.set(_data.x, _data.y, _data.z);
  }

  overlap(_x: number, _y: number): boolean {
    if ((_x < this._x-17.5 || _x > this._x+17.5) ||
        (_y < this._y-17.5 || _y > this._y+17.5))
      this._mesh.material= new THREE.MeshBasicMaterial({map: this._texture, transparent: true, color: 'white'})
    else      
      this._mesh.material= new THREE.MeshBasicMaterial({map: this._texture, transparent: true, color: 'red'})

    return false
  }

  get material() {
    return this._material
  }
  get mesh() {
    return this._mesh
  }
  get texture() {
    return this._texture
  }
}