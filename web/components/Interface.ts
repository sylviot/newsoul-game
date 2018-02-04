import { Control } from "./Control";
import { Network } from "./Network";

export interface IScene {
  camera: THREE.Camera
  control: Control
  scene: any

  _mouseEvent(hotkey: any)
  update(): void
  render(): void

  down(): void
  up(): void

  tryLoadTexture(_name: string)
}

export interface IElement {
  x: number
  y: number
  width: number
  height: number
  rotation: number

  loadData(data: any): void
  updateData(data: any): void
  updatePosition(_x: number, _y: number): void
  
  update(delta: number): void
}