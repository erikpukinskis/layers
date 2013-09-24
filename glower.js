var Glower = function(object) {
  this.object = object;
  this.intensity = 0;
  this.increment = 0.003;
}

Glower.prototype.glow = function() {
    if ((this.intensity > 0.05) || (this.intensity < -0.05)) {
        this.increment *= -1;
    }
    this.intensity += this.increment;

    this.object.setGamma(this.intensity);
}

Glower.prototype.target = function(object) {
  this.object = object;
  this.intensity = 0;
}