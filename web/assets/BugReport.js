function BugReport(renderer, callback) {
  var bug_input = document.createElement('textarea');
  bug_input.id = 'bug_input';
  bug_input.style.width = 200;
  bug_input.style.height = 100;
  bug_input.style.position = 'fixed';
  bug_input.style.top = 0;
  bug_input.style.right = '40px';
  bug_input.rows = 3;
  bug_input.style.display = 'none';

  var bug_button = document.createElement('div');
  bug_button.id = 'bug_button';
  bug_button.innerHTML = "BUG";
  bug_button.style.textAlign = 'center';
  bug_button.style.fontSize = '17px';
  bug_button.style.fontWeight = 'bold';
  bug_button.style.lineHeight = '30px';
  bug_button.style.color = 'white';
  bug_button.style.backgroundColor = '#3F51B5';
  bug_button.style.borderRadius = '7px';
  bug_button.style.cursor = 'pointer';
  bug_button.style.width = '40px';
  bug_button.style.height = '30px';
  bug_button.style.position = 'fixed';
  bug_button.style.top = 0;
  bug_button.style.right = 0;

  var bug_send = document.createElement('div');
  bug_send.id = 'bug_send';
  bug_send.innerHTML = "SEND";
  bug_send.style.textAlign = 'center';
  bug_send.style.fontSize = '14px';
  bug_send.style.fontWeight = 'bold';
  bug_send.style.lineHeight = '30px';
  bug_send.style.color = 'white';
  bug_send.style.backgroundColor = '#4CAF50';
  bug_send.style.borderRadius = '7px';
  bug_send.style.cursor = 'pointer';
  bug_send.style.width = '40px';
  bug_send.style.height = '30px';
  bug_send.style.position = 'fixed';
  bug_send.style.top = '31px';
  bug_send.style.right = 0;
  bug_send.style.display = 'none';

  document.body.appendChild(bug_button);
  document.body.appendChild(bug_send);
  document.body.appendChild(bug_input);

  bug_button.addEventListener('click', function(){
    var d = bug_input.style.display;
    d = (d=='none'?'inherit':'none');

    bug_input.style.display = d;
    bug_send.style.display = d;
  });

  bug_send.addEventListener('click', function(){
    var data = renderer.domElement.toDataURL();
    var bug = bug_input.value;

    callback(data, bug);
    bug_input.value = '';
  });
}
