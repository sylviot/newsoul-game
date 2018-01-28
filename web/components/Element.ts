import * as THREE from "three"

import { IElement, IScene } from './Interface'

export class Element implements IElement {
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _rotation: number

  private _texture: any
  private _material: any
  private _mesh: any

  constructor (public _scene: IScene) {
  }

  loadData(_data: any) {
    if(_data.type == 'tile') {
      this._width = 35
      this._height = 35

      this.make(_data)
    }
    else if (_data.type == 'background') {
      this._width = 1200
      this._height = 600
      this._rotation = 0.05

      this.make(_data)
    }
    else if (_data.type == 'fixed') {
      this._width = 177
      this._height = 300
      // this._rotation = 0.2

      this.make(_data)
    }
  }

  updatePosition(_x: number, _y: number): void {
    this._x = _x
    this._y = _y
  }

  updateData(_data: any) { }

  update(_delta: number) {
  }

  // Smell code below :X

  make(_data: any) {
    this._texture = this._scene.tryLoadTexture(_data.material)
    this._material = new THREE.MeshBasicMaterial({map: this._texture, transparent: true})
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(this._width, this._height), this._material)

    this._x = _data.x
    this._y = _data.y;

    this.mesh.position.set(_data.x, _data.y, _data.z);
    
    // this.mesh.rotation.z = this._rotation || 0
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
  
  get x() {
    return this._x
  }
  get y() {
    return this._y
  }
  get width() {
    return this._width
  }
  get height() {
    return this._height
  }
  get rotation() {
    return this._rotation
  }
}