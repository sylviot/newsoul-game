function Login(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(75, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 100);
  game.renderer.setClearColor(0x000, 1);

  function onLogin(){
    if(!login.value) {
      login.focus();
      return;
    }

    game.network.connect();
    game.network.setCallback(function() {
      console.log('Login connect!');
      game.network.send({action: 'join', nickname: login.value});
    }, function(data) {
      console.log('Data:', data);
      sceneManager.next();
    }, null);
  }

  var login = document.createElement('input');
  var login_text = document.createElement('h1');
  var login_button = document.createElement('button');

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

    login_button.addEventListener('click', onLogin, false);
    login.addEventListener('keydown', function(e) {
      if(e.keyCode == 13) {
        onLogin();
      }
    }, false);

    login.focus();
  }

  this.up = function() {
    CreateForm();
  }

  this.down = function() {
    login.remove();
    login_text.remove();
    login_button.remove();
  }
 
  this.update = function(){}
}
