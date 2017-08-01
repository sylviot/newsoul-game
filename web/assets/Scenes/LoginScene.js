function Login(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  nickname = 'no-name';

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x000, 1);

  function onTryConnect() {
    CreateStatus();
    StatusConnecting();

    game.network.hook_server_connect(onConnect);
    setTimeout(game.network.connect, 1000);
  }

  function onConnect() {
    StatusConnected();
    CreateForm();
  }

  function onTryLogin() {
    game.network.hook_login_account(onLogin, onFailLogin);
    game.network.loginAccount(nickname, nickname);
  }

  function onLogin() {
    game.network.hook_load_character(onLoadCharacter);
    game.network.loadCharacter(nickname);
  }
  
  function onFailLogin() {
    StatusFailConnection();
  }

  function onLoadCharacter() {
    sceneManager.next();
  }

  var login = document.createElement('input');
  var login_text = document.createElement('h1');
  var login_button = document.createElement('button');
  var login_status = document.createElement('h1');

  function CreateStatus() {
    login_status.style.position = 'fixed';
    login_status.style.top = '50%';
    login_status.style.width = '100%';
    login_status.style.fontSize = '15px';
    login_status.style.textAlign = 'center';

    document.body.appendChild(login_status);
  }

  function StatusConnecting() {
    login_status.style.color = 'green';
    login_status.innerHTML = 'Conectando ao servidor...';
  }

  function StatusConnected() {
    login_status.style.color = 'green';
    login_status.innerHTML = 'Conectado!';
  }

  function StatusFailConnection() {
    login_status.style.color = 'red';
    login_status.innerHTML = 'Sem conexão!';
  }

  function CreateForm() {
    login.style.position = 'fixed';
    login.style.width = '30%';
    login.style.top = '30%';
    login.style.left = '35%';
    login.style.fontSize = '32px';
    login.style.textAlign = 'center';

    login_text.style.position = 'fixed';
    login_text.style.width = '30%';
    login_text.style.top = '20%';
    login_text.style.left = '35%';
    login_text.style.textAlign = 'center';
    login_text.style.color = 'white';
    login_text.innerHTML = 'Seu nick';

    login_button.style.position = 'fixed';
    login_button.style.width = '30%';
    login_button.style.top = '40%';
    login_button.style.left = '35%';
    login_button.style.textAlign = 'center';
    login_button.style.fontSize = '26px';
    login_button.innerHTML = 'Entrar';

    document.body.appendChild(login);
    document.body.appendChild(login_text);
    document.body.appendChild(login_button);

    login_button.addEventListener('click', onSubmit, false);
    login.addEventListener('keydown', function(e) { if(e.keyCode == 13) { onSubmit(); } }, false);

    function onSubmit(){
      nickname = login.value;
      onTryLogin();
    }

    login.focus();
  }

  this.up = function() {
    onTryConnect();
  }

  this.down = function() {
    login.remove();
    login_text.remove();
    login_button.remove();
    login_status.remove();
  }
 
  this.update = function(){}
}
