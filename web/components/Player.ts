import * as THREE from "three"

import { GameScene } from './Scenes/Game'
import { lerp } from './Main'
import { Text } from './UI/Text'

import { IElement, IScene } from './Interface'

export class Player implements IElement {
  private _name: string
  private _level: number
  private _experience: number
  private _attributes: {
    str: number,
    agi: number,
    vit: number,
    dex: number
  }

  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _rotation: number
  private _jumpForce: number = 9.55
  private _acceleration: number = 3.5

  private _velocityV: number = 0
  private _velocityH: number = 0

  private _texture: any
  private _material: any
  private _mesh: any

  private _nameTexture: any
  

  constructor(public _scene: IScene) {
    this._width = 35
    this._height = 35
    
    this.loadBasicMesh()
  }
  
  loadData(_data: any): void {
    this.changeName(_data.name)
    // this.changeLevel(_data.level)
    // this.changeExperience(_data.experience)
    this.updatePosition(_data.position.x, _data.position.y);
    // this.changeAttributes(_data.attributes);
  }

  updateData(_data: any): void { }

  updatePosition(_x: number, _y: number): void {
    this._x = _x
    this._y = _y
  }

  private loadBasicMesh(): void {
    this._texture = new THREE.TextureLoader().load('resources/player.png')
    // this._texture.minFilter = THREE.LinearFilter
    this._material = new THREE.MeshBasicMaterial({map: this._texture, color: 0x3dc0d3})
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(/*_data.width, _data.height*/32,32), this._material)

    this._nameTexture = new Text(100, 20, this._name||'Player1')
    this.mesh.add(this._nameTexture.mesh)

    // this.mesh.rotation.z = THREE.Math.degToRad(45)
    this._scene.scene.add(this.mesh)
  }

  changeName(_newName: string) {
    this._name = _newName

    this._nameTexture = new Text(100, 20, this._name||'Player1')
    this.mesh.add(this._nameTexture.mesh)
  }
  changePosition(_newPosition) {
    this._x = _newPosition.x
    this._y = _newPosition.y
  }

  move(_direction: string, _acceleration: any) {
    this._x += _acceleration.x
    this._y += _acceleration.y
  }

  moveLEFT() {
    return {x: -this._acceleration, y: 0}
  }
  moveRIGHT() {
    return {x: this._acceleration, y: 0}
  }

  update(_delta: number): void {
    this.mesh.position.x = this._x;//lerp(this.mesh.position.x, this._x, 0.3)
    this.mesh.position.y = this._y;//lerp(this.mesh.position.y, this._y, 0.9)
    this.mesh.position.z = 9
  }

  remove(): void {
    this._scene.scene.remove(this.mesh)
  }

  /* GET/SET */
  get experience() {
    // ToDo - Formatação de casas decimais #.000
    return this._experience
  }
  get level() {
    return this._level
  }
  get name() {
    return this._name
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
  get jumpForce() {
    return this._jumpForce
  }

  get velocityV(): number {
    return this._velocityV
  }
  set velocityV(_value: number) {
    this._velocityV = _value
  }
  get velocityH(): number {
    return this._velocityH
  }
  set velocityH(_value: number) {
    this._velocityH = _value
  }

  get vectorX(): object {
    return {x: this._velocityH, y: 0}
  }
  get vectorY(): object {
    return {x: 0, y: this.velocityV}
  }
}