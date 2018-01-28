import * as THREE from 'three'

import { IScene } from '../Interface'
import { Main } from '../Main'
import { Control } from '../Control';
import { Loading, LoadingStyle } from '../UI/Loading';

export class InitializeScene implements IScene {

  camera: any;
  control: Control
  scene: any;

  private _data: any
  private _dataCount: number
  private _dataIndex: number
  private _loader: any
  private _loading: Loading
  private _logo: any


  constructor(public _main: Main) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(65, window.devicePixelRatio, 0.1, 2000)
    
    this.control = new Control(this)
    
    this._loader = new THREE.FileLoader()
    this._loading = new Loading(() => {
      this._main.next()
    }, LoadingStyle.Defalut)



    this._data = [
      "resources/backgrounds/bg_0.png",
      "resources/backgrounds/bg_1.png",
      "resources/backgrounds/cloud.png",
      "resources/backgrounds/cloud.png",
    ]
    this._dataCount = this._data.length
    this._dataIndex = 0
    

    let queue_next = () => {
      THREE.Cache.enabled = true
      
      let _filename = this._data.shift()

      if (!_filename) { return; }

      this._loader.load(
        _filename,
        (data: any) => {
          let p = (100 / this._dataCount) * ++this._dataIndex

          this._loading.step( p ) 
          
          queue_next()
        },
        (_xhr: ProgressEvent) => {
        }
      )
    }
    

    this._logo = document.createElement('img')
    this._logo.src = './resources/logo.png'
    this._logo.style.position = 'fixed'
    this._logo.style.top = '10%'
    this._logo.style.left = '50%'
    this._logo.style.width = '300px'
    this._logo.style.height = '300px'
    this._logo.style.marginLeft = '-150px'

    document.body.appendChild(this._logo)
    queue_next()
  }
  
  _keyboadEvent(hotkey: string) { }

  _mouseEvent(hotkey: string) { }

  tryLoadTexture(_name: string) {
  }
  
  update(): void {
    this._loading.update()
  }
  render(): void {}

  down(): void {
    console.log('down initialize')
    this._loading.remove()
    this._logo.remove()
  }
  up(): void {
    console.log('up initialize')    
  }
}