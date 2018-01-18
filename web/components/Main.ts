import * as THREE from 'three'

import { IScene } from './Interface';

import { GameScene } from './Scenes/Game'
import { InitializeScene } from './Scenes/Initialize'
import { LoginScene } from './Scenes/Login'
import { SplashScene } from './Scenes/Splash'
import { TestScene } from './Scenes/Test'


/* ToDo - Função básica para movimentação (move para Helpers) */
export function lerp( x, y, t ) {
  return ( 1 - t ) * x + t * y;
}

export class Main {
  private _scenes: any
  private _sceneCurrent: IScene
  private _sceneIndex: number

  private _renderer: any

  constructor() {
    this._renderer = new THREE.WebGLRenderer({antialias: true/*, preserveDrawingBuffer: true*/});
    this._renderer.setClearColor(0x000, 1);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);
    
    this._scenes = new Array(
      SplashScene,
      InitializeScene,
      LoginScene,
      GameScene,
    );

    this._sceneIndex = -1;
    this.next()
  }

  next(): void {
    if(this.sceneCurrent) {
      this.sceneCurrent.down()
    }

    let _sceneCount = this._scenes.length
    
    this._sceneIndex = (this._sceneIndex + 1) % _sceneCount
    this._sceneCurrent = new this._scenes[this._sceneIndex](this)

    this.sceneCurrent.up()
  }
  
  run(): void {
    let instance = this

    var animate = function () {
      requestAnimationFrame( animate );
      
      instance.update();
      instance.render();
    };

    animate();
  }

  public update(): void {
    this.sceneCurrent.update()
  }

  public render(): void {
    this.sceneCurrent.render()
    this._renderer.render(this.sceneCurrent.scene, this.sceneCurrent.camera)
  }

  get sceneCurrent() {
    return this._sceneCurrent
  }
}