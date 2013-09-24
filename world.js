var World = function() {
    this.objects = [];
}

World.prototype.select = function(object) {
  this.selected = object;
  glower.target(object);
}

World.prototype.at = function(position) {
  return _.find(this.objects, function(object) {
    return object.position.distTo(position) == 0;
  });
}

World.prototype.clearGhost = function() {
  if (!world.ghost) { return }
  var i = world.objects.indexOf(world.ghost)
  world.objects.splice(i, 1);
  world.ghost = null;
}