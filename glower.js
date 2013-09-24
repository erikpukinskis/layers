var Glower = function(object) {
  this.object = object;
  this.lastGlow = new Date();
}

Glower.prototype.glow = function() {
  var intensity = Math.sin((new Date() - this.lastGlow) / 1000 * 6) / 6;
  this.object.setGamma(intensity);
}

Glower.prototype.target = function(object) {
  this.object = object;
  this.intensity = 0;
}