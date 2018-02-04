import { Map } from "./Map";
import { Mesh } from "three";

export class ParallaxElement {
  private mesh: Mesh;
  private startX: number;
  private startY: number;
  private startZ: number;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.startX = this.mesh.position.x;
    this.startY = this.mesh.position.y;
    this.startZ = this.mesh.position.z;
  }

  public getDistance() {
    return (this.startZ * 0.5) - 1;
  }
  public getMesh() {
    return this.mesh;
  }
  public getStartX() {
    return this.startX;
  }
}

export class Parallax {
  private layers: ParallaxElement[];
  private map: Map;

  constructor(map: Map) {
    this.map = map;
    this.layers = new Array<any>();
  }

  public addLayer(layer: ParallaxElement): void {
    this.layers.push(layer);
    this.map.game.scene.add( this.layers[this.layers.length - 1].getMesh() );
  }

  public update(delta: number): void {
    if (!this.layers.length) {
      return;
    }

    let cameraX = this.map.game.camera.position.x;

    this.layers.forEach(layer => {
      layer.getMesh().position.x = layer.getStartX() - (cameraX * layer.getDistance());
    });
  }

  public remove(): void {
    this.layers.forEach(background => {
      this.map.game.scene.remove(background);
    });
  }
}
