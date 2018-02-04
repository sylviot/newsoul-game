define("Network", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Network {
        constructor(_endpoint = '/ws') {
            this._endpoint = _endpoint;
            this._protocol = window.location.protocol;
            this._host = window.location.host;
            this._hooks = new Array();
        }
        connect() {
            if (!this._socket || (this._socket instanceof WebSocket && this._socket.readyState == WebSocket.CLOSED)) {
                this._socket = new WebSocket(this.url);
                this._socket.onopen = (_response) => { this._onOpenEvent(_response); };
                this._socket.onclose = (_response) => { this._onCloseEvent(_response); };
                this._socket.onerror = (_response) => { this._onErrorEvent(_response); };
                this._socket.onmessage = (_response) => { this._onMessageEvent(_response); };
            }
        }
        hook(_name, _callback) {
            this._hooks[_name] = _callback;
        }
        call_hook(_name, _data) {
            let func = this._hooks[_name];
            !!func && func(_data);
        }
        send(_data) {
            if (this.isClosed()) {
                return null;
            }
            return this._socket.send(JSON.stringify(_data));
        }
        state() {
            if (this.isClosed()) {
                return null;
            }
            return this._socket.readyState;
        }
        /* WEBSOCKET EVENTS */
        _onOpenEvent(_response) {
            this.call_hook('server-connect', true);
        }
        _onCloseEvent(_response) {
            this.call_hook('server-disconnect', true);
        }
        _onErrorEvent(_response) {
            /* ToDo - Re-connect not implemented */
        }
        _onMessageEvent(_response) {
            var _data = JSON.parse(_response.data);
            this.call_hook(_data.action, _data);
        }
        /* GET SET AND GLOBAL */
        isClosed() {
            return (!this._socket || (this._socket instanceof WebSocket && this._socket.readyState == WebSocket.CLOSED));
        }
        get url() {
            return this._protocol.replace('http', 'ws') +
                '//' +
                this._host +
                this._endpoint;
        }
    }
    exports.Network = Network;
});
define("Control", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Control {
        constructor(_scene) {
            this._hotkeys = new Array();
            this._keys = new Array();
            document.body.onkeydown = (_event) => {
                this._keys[_event.keyCode] = true;
            };
            document.body.onkeyup = (_event) => {
                this._keys[_event.keyCode] = false;
            };
            document.body.onmousemove = (_event) => { _scene._mouseEvent({ name: 'MOVE', x: _event.clientX, y: _event.clientY }); };
            document.body.oncontextmenu = (_event) => { _event.preventDefault(); _scene._mouseEvent('RIGHT CLICK'); };
            document.body.onclick = (_event) => { _event.preventDefault(); _scene._mouseEvent('LEFT CLICK'); };
            this.defaultHotkeys();
        }
        customHotkeys(_hotkeys) {
            _hotkeys.forEach(hk => {
                this._hotkeys[hk.action] = hk.code;
            });
        }
        defaultHotkeys() {
            var hotkeys = [
                { action: 'LEFT', code: 65 },
                { action: 'DOWN', code: 83 },
                { action: 'RIGHT', code: 68 },
                { action: 'UP', code: 87 },
                { action: 'SPACE', code: 32 }
            ];
            this.customHotkeys(hotkeys);
        }
        isPressed(_hotkey) {
            let _hotkeyCode = this._hotkeys[_hotkey];
            return (_hotkeyCode && this._keys[_hotkeyCode]);
        }
    }
    exports.Control = Control;
});
define("Interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Chat", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Chat {
        constructor(game) {
            this.messages = [];
            this.scene = game;
            let chat = document.createElement('form');
            let chat_messages = document.createElement('div');
            let chat_input = document.createElement('input');
            // var chat = document.createElement('div');
            chat.id = 'chat';
            chat.style.position = 'fixed';
            chat.style.bottom = '0px';
            chat.style.left = '0px';
            chat.style.width = (window.innerWidth * 0.3) + 'px';
            chat.style.height = (window.innerHeight * 0.4) + 'px';
            // var chat_message = document.createElement('div');
            chat_messages.id = "chat_message";
            chat_messages.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            chat_messages.style.width = '100%';
            chat_messages.style.height = '100%';
            chat_messages.style.paddingRight = '20px';
            chat_messages.style.marginTop = '-24px';
            chat_messages.style.overflowY = 'auto';
            chat_messages.style.fontSize = '13px';
            chat_messages.style.fontFamily = 'cursive';
            // var chat_input = document.createElement('input');
            chat_input.type = 'text';
            chat_input.style.position = 'absolute';
            chat_input.style.bottom = '0px';
            chat_input.style.width = '100%';
            chat_input.style.fontSize = '13px';
            chat_input.style.fontFamily = 'cursive';
            chat.appendChild(chat_messages);
            chat.appendChild(chat_input);
            document.body.appendChild(chat);
            let receive_message = data => {
                chat_messages.innerHTML += '<span style="display:block"><strong>' + data.nickname + '</strong>: ' + data.message + '</span>';
                chat_messages.scrollTop = chat_messages.scrollHeight;
            };
            this.scene._main.network.hook('chat', receive_message);
            chat.addEventListener('submit', event => {
                console.log('submit');
                receive_message({ nickname: 'EU', message: chat_input.value });
                this.scene._main.network.send({ action: 'chat', message: chat_input.value });
                chat_input.value = '';
                event.preventDefault();
            });
        }
    }
    exports.Chat = Chat;
});
define("Camera", ["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Camera {
        static basic() {
            let camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
            return camera;
        }
        static OrthographicCamera() {
            return new THREE.OrthographicCamera(window.innerWidth / -2, /* LEFT */ window.innerWidth / 2, /* RIGHT */ window.innerHeight / 2, /* TOP */ window.innerHeight / -2, /* BOTTOM */ 0.1, /* NEAR */ 1000 /* FAR */);
        }
    }
    exports.Camera = Camera;
});
define("Element", ["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Element {
        constructor(_scene) {
            this._scene = _scene;
        }
        loadData(_data) {
            if (_data.type == 'tile') {
                this._width = 35;
                this._height = 35;
                this.make(_data);
            }
            else if (_data.type == 'background') {
                this._width = 1200;
                this._height = 600;
                this._rotation = 0.05;
                this.make(_data);
            }
            else if (_data.type == 'fixed') {
                this._width = 177;
                this._height = 300;
                // this._rotation = 0.2
                this.make(_data);
            }
        }
        updatePosition(_x, _y) {
            this._x = _x;
            this._y = _y;
        }
        updateData(_data) { }
        update(_delta) {
        }
        // Smell code below :X
        make(_data) {
            this._texture = this._scene.tryLoadTexture(_data.material);
            this._material = new THREE.MeshBasicMaterial({ map: this._texture, transparent: true });
            this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(this._width, this._height), this._material);
            this._x = _data.x;
            this._y = _data.y;
            this.mesh.position.set(_data.x, _data.y, _data.z);
            // this.mesh.rotation.z = this._rotation || 0
        }
        overlap(_x, _y) {
            if ((_x < this._x - 17.5 || _x > this._x + 17.5) ||
                (_y < this._y - 17.5 || _y > this._y + 17.5))
                this._mesh.material = new THREE.MeshBasicMaterial({ map: this._texture, transparent: true, color: 'white' });
            else
                this._mesh.material = new THREE.MeshBasicMaterial({ map: this._texture, transparent: true, color: 'red' });
            return false;
        }
        get material() {
            return this._material;
        }
        get mesh() {
            return this._mesh;
        }
        get texture() {
            return this._texture;
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get rotation() {
            return this._rotation;
        }
    }
    exports.Element = Element;
});
define("UI/Text", ["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Text {
        constructor(_width, _height, _text) {
            this._width = _width;
            this._height = _height;
            this._text = _text;
            this._canvas = document.createElement('canvas');
            this._canvas.width = this._width;
            this._canvas.height = this._height;
            this._context = this._canvas.getContext('2d');
            this._context.font = 16 + 'px Arial';
            this._context.textAlign = 'center';
            this._context.fillStyle = '#000000';
            this._context.textBaseline = 'middle';
            this._context.textAlign = 'center';
            this._context.fillText(_text, this._width / 2, this._height / 2);
            this._context.strokeStyle = '#fff';
            this._context.strokeRect(0, 0, this._canvas.width, this._canvas.height);
            this._texture = new THREE.Texture(this._canvas);
            this._texture.needsUpdate = true;
            this._texture.minFilter = THREE.NearestFilter;
            // this._texture.anisotropy = 16
            let material = new THREE.MeshBasicMaterial({ map: this._texture, transparent: true });
            let geometry = new THREE.BoxGeometry(this._width, this._height, 1);
            this._mesh = new THREE.Mesh(geometry, material);
            this._mesh.position.x = 0;
            this._mesh.position.y = 30;
            this._mesh.position.z = 0;
            // this._mesh.rotation.z = THREE.Math.degToRad(45)
            // this._texture = new THREE.Texture(this._canvas)
            // this._texture.needsUpdate = true
            // this._sprite = new THREE.Sprite( new THREE.SpriteMaterial({
            //     map: this._texture,
            //     transparent: true,
            //   })
            // )
            // this._sprite.scale.set(this._size, this._size, 1)
            // this._sprite.position.x = 0
            // this._sprite.position.y = 0
            // this._sprite.position.z = 1
        }
        set name(_value) {
            this._text = _value;
            // console.log(_value)
            // this._context.canvas.cl
            // this._context.fillText(this._text, this._width/2,this._height/2)
            // this._texture = new THREE.Texture(this._canvas)
            // this._texture.needsUpdate = true
            // let material = new THREE.MeshBasicMaterial({map: this._texture, transparent: true})
            // let geometry = new THREE.BoxGeometry(this._width, this._height, 1);
            // this._mesh = new THREE.Mesh(geometry, material)
        }
        get sprite() {
            return this._sprite;
        }
        get mesh() {
            return this._mesh;
        }
    }
    exports.Text = Text;
});
define("Player", ["require", "exports", "three", "UI/Text"], function (require, exports, THREE, Text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Player {
        constructor(_scene) {
            this._scene = _scene;
            this._jumpForce = 9.55;
            this._acceleration = 3.5;
            this._velocityV = 0;
            this._velocityH = 0;
            this._width = 35;
            this._height = 35;
            this.loadBasicMesh();
        }
        loadData(_data) {
            this.changeName(_data.name);
            // this.changeLevel(_data.level)
            // this.changeExperience(_data.experience)
            this.updatePosition(_data.position.x, _data.position.y);
            // this.changeAttributes(_data.attributes);
        }
        updateData(_data) { }
        updatePosition(_x, _y) {
            this._x = _x;
            this._y = _y;
        }
        loadBasicMesh() {
            this._texture = new THREE.TextureLoader().load('resources/player.png');
            // this._texture.minFilter = THREE.LinearFilter
            this._material = new THREE.MeshBasicMaterial({ map: this._texture, color: 0x3dc0d3 });
            this._mesh = new THREE.Mesh(new THREE.PlaneGeometry(/*_data.width, _data.height*/ 32, 32), this._material);
            this._nameTexture = new Text_1.Text(100, 20, this._name || 'Player1');
            this.mesh.add(this._nameTexture.mesh);
            // this.mesh.rotation.z = THREE.Math.degToRad(45)
            this._scene.scene.add(this.mesh);
        }
        changeName(_newName) {
            this._name = _newName;
            this._nameTexture = new Text_1.Text(100, 20, this._name || 'Player1');
            this.mesh.add(this._nameTexture.mesh);
        }
        changePosition(_newPosition) {
            this._x = _newPosition.x;
            this._y = _newPosition.y;
        }
        move(_direction, _acceleration) {
            this._x += _acceleration.x;
            this._y += _acceleration.y;
        }
        moveLEFT() {
            return { x: -this._acceleration, y: 0 };
        }
        moveRIGHT() {
            return { x: this._acceleration, y: 0 };
        }
        update(_delta) {
            this.mesh.position.x = this._x; //lerp(this.mesh.position.x, this._x, 0.3)
            this.mesh.position.y = this._y; //lerp(this.mesh.position.y, this._y, 0.9)
            this.mesh.position.z = 9;
        }
        remove() {
            this._scene.scene.remove(this.mesh);
        }
        /* GET/SET */
        get experience() {
            // ToDo - Formatação de casas decimais #.000
            return this._experience;
        }
        get level() {
            return this._level;
        }
        get name() {
            return this._name;
        }
        get material() {
            return this._material;
        }
        get mesh() {
            return this._mesh;
        }
        get texture() {
            return this._texture;
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get rotation() {
            return this._rotation;
        }
        get jumpForce() {
            return this._jumpForce;
        }
        get velocityV() {
            return this._velocityV;
        }
        set velocityV(_value) {
            this._velocityV = _value;
        }
        get velocityH() {
            return this._velocityH;
        }
        set velocityH(_value) {
            this._velocityH = _value;
        }
        get vectorX() {
            return { x: this._velocityH, y: 0 };
        }
        get vectorY() {
            return { x: 0, y: this.velocityV };
        }
    }
    exports.Player = Player;
});
define("Parallax", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ParallaxElement {
        constructor(mesh) {
            this.mesh = mesh;
            this.startX = this.mesh.position.x;
            this.startY = this.mesh.position.y;
            this.startZ = this.mesh.position.z;
        }
        getDistance() {
            return (this.startZ * 0.5) - 1;
        }
        getMesh() {
            return this.mesh;
        }
        getStartX() {
            return this.startX;
        }
    }
    exports.ParallaxElement = ParallaxElement;
    class Parallax {
        constructor(map) {
            this.map = map;
            this.layers = new Array();
        }
        addLayer(layer) {
            this.layers.push(layer);
            this.map.game.scene.add(this.layers[this.layers.length - 1].getMesh());
        }
        update(delta) {
            if (!this.layers.length) {
                return;
            }
            let cameraX = this.map.game.camera.position.x;
            this.layers.forEach(layer => {
                layer.getMesh().position.x = layer.getStartX() - (cameraX * layer.getDistance());
            });
        }
        remove() {
            this.layers.forEach(background => {
                this.map.game.scene.remove(background);
            });
        }
    }
    exports.Parallax = Parallax;
});
define("Map", ["require", "exports", "three", "Element"], function (require, exports, THREE, Element_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const RESOURCES_PATH = './resources/';
    class Map {
        // private textures: any
        // private teleports: Array<any>
        // public parallax: Parallax
        constructor(game) {
            this.game = game;
            this._gravity = 18.0;
            this._dummyPlayers = new Array();
            // this.parallax = new Parallax(this);
            this._name = 'unknow map';
            this._width = 100;
            this._height = 100;
            this._gravity = 18.0;
        }
        addPlayer(_player) {
            this._player = _player;
        }
        addDummyPlayer(_dummyPlayer) {
            this._dummyPlayers[_dummyPlayer.name] = _dummyPlayer;
        }
        removeDummyPLayer(_dummyPlayer) {
            delete this._dummyPlayers[_dummyPlayer.name];
        }
        build(_data) {
            this._name = _data.name;
            this._width = _data.width;
            this._height = _data.height;
            this._collisions = _data.collisions;
            for (let item of _data.collisions) {
                let mesh = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), new THREE.MeshBasicMaterial({ transparent: true, color: 0x0f0f0f }));
                mesh.position.set(item.x, item.y, 2);
                this.game.scene.add(mesh);
            }
            /** ADD Parallax */
            // let colors = [0x3dc0d3, 0x00ff00, 0x00ffff, 0xffff00]
            // let v = [0, -0.8, -0.5, 0.1]
            // let bgs = [3,3,3,3,3,3,3,3,2,1]
            // for(let i in bgs) {
            //   let texture = new THREE.TextureLoader().load('resources/parallax/bg_0'+bgs[i]+'.png')
            //   let mesh = (new THREE.Mesh(
            //     new THREE.PlaneGeometry(640, 480),
            //     new THREE.MeshBasicMaterial({map: texture, transparent: true})//, color: colors[i]})
            //   ));
            //   mesh.position.x = (bgs[i] == 3 ? 640 * i: 320);
            //   mesh.position.y = 170;
            //   mesh.position.z = bgs[i];
            //   let layer = new ParallaxElement( mesh );
            //   this.parallax.addLayer(layer);
            //   console.log('add bg parallax')
            // }
            this._elements = _data.elements.map((item) => {
                let element = new Element_1.Element(this.game);
                element.loadData(item);
                this.game.scene.add(element.mesh);
                return element;
            });
            this.showName();
        }
        showName() {
            let name = document.createElement('h1');
            name.style.color = 'white';
            name.style.fontFamily = 'Arial';
            name.style.textShadow = '1px 1px 3px red';
            name.style.width = '300px';
            name.style.height = '30px';
            name.style.position = 'fixed';
            name.style.top = '5%';
            name.style.left = '50%';
            name.style.marginLeft = '-150px';
            name.textContent = "<< " + this._name + " >>";
            document.body.appendChild(name);
            setTimeout(() => {
                name.style.opacity = '0.7';
                name.style.opacity = '0.3';
                name.style.opacity = '0.1';
                name.remove();
            }, 3000);
        }
        update(_delta) {
            this._elements.forEach(_element => {
                _element.update(_delta);
            });
            this._dummyPlayers.forEach(_dummyPlayer => {
                _dummyPlayer.update(_delta);
            });
            this.applyPlayerCollision(_delta);
            // this.parallax.update(_delta)
        }
        hasUpCollision(_element, _acceleration, tile, SIZE = 35) {
            return _element.y + _acceleration.y - _element.height > tile.y;
        }
        hasDownCollision(_element, _acceleration, tile, SIZE = 35) {
            return _element.y + _acceleration.y < tile.y - SIZE;
        }
        hasLeftCollision(_element, _acceleration, tile, SIZE = 35) {
            return _element.x + _acceleration.x + _element.width < tile.x;
        }
        hasRightCollision(_element, _acceleration, tile, SIZE = 35) {
            return _element.x + _acceleration.x > tile.x + SIZE;
        }
        hasCollision(_element, _acceleration) {
            let SIZE = 35;
            for (let tile of this._collisions) {
                let up = this.hasUpCollision(_element, _acceleration, tile), down = this.hasDownCollision(_element, _acceleration, tile), left = this.hasLeftCollision(_element, _acceleration, tile), right = this.hasRightCollision(_element, _acceleration, tile);
                if (!((left || right) || (up || down))) {
                    return true;
                }
            }
            return false;
        }
        applyPlayerCollision(_delta) {
            if (this.hasCollision(this._player, this._player.vectorY)) {
                this._player.velocityV = -this.gravity * _delta;
                if (this.game.control.isPressed('SPACE'))
                    this._player.velocityV = this._player.jumpForce;
            }
            else {
                this._player.velocityV -= this.gravity * _delta;
            }
            if (this.game.control.isPressed('LEFT'))
                this._player.velocityH = this._player.moveLEFT().x;
            if (this.game.control.isPressed('RIGHT'))
                this._player.velocityH = this._player.moveRIGHT().x;
            if (!this.hasCollision(this._player, this._player.vectorY)) {
                this._player.move('JUMP', this._player.vectorY);
            }
            if (!this.hasCollision(this._player, this._player.vectorX)) {
                this._player.move('MOVE', this._player.vectorX);
                this._player.velocityH = 0;
            }
        }
        get elements() {
            return this._elements;
        }
        get name() {
            return this._name;
        }
        get gravity() {
            return this._gravity;
        }
    }
    exports.Map = Map;
});
define("Scenes/Game", ["require", "exports", "three", "Chat", "Control", "Main", "Map", "Player"], function (require, exports, THREE, Chat_1, Control_1, Main_1, Map_1, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const RESOURCES_PATH = './resources/';
    class GameScene {
        constructor(_main) {
            this._main = _main;
            this.clock = new THREE.Clock();
            this.scene = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 100);
            this._dummyPlayers = new Array();
            let that = this;
            let info = {
                name: '[ADM] SylvioT',
                position: { x: 900, y: 320 },
                velocity: 1.45,
                level: 1,
                experience: 1,
                attributes: {
                    str: 1,
                    agi: 1,
                    vit: 1,
                    dex: 1,
                }
            };
            let data = {
                map: {
                    name: 'Map 1',
                    width: 100,
                    height: 100,
                    materials: [
                        { name: 'tile_0', sprite: 'tiles/tile_0.png', width: 35, height: 35 },
                        { name: 'bg_0', sprite: 'backgrounds/bg_0.png', width: 700, height: 200 },
                        { name: 'bg_hill_0', sprite: 'backgrounds/hill.png', width: 1200, height: 610 },
                        { name: 'pillar', sprite: 'backgrounds/pillar.png', width: 361, height: 593 },
                        { name: 'crystal', sprite: 'backgrounds/crystal.png', width: 361, height: 593 },
                    ],
                    elements: [
                        { type: 'tile', material: 'tile_0', x: 0, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 35, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 70, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 105, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 140, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 175, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 210, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 245, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 280, y: 0, z: -1 },
                        { type: 'tile', material: 'tile_0', x: 315, y: 0, z: -1 },
                        { type: 'fixed', material: 'pillar', x: 900, y: 169, z: -1 },
                        { type: 'fixed', material: 'crystal', x: 900, y: 480, z: -1 },
                        { type: 'background', material: 'bg_0', x: 0, y: -600, z: -3 },
                        { type: 'background', material: 'bg_0', x: 0, y: 0, z: -3 },
                        { type: 'background', material: 'bg_0', x: 0, y: 600, z: -3 },
                        { type: 'background', material: 'bg_0', x: 1200, y: -400, z: -3 },
                        { type: 'background', material: 'bg_0', x: 1200, y: 200, z: -3 },
                        { type: 'background', material: 'bg_0', x: 1200, y: 800, z: -3 },
                        { type: 'background', material: 'bg_hill_0', x: 300, y: 132, z: -2 },
                        { type: 'background', material: 'bg_hill_0', x: 1500, y: 200, z: -2 },
                    ],
                    collisions: [
                        /* platforms */
                        { x: 140, y: 140 },
                        { x: 175, y: 140 },
                        { x: 210, y: 140 },
                        { x: 245, y: 140 },
                        { x: 385, y: 245 },
                        { x: 420, y: 245 },
                        { x: 455, y: 245 },
                        { x: 490, y: 245 },
                        { x: 630, y: 140 },
                        { x: 665, y: 140 },
                        { x: 700, y: 140 },
                        { x: 735, y: 140 },
                        { x: 1015, y: 140 },
                        { x: 1050, y: 140 },
                        { x: 1085, y: 140 },
                        { x: 1120, y: 140 },
                    ]
                },
                camera: {
                    position: { x: 0, y: 0, z: 10 }
                },
            };
            for (let i = 0; i < 10 * 4; i++) {
                data.map.collisions.push({ x: 35 * i, y: 0 });
            }
            for (let i = 0; i < 10; i++) {
                data.map.collisions.push({ x: 0, y: i * 35 });
                data.map.collisions.push({ x: 1400, y: i * 35 });
            }
            this.resources = new Array();
            this.chat = new Chat_1.Chat(this);
            this.control = new Control_1.Control(this);
            this.player = new Player_1.Player(this);
            this.player.loadData(info);
            this._main.network.send({
                action: 'load_character',
                character_id: 'Player-' + ~~(Math.random() * 999999)
            });
            this._dummyPlayers = [];
            let addPlayer = data => {
                let player = this._dummyPlayers[data.nickname] = new Player_1.Player(this);
                player.loadData({
                    name: data.nickname,
                    position: { x: 900, y: 320 }
                });
                this.scene.add(player.mesh);
                this.map.addDummyPlayer(player);
            };
            this._main.network.hook('join', data => {
                let player = this._dummyPlayers[data.nickname] = new Player_1.Player(this);
                player.loadData({
                    name: data.nickname,
                    position: { x: 900, y: 320 }
                });
                this.scene.add(player.mesh);
                this.map.addDummyPlayer(player);
            });
            this._main.network.hook('leave', _data => {
                this.map.removeDummyPLayer(this._dummyPlayers[_data.nickname]);
                this._dummyPlayers[_data.nickname].remove();
            });
            this._main.network.hook('movement', data => {
                if (!this._dummyPlayers[data.nickname]) {
                    addPlayer(data);
                }
                this._dummyPlayers[data.nickname].updatePosition(data.x, data.y);
            });
            data.map.materials.forEach(item => {
                this.tryLoadTexture(item.name, item.sprite);
            });
            this.map = new Map_1.Map(this);
            this.map.addPlayer(this.player);
            this.map.build(data.map);
            this.camera.position.x = data.camera.position.x;
            this.camera.position.y = data.camera.position.y;
            this.camera.position.z = data.camera.position.z;
        }
        render() {
        }
        update() {
            let delta = this.clock.getDelta();
            this.map.update(delta);
            this.player.update(delta);
            for (let id in this._dummyPlayers) {
                this._dummyPlayers[id].update(delta);
            }
            // ToDo - Camera following IElement
            this.camera.position.x = Main_1.lerp(this.camera.position.x, this.player.x, 0.07);
            this.camera.position.y = Main_1.lerp(this.camera.position.y, this.player.y, 0.07);
            this._main.network.send({
                action: 'movement',
                x: this.player.x,
                y: this.player.y
            });
        }
        down() {
            console.log('down game');
        }
        up() {
            console.log('up GaME');
        }
        /* EVENTS */
        /* ToDo - need adjust keyboard/mouse event */
        _mouseEvent(_event) { }
        /* RESOURCES METHODS */
        tryLoadTexture(_name, _sprite = '') {
            if (!this.resources[_name]) {
                let texture = THREE.ImageUtils.loadTexture(`${RESOURCES_PATH}${_sprite}`);
                texture.minFilter = THREE.LinearFilter;
                this.resources[_name] = texture;
            }
            return this.resources[_name];
        }
    }
    exports.GameScene = GameScene;
});
define("UI/Loading", ["require", "exports", "Main"], function (require, exports, Main_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadingStyle;
    (function (LoadingStyle) {
        LoadingStyle[LoadingStyle["Defalut"] = 0] = "Defalut";
        LoadingStyle[LoadingStyle["TopFix"] = 1] = "TopFix";
    })(LoadingStyle = exports.LoadingStyle || (exports.LoadingStyle = {}));
    class Loading {
        constructor(_onDone, _loadingStyle = LoadingStyle.Defalut) {
            this._onDone = _onDone;
            this._loadingStyle = _loadingStyle;
            this._progress = 0;
            this._bar = document.createElement('div');
            this._box = document.createElement('div');
            this._box.appendChild(this._bar);
            this._bar.style.height = '100%';
            this._bar.style.width = '0%';
            this._bar.style.display = 'block';
            this._bar.style.background = 'linear-gradient(to right, rgba(0,0,255,0.3), rgba(0,0,255,1))';
            document.body.appendChild(this._box);
            this.changeStyle(_loadingStyle);
        }
        done() {
            this._onDone();
        }
        update() {
            let currentProgress = parseFloat(this._bar.style.width);
            this._bar.style.width = Main_2.lerp(currentProgress, this._progress, 0.05) + '%';
        }
        remove() {
            this._bar.remove();
            this._box.remove();
        }
        step(_progress) {
            this._progress = Math.max(0, Math.min(_progress, 100.0));
            if (this._progress == 100.0) {
                this.done();
            }
        }
        changeStyle(_loadingStyle) {
            this._box.style.display = 'block';
            this._box.style.position = 'fixed';
            this._box.style.height = '3.5px';
            this._box.style.backgroundColor = 'white';
            if (_loadingStyle == LoadingStyle.Defalut) {
                this._box.style.width = '300px';
                this._box.style.top = '70%';
                this._box.style.left = '50%';
                this._box.style.marginLeft = '-150px';
            }
            else if (_loadingStyle == LoadingStyle.TopFix) {
                this._box.style.width = '100%';
                this._box.style.top = '0';
            }
        }
    }
    exports.Loading = Loading;
});
define("Scenes/Initialize", ["require", "exports", "three", "Control", "UI/Loading"], function (require, exports, THREE, Control_2, Loading_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InitializeScene {
        constructor(_main) {
            this._main = _main;
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(65, window.devicePixelRatio, 0.1, 2000);
            this.control = new Control_2.Control(this);
            this._loader = new THREE.FileLoader();
            this._loading = new Loading_1.Loading(() => {
                this._main.next();
            }, Loading_1.LoadingStyle.Defalut);
            this._data = [
                "resources/backgrounds/bg_0.png",
                "resources/backgrounds/bg_1.png",
                "resources/backgrounds/cloud.png",
                "resources/backgrounds/cloud.png",
            ];
            this._dataCount = this._data.length;
            this._dataIndex = 0;
            let queue_next = () => {
                THREE.Cache.enabled = true;
                let _filename = this._data.shift();
                if (!_filename) {
                    return;
                }
                this._loader.load(_filename, (data) => {
                    let p = (100 / this._dataCount) * ++this._dataIndex;
                    this._loading.step(p);
                    queue_next();
                }, (_xhr) => {
                });
            };
            this._logo = document.createElement('img');
            this._logo.src = './resources/logo.png';
            this._logo.style.position = 'fixed';
            this._logo.style.top = '10%';
            this._logo.style.left = '50%';
            this._logo.style.width = '300px';
            this._logo.style.height = '300px';
            this._logo.style.marginLeft = '-150px';
            document.body.appendChild(this._logo);
            queue_next();
        }
        _mouseEvent(hotkey) { }
        tryLoadTexture(_name) { }
        update() {
            this._loading.update();
        }
        render() { }
        down() {
            console.log('down initialize');
            this._loading.remove();
            this._logo.remove();
        }
        up() {
            console.log('up initialize');
        }
    }
    exports.InitializeScene = InitializeScene;
});
define("Scenes/Login", ["require", "exports", "three", "Control"], function (require, exports, THREE, Control_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoginScene {
        constructor(_main) {
            this._main = _main;
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(65, window.devicePixelRatio, 0.1, 2000);
            this.control = new Control_3.Control(this);
            this.login_button = document.createElement('button');
            this.login_input = document.createElement('input');
            this.login_label = document.createElement('label');
            this._logo = document.createElement('img');
            this._logo = document.createElement('img');
            this._logo.src = './resources/logo.png';
            this._logo.style.position = 'fixed';
            this._logo.style.top = '10%';
            this._logo.style.left = '25%';
            this._logo.style.width = '500px';
            this._logo.style.height = '500px';
            this._logo.style.marginLeft = '-250px';
            /* Button */
            this.login_button.style.position = 'fixed';
            this.login_button.style.fontSize = '22px';
            this.login_button.innerHTML = 'Logar';
            this.login_button.style.top = '60%';
            this.login_button.style.left = '70%';
            this.login_button.style.width = '20%';
            this.login_button.style.marginLeft = '-10%';
            /* Input */
            this.login_input.style.position = 'fixed';
            this.login_input.style.fontSize = '16px';
            this.login_input.style.textAlign = 'center';
            this.login_input.focus();
            this.login_input.style.top = '50%';
            this.login_input.style.left = '70%';
            this.login_input.style.width = '20%';
            this.login_input.style.fontSize = '28px';
            this.login_input.style.marginLeft = '-10%';
            /* Texto */
            this.login_label.style.color = 'white';
            this.login_label.style.position = 'fixed';
            this.login_label.style.fontSize = '13px';
            this.login_label.style.fontFamily = 'monospace';
            this.login_label.style.textAlign = 'center';
            // this.login_label.style.backgroundColor = 'red'
            this.login_label.innerHTML = 'Login or Name';
            this.login_label.style.top = '40%';
            this.login_label.style.left = '70%';
            this.login_label.style.width = '20%';
            this.login_label.style.marginLeft = '-10%';
            this._main.network.hook('server-connect', () => {
                this._main.network.send({
                    action: 'login_account',
                    login: 'login',
                    senha: 'password'
                });
            });
            this._main.network.hook('login_account_success', (_response) => {
                console.log('connected with success!');
                document.body.appendChild(this.login_button);
                document.body.appendChild(this.login_input);
                document.body.appendChild(this.login_label);
                document.body.appendChild(this._logo);
                this.login_input.focus();
                this.login_button.addEventListener('click', () => {
                    this._main.next();
                });
                this.login_input.addEventListener('keyup', (_event) => {
                    if (_event.keyCode == 13)
                        this._main.next();
                });
            });
            this._main.network.connect();
        }
        _mouseEvent(hotkey) { }
        tryLoadTexture(_name) { }
        update() { }
        render() { }
        down() {
            this.login_button.remove();
            this.login_input.remove();
            this.login_label.remove();
            this._logo.remove();
            console.log('down login');
        }
        up() {
            console.log('up login');
        }
    }
    exports.LoginScene = LoginScene;
});
define("Scenes/Splash", ["require", "exports", "three", "Control"], function (require, exports, THREE, Control_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SplashScene {
        constructor(_main) {
            this._main = _main;
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(65, window.devicePixelRatio, 0.1, 2000);
            this.control = new Control_4.Control(this);
        }
        _mouseEvent(hotkey) { this._main.next(); }
        tryLoadTexture(_name) { }
        update() { }
        render() { }
        down() {
            console.log('down splash');
        }
        up() {
            console.log('up splash');
            this._main.next();
        }
    }
    exports.SplashScene = SplashScene;
});
define("Animator", ["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Animator {
        constructor(texture, horizontal, vertical, numberOfTiles, displayDuration) {
            this.currentDisplayTime = 0;
            this.currentTile = 0;
            this.displayDuration = displayDuration / 1000;
            this.horizontal = horizontal;
            this.numberOfTiles = numberOfTiles;
            this.texture = texture;
            this.vertical = vertical;
            this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.repeat.set(1 / this.horizontal, 1 / this.vertical);
        }
        update(delta) {
            this.currentDisplayTime += delta;
            while (this.currentDisplayTime > this.displayDuration) {
                this.currentDisplayTime -= this.displayDuration;
                this.currentTile = (this.currentTile + 1) % this.numberOfTiles;
                // console.log(this.currentTile, this.displayDuration)
                this.texture.offset.x = this.currentTile / this.horizontal;
            }
        }
    }
    exports.Animator = Animator;
});
define("Scenes/Test", ["require", "exports", "three", "Main", "Control", "Player", "Camera", "Map"], function (require, exports, THREE, Main_3, Control_5, Player_2, Camera_1, Map_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestScene {
        constructor(_main) {
            this._main = _main;
            this.elements = new Array();
            this.boxs = new Array();
            this.camera = Camera_1.Camera.OrthographicCamera();
            this.clock = new THREE.Clock();
            this.control = new Control_5.Control(this);
            this.scene = new THREE.Scene();
            this.map = new Map_2.Map(this);
            this.player = new Player_2.Player(this);
            this.player.changeName('[DEV] sylviot');
            this.player.changePosition({ x: 200, y: 200 });
            this.player.mesh.position.z = 9;
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
            };
            /* /MAP DATA */
            for (let i = 0; i < 30 * 4; i++) {
                data.map.collisions.push({ x: 35 * i, y: 0 });
            }
            this.map.addPlayer(this.player);
            this.map.build(data.map);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: 0x3dc0d3 }); //, preserveDrawingBuffer: true})
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
            this.camera.position.set(0, 0, 10);
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
        _mouseEvent(hotkey) { }
        tryLoadTexture(_name) { }
        update() {
            let delta = this.clock.getDelta();
            this.map.update(delta);
            this.player.update(delta);
            // this.animator.update(delta)
            /** camera */
            this.camera.position.x = Main_3.lerp(this.camera.position.x, this.player.x, 0.07);
            this.camera.position.y = Main_3.lerp(this.camera.position.y, this.player.y, 0.07);
        }
        render() { }
        down() {
            console.log('DOWN');
        }
        up() {
            console.log('UP');
        }
    }
    exports.TestScene = TestScene;
});
define("Main", ["require", "exports", "three", "Network", "Scenes/Game", "Scenes/Initialize", "Scenes/Login", "Scenes/Splash", "Scenes/Test"], function (require, exports, THREE, Network_1, Game_1, Initialize_1, Login_1, Splash_1, Test_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* ToDo - Função básica para movimentação (move para Helpers) */
    function lerp(x, y, t) {
        return (1 - t) * x + t * y;
    }
    exports.lerp = lerp;
    class Main {
        constructor() {
            this._network = new Network_1.Network();
            this._renderer = new THREE.WebGLRenderer({ antialias: true /*, preserveDrawingBuffer: true*/ });
            this._renderer.setClearColor(0x000, 1);
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this._renderer.domElement);
            this._scenes = new Array(Initialize_1.InitializeScene, Splash_1.SplashScene, Login_1.LoginScene, Game_1.GameScene, Test_1.TestScene);
            this._sceneIndex = -1;
            this.next();
        }
        next() {
            if (this.sceneCurrent) {
                this.sceneCurrent.down();
            }
            let _sceneCount = this._scenes.length;
            this._sceneIndex = (this._sceneIndex + 1) % _sceneCount;
            this._sceneCurrent = new this._scenes[this._sceneIndex](this);
            this.sceneCurrent.up();
        }
        run() {
            let instance = this;
            var animate = function () {
                requestAnimationFrame(animate);
                instance.update();
                instance.render();
            };
            animate();
        }
        update() {
            this.sceneCurrent.update();
        }
        render() {
            this.sceneCurrent.render();
            this._renderer.render(this.sceneCurrent.scene, this.sceneCurrent.camera);
        }
        get network() {
            return this._network;
        }
        get renderer() {
            return this._renderer;
        }
        get sceneCurrent() {
            return this._sceneCurrent;
        }
    }
    exports.Main = Main;
});
