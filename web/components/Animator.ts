import * as THREE from "three";

export class Animator {
  private currentTile: number;
  private currentDisplayTime: number;
  private displayDuration: number;
  private horizontal: number;
  private numberOfTiles: number;
  private texture: THREE.Texture;
  private vertical: number;

  constructor(texture: THREE.Texture, horizontal: number, vertical: number, numberOfTiles: number, displayDuration: number) {
    this.currentDisplayTime = 0;
    this.currentTile = 0;
    this.displayDuration = displayDuration / 1000;
    this.horizontal = horizontal;
    this.numberOfTiles = numberOfTiles;
    this.texture = texture;
    this.vertical = vertical;

    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set( 1 / this.horizontal, 1 / this.vertical );
  }

  public update(delta: number): void {
    this.currentDisplayTime += delta;
    
    while (this.currentDisplayTime > this.displayDuration) {
      this.currentDisplayTime -= this.displayDuration;
      this.currentTile = (this.currentTile + 1) % this.numberOfTiles;
      // console.log(this.currentTile, this.displayDuration)
      this.texture.offset.x = this.currentTile / this.horizontal;
    }
  }
}
