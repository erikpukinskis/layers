
    var width = 25;
    var height = 20;
    var segments = 5;
    var satCutoff = 1.5;

    function hsl(x,y) {
      var h = x / width * 365;
      var l = (y+1) / (height+1) * 100;
      var s = l % (100/segments) * (segments-satCutoff) + (100/segments*satCutoff);
      return [parseInt(h),parseInt(s),parseInt(l)];
    }

    function hslString(color) {
      return "hsl(" + color[0] + ", " + color[1] + "%, " + color[2] + "%)";
    }

    function rgbString(color) {
      rgb = hslToRgb(color);
      return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    }

    function hexString(color) {
      var rgb = hslToRgb(color);
      return '#' + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
    }

    function hslToRgb(color){
      var h = color[0]/365;
      var s = color[1]/100;
      var l = color[2]/100;
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return [parseInt(r * 255), parseInt(g * 255), parseInt(b * 255)];
    }
