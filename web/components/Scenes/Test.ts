import * as THREE from 'three'

import { Animator } from '../Animator';
import { IScene } from '../Interface'
import { Main, lerp } from '../Main';
import { Control } from '../Control';
import { Player } from '../Player';
import { Camera } from '../Camera';
import { Map } from '../Map';
import { Parallax, ParallaxElement } from '../Parallax';

export class TestScene implements IScene
{

  public camera: THREE.Camera
  public clock: THREE.Clock
  public renderer: any
  public scene: any

  _uniforms: any

  elements: Array<any>
  boxs: Array<any>

  h1: any
  control: Control
  map: Map
  sprite: any
  player: Player
  animator: Animator

  constructor(public _main: Main) {
    this.elements = new Array<any>();
    this.boxs = new Array<any>();

    this.camera = Camera.OrthographicCamera()
    this.clock = new THREE.Clock()
    this.control = new Control(this)
    this.scene = new THREE.Scene()
    this.map = new Map(this)
    this.player = new Player(this)

    this.player.changeName('[DEV] sylviot')
    this.player.changePosition({x: 200, y: 200})
    this.player.mesh.position.z = 9

    /* MAP DATA */
    let data = {
      map: {
        name: 'Map 1',
        width: 100,
        height: 100,
        elements: [],
        materials: [],
        collisions: []
      }
    }
    
    /* /MAP DATA */
    for(let i=0;i<30*4;i++) {
      data.map.collisions.push({x:35*i, y:0})
    }


    this.map.addPlayer(this.player)
    this.map.build(data.map)
    

    this.renderer = new THREE.WebGLRenderer({antialias: true, clearColor: 0x3dc0d3 })//, preserveDrawingBuffer: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(this.renderer.domElement)


    this.camera.position.set(0, 0, 10)



    // var runnerTexture = new THREE.ImageLoader().load('resources/run.png'); 
    // var runnerTexture = new THREE.ImageUtils.loadTexture( 'resources/run.png' );
    // this.animator = new Animator( runnerTexture, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
    // var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side: THREE.DoubleSide, transparent: true } );
    // var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    // var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
    
    // runner.position.set(200,25,1);
    // let layer = new ParallaxElement( runner );

    // this.map.parallax.addLayer(layer);

    // this.map.game.scene.add(runner);
  }

  _mouseEvent(hotkey: any) { }
  tryLoadTexture(_name: string) { }

  public update(): void {
    let delta = this.clock.getDelta()

    this.map.update(delta)
    this.player.update(delta)
    // this.animator.update(delta)

    /** camera */
    this.camera.position.x = lerp(this.camera.position.x, this.player.x, 0.07)
    this.camera.position.y = lerp(this.camera.position.y, this.player.y, 0.07)
  }

  public render(): void { }

  down(): void {
    console.log('DOWN')
  }
  up(): void {
    console.log('UP')
  }
}