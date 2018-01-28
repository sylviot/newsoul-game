export interface IScene {
  camera: any
  scene: any

  _keyboadEvent(hotkey: string)
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