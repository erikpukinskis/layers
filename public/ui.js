var modes = {
    move: {
        help: 'use arrow keys to move',
        next: 'color',
        key: 'M',
        onkeydown: function(e, direction) {
            world.selected.position.x += direction.x;
            world.selected.position.y += direction.y;
            world.selected.position.z += direction.z;        
        },
    },
    color: {
        help: 'Arrow keys change colors',
        next: 'select',
        key: 'C',
        onkeydown: function(e, direction) {
          var seed = world.selected.colorSeed;
          world.selected.setColorSeed ([
            bounded(seed[0]+direction.x, 0, width),
            bounded(seed[1]+direction.y, 0, height),
          ]);
          world.colorSeed = world.selected.colorSeed;
        },
        onload: function() {
          world.ghost = null;              
        }
    },
    select: {
        help: 'Arrow keys select or place new object',
        next: 'move',
        key: 'D',
        onkeydown: function(e, direction) {
          if (!_.contains(k.directions, e.keyCode)) { return }
          var newPosition = world.selected.position.clone();
          newPosition.x += direction.x;
          newPosition.y += direction.y;

          if (newObject = world.at(newPosition)) {
            world.select(newObject);
            world.clearGhost();
          } else if (world.ghost) {
            world.ghost.position = newPosition;
          } else {
            setHelp('Press c to place object');
            newObject = randomBox();
            newObject.position = newPosition;
            newObject.setColorSeed(world.colorSeed || [0,20]);
            world.objects.push(newObject);
            world.ghost = newObject;
            world.select(newObject);

          }
        }
    },
};



var mode;
function setMode(name) {
  if (el = document.getElementById(mode)) el.style.border = "3px solid white";
  document.getElementById(name).style.border = "3px solid #ddd"
  mode = name
  setHelp();
}

setMode('move');

function save(label) {
  var objects = _.map(world.objects, function(object) {
    return {
      x: object.position.x, 
      y: object.position.y,
      colorSeed: object.colorSeed,
    }
  });

  var params = {
    type: "POST",
    url: "/things",
    data: {
      label: label,
      objects: objects
    },
    success: function(response) {
      document.location = response.url;
    },
    dataType: 'json',
  }
  $.ajax(params);
}

function load(label) {
  world.objects = [];
  world.ghost = null;
  _.each(JSON.parse(window.localStorage.getItem(label)), function(hash) {
    var box = new Box();
    box.position.set(hash.x, hash.y, -8);
    box.setColorSeed(hash.colorSeed);
    world.objects.push(box);
  });
  world.select(world.objects[0]);
}

document.onkeydown = function (e) {

    newMode = _.find(modes, function(attr,name) {
        if(attr.key.charCodeAt(0) == e.keyCode) {
            if (f = attr.onload) { f() }
            setMode(name);
        }
    })

    if (newMode) { return setHelp() }

    if (f = modes[mode].onkeydown) { 
        f(e, arrowKeyDirection(e));
    }

    if (e.keyCode == 'S'.charCodeAt(0)) {
      var label = prompt('enter a label');
      save(label);
    }
}

k = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
}

k.directions = [k.up, k.right, k.down, k.left];

function arrowKeyDirection(e) {
    var direction = {x:0, y:0, z:0};
    switch(e.keyCode) {
        case k.up: direction.y = 1; break;
        case k.right: direction.x = 1; break;
        case k.down: direction.y = -1; break;
        case k.left: direction.x = -1; break;
    }
    return direction;        
}

function bounded(val,min,max) {
    return Math.max(Math.min(val,max), min);
}

var color = [12,10];

function setHelp(message) {
  message = message || (mode ? modes[mode].help : null)
  document.getElementById('message').innerHTML = message
}

setHelp();
