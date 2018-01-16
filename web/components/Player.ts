// import * as THREE from "three"
import * as THREE from "./engines/three.min"
import { Game } from './Game'


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


  private _texture: any
  private _material: any
  private _mesh: any
  

  constructor(public game: Game) {
    this.loadBasicMesh()
  }
  
  loadData(_data: any): void {
    this.changeName(_data.name)
    // this.changeLevel(_data.level)
    // this.changeExperience(_data.experience)
    this.changePosition(_data.position);
    // this.changeAttributes(_data.attributes);
  }

  updateData(_data: any): void {

  }

  private loadBasicMesh(): void {
    this._texture = this.game.tryLoadTexture('tile_0', 'player.png')
    this._material = new THREE.MeshBasicMaterial({map: this._texture, color: 0x3dc0d3})
    this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(/*_data.width, _data.height*/35,35), this._material)

    this._mesh.position.set(13,35,1);
  }

  changeName(_newName: string) {
    this._name = _newName
  }
  changePosition(_newPosition) {
    this._x = _newPosition.x
    this._y = _newPosition.y
  }

  _delta: number = 1
  _speed: number = 0.3
  _maxSpeed: number = 10
  _acceleration: number = 5.85
  _deceleration: number = 0.15

  move(_direction: string) {
    if (_direction == "LEFT")
      this._x -= this._acceleration
    else if(_direction == "RIGHT")
      this._x += this._acceleration
  }

  moveX() {
    let x = this._mesh.position.x + this._speed

    this.changePosition({x: x, y: this.mesh.position.y})
  }

  update(_delta: number): void {
    this._delta = _delta

    this.mesh.position.x = THREE.Math.lerp(this.mesh.position.x, this._x, 0.2)
  }

  /* GET/SET */
  get experience() {
    // ToDo - Formataçãod de casas decimais #.000
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
}