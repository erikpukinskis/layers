var Box = function(options) { 
  if (!options) { options = {} }
  PhiloGL.O3D.Model.call(this, Box.BASE_ATTRIBUTES); 
  this.colorSeed = options.colorSeed || [10,10];
  this.gamma = 0;
  this.applyColorSeed();
}

Box.prototype = Object.create(PhiloGL.O3D.Model.prototype, {});

Box.prototype.setColorSeed = function(seed) {
  this.colorSeed = seed;
  this.applyColorSeed();
}

Box.prototype.applyColorSeed = function() {
  var c = hslToRgb(hsl.apply(this, this.colorSeed));

  this.colors = Box.FLAT_SHADING(
    c[0]/255+this.gamma,
    c[1]/255+this.gamma,
    c[2]/255+this.gamma
  );
}

Box.prototype.setGamma = function(gamma) {
  this.gamma = gamma;
  this.applyColorSeed();
}

Box.FLAT_SHADING = function(r,g,b) {
    var side = function(r,g,b,off) {
    if (typeof off == 'undefined') { off = 0 }
    r -= off;
    g -= off;
    b -= off;
    return [r,g,b,1,
            r,g,b,1,
            r,g,b,1,
            r,g,b,1];
  }

    return [].concat(
        side(r,g,b,0.1), //front
        side(r,g,b,0.1), //back
        side(r,g,b,0.05), //top
        side(r,g,b,0.05), //bottom
        side(r,g,b,0.2), //right
        side(r,g,b) //left
    );
};

Box.BASE_ATTRIBUTES = {
  vertices: [
    0, 0,  1,
    1, 0,  1,
    1,  1,  1,
    0,  1,  1,

    0, 0, 0,
    0,  1, 0,
    1,  1, 0,
    1, 0, 0,

    0,  1, 0,
    0,  1,  1,
    1,  1,  1,
    1,  1, 0,

    0, 0, 0,
    1, 0, 0,
    1, 0,  1,
    0, 0,  1,

    1, 0, 0,
    1,  1, 0,
    1,  1,  1,
    1, 0,  1,

    0, 0, 0,
    0, 0,  1,
    0,  1,  1,
    0,  1, 0
  ],

  indices: [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
  ]
};