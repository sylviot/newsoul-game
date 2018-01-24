export class Network {
  private _protocol: string
  private _hooks: any
  private _host: string
  private _socket: WebSocket

  constructor(public _endpoint = '/ws') {
    this._protocol = window.location.protocol
    this._host = window.location.host

    this._hooks = new Array()
  }

  public connect() {
    if (!this._socket || (this._socket instanceof WebSocket && this._socket.readyState == WebSocket.CLOSED)) {
      this._socket = new WebSocket(this.url)
      this._socket.onopen = (_response: any) => { this._onOpenEvent(_response) }
      this._socket.onclose = (_response: any) => { this._onCloseEvent(_response) }
      this._socket.onerror = (_response: any) => { this._onErrorEvent(_response) }
      this._socket.onmessage = (_response: any) => { this._onMessageEvent(_response) }
    }
  }
  
  public hook(_name: string, _callback: Function) {
    this._hooks[_name] = _callback
  }

  protected call_hook(_name: string, _data: any) {
    let func = this._hooks[_name]
    !!func && func(_data)
  }
  
  public send(_data: any) {
    if (this.isClosed()) {
      return null
    }
    
    return this._socket.send(_data)
  }
  
  public state() {
    if (this.isClosed()) {
      return null
    }
    
    return this._socket.readyState
  }
  
  /* WEBSOCKET EVENTS */
  protected _onOpenEvent(_response: any) {
    this.call_hook('server-connect', true)
  }
  
  protected _onCloseEvent(_response: any) {
    this.call_hook('server-disconnect', true)
  }

  protected _onErrorEvent(_response: any) {
    /* ToDo - Re-connect not implemented */
  }

  protected _onMessageEvent(_response: any) {
    var _data = JSON.parse(_response.data)

    this.call_hook(_data.action, _data)
  }

  /* GET SET AND GLOBAL */
  private isClosed() {
    return (!this._socket || !(this._socket instanceof WebSocket && this._socket.readyState == WebSocket.CLOSED))
  }

  get url() {
    return  this._protocol.replace('http', 'ws') + 
      '//' +
      this._host +
      this._endpoint
  }
}