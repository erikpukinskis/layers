var World = function() {
    this.objects = [];
}

World.prototype.select = function(object) {
  this.selected = object;
  if (this.glower) { 
    this.glower.target(object);
  } else {
    this.glower = new Glower(object);
  }
}

World.prototype.at = function(position) {
  return _.find(this.objects, function(object) {
    return object.position.distTo(position) == 0;
  });
}

World.prototype.tryMove = function(object, d) {
  var newPosition = PhiloGL.Vec3.add(object.position, d);
  var occupant = this.at(newPosition);
  if (!occupant || occupant == object) {
    object.position = newPosition;
  }
}

World.prototype.clearGhost = function() {
  if (!world.ghost) { return }
  var i = world.objects.indexOf(world.ghost)
  world.objects.splice(i, 1);
  world.ghost = null;
}