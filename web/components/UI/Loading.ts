import { lerp } from "../Main";

export enum LoadingStyle {
  Defalut = 0,
  TopFix = 1
}

export class Loading {
  private _bar: any
  private _box: any
  private _progress: number

  constructor(
    public _onDone:any,
    private _loadingStyle: LoadingStyle = LoadingStyle.Defalut
  ) {
    this._progress = 0

    this._bar = document.createElement('div')
    this._box = document.createElement('div')
    this._box.appendChild(this._bar)

    this._bar.style.height = '100%'
    this._bar.style.width = '0%'
    this._bar.style.display = 'block'
    this._bar.style.background = 'linear-gradient(to right, rgba(0,0,255,0.3), rgba(0,0,255,1))'
        
    document.body.appendChild(this._box)

    this.changeStyle(_loadingStyle)
  }
  
  done(): void {
    this._onDone()
  }
  
  update(): void {
    let currentProgress = parseFloat(this._bar.style.width)

    this._bar.style.width = lerp(currentProgress, this._progress, 0.05) + '%';
  }

  remove(): void {
    this._bar.remove()
    this._box.remove()
  }

  step(_progress: number): void {
    this._progress = Math.max(0, Math.min(_progress, 100.0))

    if(this._progress == 100.0) {
      this.done()
    }
  }
  
  changeStyle(_loadingStyle: LoadingStyle): void {
    this._box.style.display = 'block'
    this._box.style.position = 'fixed'
    this._box.style.height = '3.5px'
    this._box.style.backgroundColor = 'white'
    
    if (_loadingStyle == LoadingStyle.Defalut) {
      this._box.style.width = '300px'
      this._box.style.top = '70%'
      this._box.style.left = '50%'
      this._box.style.marginLeft = '-150px'
    }
    else if(_loadingStyle == LoadingStyle.TopFix) {
      this._box.style.width = '100%'
      this._box.style.top = '0'
    }
  }
}