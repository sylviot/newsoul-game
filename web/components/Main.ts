import * as THREE from "./engines/three.min"
import { Game } from './Game'

export class Main {
  static next(_scenes, _sceneCurrent): number {
    _sceneCurrent = (_sceneCurrent+1) % _scenes.length
    return _sceneCurrent
  }

  static run(): void {
    console.log('RUNNNNING!')
    let scenes = [Game]
    let sceneCurrent = -1

    sceneCurrent = this.next(scenes, sceneCurrent)
    var instance = new scenes[sceneCurrent]();

    var animate = function () {
      requestAnimationFrame( animate );
      
      // instance.renderer.render( instance.scene, instance.camera )
      instance.update();
      instance.render();
    };

    animate();
  }
}