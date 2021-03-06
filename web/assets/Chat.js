function Chat() {
  var that = this;

  var CONFIGURATION = {
    fontSize: '13px',
    fontFamily: 'cursive'
  }

  var messages = [];

  var chat = document.createElement('div');
  chat.id = 'chat';
  chat.style.position = 'fixed';
  chat.style.bottom = '0px';
  chat.style.left = '0px';
  chat.style.width = (window.innerWidth * 0.3) + 'px';
  chat.style.height = (window.innerHeight * 0.4) + 'px';

  var chat_message = document.createElement('div');
  chat_message.id = "chat_message";
  chat_message.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
  chat_message.style.width = '100%';
  chat_message.style.height = '100%';
  chat_message.style.paddingRight = '20px';
  chat_message.style.marginTop = '-24px';
  chat_message.style.overflowY = 'auto';
  chat_message.style.fontSize = CONFIGURATION.fontSize;
  chat_message.style.fontFamily = CONFIGURATION.fontFamily;

  var chat_input = document.createElement('input');
  chat_input.type = 'text';
  chat_input.style.position = 'absolute';
  chat_input.style.bottom = '0px';
  chat_input.style.width = '100%';
  chat_input.style.fontSize = CONFIGURATION.fontSize;
  chat_input.style.fontFamily = CONFIGURATION.fontFamily;

  chat.appendChild(chat_message);
  chat.appendChild(chat_input);

  document.body.appendChild(chat);

  this.changeConfiguration = function(key, value) {
    CONFIGURATION[key] = value;
  }

  this.receiveMessage = function(data) {
    chat_message.innerHTML += '<span style="display:block"><strong>' + data.nickname + '</strong>: ' + data.message + '</span>';
    chat_message.scrollTop = chat_message.scrollHeight;
  }

  chat_input.addEventListener('keydown', function(event, a){
    if(event.keyCode == 13 && chat_input.value) {
      that.receiveMessage({nickname: 'EU', message: chat_input.value});
      that.emitter_send_message(chat_input.value);
      chat_input.value = '';
    }
  });
}
