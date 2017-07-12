function Initialize(sceneManager, game) {
  this.camera = new THREE.PerspectiveCamera(60, window.devicePixelRatio, 0.1, 2000);
  this.scene = new THREE.Scene();

  this.camera.position.set(0, 0, 700);
  game.renderer.setClearColor(0x000, 1);
  game.renderer.setSize(window.innerWidth, window.innerHeight);

  // ToDo - Precisa da lista de arquivos para download...
  var data = [
    { filename: 'resources/maps/map_01.json', type: 'json'},
    { filename: 'resources/player.png'      , type: 'image'},
  ];


  var logo = document.createElement('img');
  logo.src = 'resources/logo.png';
  logo.style.position = 'fixed';
  logo.style.width = '30%';
  logo.style.top = '10%';
  logo.style.left = '35%';

  // ToDo - criar um gerador de texto
  var text_1 = document.createElement('h1');
  text_1.style.position = 'fixed';
  text_1.style.color = 'white';
  text_1.style.bottom = '10%';
  text_1.style.width = '100%';
  text_1.style.textAlign = 'center';
  text_1.innerHTML = 'Carregando...';

  var text = document.createElement('h1');
  text.style.position = 'fixed';
  text.style.color = 'white';
  text.style.bottom = '5%';
  text.style.width = '100%';
  text.style.fontSize = '12px';
  text.style.textAlign = 'center';

  // ToDo - Criar um progress bar
  var progress = document.createElement('div');
  progress.style.position = 'fixed';
  progress.style.height = '20px';
  progress.style.bottom = '10%';
  progress.style.width = '40%';
  progress.style.margin = '0 30%';
  progress.style.backgroundColor = '#444';
  progress.style.border = '1px solid white';

  var progress_bar = document.createElement('div');
  progress_bar.style.height = '100%';
  progress_bar.style.backgroundColor = 'red';
  progress_bar.style.width = '0%';
  progress.appendChild(progress_bar);

  document.body.appendChild(logo);
  document.body.appendChild(text_1);
  document.body.appendChild(text);
  document.body.appendChild(progress);

  function UI_ChangeFilenameRequest(filename) {
    text.innerHTML = filename;
  }

  function UI_ChangeProgress(p) {
    progress_bar.style.width = p+'%';
  }

  function LoaderFiles(files) {
    var queue_files = files.slice(),
        queue_current;

    var queue_finish = function() {
      //sceneManager.next();
    },
    queue_next = function() {
      queue_current = queue_files.shift(); 

      if(!queue_current) { queue_finish(); return; }

      setTimeout(function() {queue_request(queue_current.filename, queue_current.type); }, 1000);
    },
    queue_downloading = function(xhr) {
      console.log( (xhr.loaded / xhr.total * 100) + '% percents.' );
    },
    queue_fail = function(xhr) {
      console.log('fail');
    },
    queue_request = function(filename, type) {
      THREE.Cache.enabled = true;
      var loader;

      if(type == 'image') 
        loader = new THREE.ImageLoader();
      else 
        loader = new THREE.FileLoader();

      UI_ChangeFilenameRequest(filename);
      UI_ChangeProgress(parseInt((files.length - queue_files.length) / files.length * 100) );

      loader.load(filename, queue_next, queue_downloading, queue_fail);
    }

    queue_next();
  }

  this.up = function() {
    LoaderFiles(data);
  }

  this.down = function() {
    logo.remove();
    text.remove();
    text_1.remove();
    progress.remove();
  }

  this.update = function(){}
}
