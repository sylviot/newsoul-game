function Text(text) {
  var fontface = "Arial";
  var fontsize = 38;

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;

  var metrics = context.measureText( text );
  var width = metrics.width;

  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  context.fillText(text, (canvas.width - width)/2, fontsize);

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(100, 50, 1.0);
  //sprite.position.x += width/2;
  sprite.position.y += 10;

  return sprite;
}
