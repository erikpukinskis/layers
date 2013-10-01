var camera;
var z=-10;


function webGLStart() {
    PhiloGL('canvas', {
      program: {
          from: 'ids',
          vs: 'shader-vs',
          fs: 'shader-fs'
      },
      onError: function () {
          alert("An error ocurred while loading the application");
      },
      onLoad: function (app) {
          var gl = app.gl,
              canvas = app.canvas,
              program = app.program,
              view = new PhiloGL.Mat4,
              rCube = 0;

          camera = app.camera;
          gl.viewport(0, 0, canvas.width, canvas.height);
          if (mode == 'show') {
            gl.clearColor(255,255,255,1);
          } else {
            gl.clearColor(0,0,0,1);
          }
          gl.clearDepth(1);
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);

          function setupElement(elem) {
              //update element matrix
              elem.update();
              //get new view matrix out of element and camera matrices
              view.mulMat42(camera.view, elem.matrix);
              //set buffers with element data
              program.setBuffers({
                  'aVertexPosition': {
                      value: elem.vertices,
                      size: 3
                  },
                  'aVertexColor': {
                      value: elem.colors,
                      size: 4
                  },
              });
              //set uniforms
              program.setUniform('uMVMatrix', view);
              program.setUniform('uPMatrix', camera.projection);

          }

          function tick() {
              drawScene();
              PhiloGL.Fx.requestAnimationFrame(tick);
          }

            function drawScene() {
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                camera.view.id()
                  .$rotateXYZ(0,0,0)
                  .$translate(0.1,0,z);

                //Draw World
                for(var i=0; i<world.objects.length; i++) {
                    setupElement(world.objects[i]);

                    if (g = world.glower) { g.glow() }

                    program.setBuffer('indices', {
                        value: world.objects[i].indices,
                        bufferType: gl.ELEMENT_ARRAY_BUFFER,
                        size: 1
                    });

                    gl.drawElements(gl.TRIANGLES, world.objects[i].indices.length, gl.UNSIGNED_SHORT, 0);
                }
            }

          tick();
      }
    });

}