import * as THREE from 'three'

import { Control } from '../Control';
import { IScene } from '../Interface'
import { Loading, LoadingStyle } from '../UI/Loading'
import { Main } from '../Main'
import { Loader } from 'three';
import { Network } from '../Network';

export class LoginScene implements IScene {
  camera: any;
  control: Control
  scene: any;

  login_button: any
  login_input: any
  login_label: any

  private _logo: any


  constructor(public _main: Main) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(65, window.devicePixelRatio, 0.1, 2000)

    this.control = new Control(this)
    
    this.login_button = document.createElement('button')
    this.login_input = document.createElement('input')
    this.login_label = document.createElement('label')

    this._logo = document.createElement('img')
    
    this._logo = document.createElement('img')
    this._logo.src = './resources/logo.png'
    this._logo.style.position = 'fixed'
    this._logo.style.top = '10%'
    this._logo.style.left = '25%'
    this._logo.style.width = '500px'
    this._logo.style.height = '500px'
    this._logo.style.marginLeft = '-250px'

    /* Button */
    this.login_button.style.position = 'fixed'
    this.login_button.style.fontSize = '22px'
    this.login_button.innerHTML = 'Logar'

    this.login_button.style.top = '60%'
    this.login_button.style.left = '70%'
    this.login_button.style.width = '20%'
    this.login_button.style.marginLeft = '-10%'

    /* Input */
    this.login_input.style.position = 'fixed'
    this.login_input.style.fontSize = '16px'
    this.login_input.style.textAlign = 'center'
    this.login_input.focus()
    
    this.login_input.style.top = '50%'
    this.login_input.style.left = '70%'
    this.login_input.style.width = '20%'
    this.login_input.style.fontSize = '28px'
    this.login_input.style.marginLeft = '-10%'

    /* Texto */
    this.login_label.style.color = 'white'
    this.login_label.style.position = 'fixed';
    this.login_label.style.fontSize = '13px';
    this.login_label.style.fontFamily = 'monospace';
    this.login_label.style.textAlign = 'center';
    // this.login_label.style.backgroundColor = 'red'
    this.login_label.innerHTML = 'Login or Name'

    this.login_label.style.top = '40%'
    this.login_label.style.left = '70%'
    this.login_label.style.width = '20%'
    this.login_label.style.marginLeft = '-10%'


    this._main.network.hook('server-connect', () => {
      this._main.network.send({
        action: 'login_account',
        login: 'login',
        senha: 'password'
      })
    })
    
    this._main.network.hook('login_account_success', (_response) => {
      console.log('connected with success!')

  
  
      document.body.appendChild(this.login_button);
      document.body.appendChild(this.login_input);
      document.body.appendChild(this.login_label);
  
      document.body.appendChild(this._logo);
  
      this.login_input.focus()
  
      this.login_button.addEventListener('click', () => {
        this._main.next()
      })
      this.login_input.addEventListener('keyup', (_event) => {
        if (_event.keyCode == 13)
          this._main.next()
      })
    })

    this._main.network.connect()
  }
  
  _keyboadEvent(hotkey: string) { }

  _mouseEvent(hotkey) { }

  tryLoadTexture(_name: string) { }
  
  update(): void { }
  render(): void { }

  down(): void {
    this.login_button.remove()
    this.login_input.remove()
    this.login_label.remove()
    
    this._logo.remove()
    console.log('down login')
  }
  up(): void {
    console.log('up login')
  }
}