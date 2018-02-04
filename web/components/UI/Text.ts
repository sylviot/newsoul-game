import * as THREE from "three";

export class Text {
  private _fontFamily: string
  private _fontSize: number
  private _fontWeight: string
  private _fontColor: string

  private _canvas: HTMLCanvasElement
  private _context: CanvasRenderingContext2D
  private _sprite: THREE.Sprite
  private _texture: THREE.Texture

  private _mesh: any

  constructor(private _width, private _height, private _text) {
    this._canvas = document.createElement('canvas')
    this._canvas.width = this._width
    this._canvas.height = this._height

    this._context = this._canvas.getContext('2d')

    
    this._context.font = 16 +'px Arial'
    this._context.textAlign = 'center'
    this._context.fillStyle = '#000000'
    this._context.textBaseline = 'middle'
    this._context.textAlign = 'center'
    this._context.fillText(_text, this._width/2,this._height/2)

    this._context.strokeStyle = '#fff'
    this._context.strokeRect(0, 0, this._canvas.width, this._canvas.height)

    this._texture = new THREE.Texture(this._canvas)
    this._texture.needsUpdate = true
    this._texture.minFilter = THREE.NearestFilter
    // this._texture.anisotropy = 16
    
    let material = new THREE.MeshBasicMaterial({map: this._texture, transparent: true})
    let geometry = new THREE.BoxGeometry(this._width, this._height, 1);
    this._mesh = new THREE.Mesh(geometry, material)
    this._mesh.position.x = 0
    this._mesh.position.y = 30
    this._mesh.position.z = 0

    // this._mesh.rotation.z = THREE.Math.degToRad(45)


    // this._texture = new THREE.Texture(this._canvas)
    // this._texture.needsUpdate = true

    // this._sprite = new THREE.Sprite( new THREE.SpriteMaterial({
    //     map: this._texture,
    //     transparent: true,
    //   })
    // )
    // this._sprite.scale.set(this._size, this._size, 1)
    // this._sprite.position.x = 0
    // this._sprite.position.y = 0
    // this._sprite.position.z = 1
  }

  set name(_value: string) {
    this._text = _value
    // console.log(_value)
    // this._context.canvas.cl
    // this._context.fillText(this._text, this._width/2,this._height/2)
    // this._texture = new THREE.Texture(this._canvas)
    // this._texture.needsUpdate = true
    
    // let material = new THREE.MeshBasicMaterial({map: this._texture, transparent: true})
    // let geometry = new THREE.BoxGeometry(this._width, this._height, 1);
    // this._mesh = new THREE.Mesh(geometry, material)
  }

  get sprite() {
    return this._sprite
  }
  get mesh() {
    return this._mesh
  }
}