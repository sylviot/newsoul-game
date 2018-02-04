import { IScene } from "./Interface";
import { GameScene } from "./Scenes/Game";

export class Chat {
  private messages = [];
  private scene: GameScene;

  constructor(game: GameScene) {
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
    }

    this.scene._main.network.hook('chat', receive_message);

    chat.addEventListener('submit', event => {
      console.log('submit')
      
      receive_message({nickname: 'EU', message: chat_input.value});
      this.scene._main.network.send({action: 'chat', message: chat_input.value});
      chat_input.value = '';

      event.preventDefault();
    });
  }
}