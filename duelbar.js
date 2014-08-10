if (typeof fedecade == 'undefined') {
  fedecade = new Object();
}

(function() {

  /***
   * constructor
   */
  fedecade.duelbar = function() {

    /**
     * grobal parmeters
     */
    var dparm = {
      width: 600,
      height: 30,
      bar_width: 300,
      bar_height: 30,
      bar_border_width: 1,
      bar_border_style: 'solid',
      bar_unit_type: 'px',
    };

    this.gparm = dparm;
    
  };

  /***
   * prototype
   */
  var prototype = fedecade.duelbar.prototype;

  prototype.draw = function(client, lval, rval) {

    var parm = this.gparm;

    var frame = this._create_barframe();
    client.appendChild(frame);

    var tval = lval + rval;
    var lw = Math.floor(parm.width * lval / tval);
    var rw = parm.width - lw;
    var ll = lw * -1;
    var rl = parm.width;
    var h = parm.height;

    var lbar = this._draw_static_bar('#f542c8', lw, h, ll);
    // var lbar = this._draw_static_bar('#f542c8', 400, 30, -400);
    // var lbar = this._draw_static_bar('#f542c8', 400, 30, 0);
    lbar.style.borderRight = 'none';
    this._animate(lbar, lw, ll, 'increase');
    // this._animate(lbar, 400, -400, 'increase');
    // var rbar = this._draw_static_bar('#6542f5', 300, 30, 600);
    // var rbar = this._draw_static_bar('#6542f5', 200, 30, 600);
    var rbar = this._draw_static_bar('#6542f5', rw, h, rl);
    rbar.style.borderLeft = 'none';
    // this._animate(rbar, 200, 600, 'decrease');
    this._animate(rbar, rw, rl, 'decrease');
    frame.appendChild(lbar);
    frame.appendChild(rbar);

  };

  prototype._create_barframe = function() {

    var frame = document.createElement('DIV'); 
    
    var parm = this.gparm;

    frame.style.width = this._num_to_cssstr(parm.width, 'px');
    frame.style.height = this._num_to_cssstr(parm.height, 'px');
    frame.style.position = 'relative';
    frame.style.overflow = 'hidden';
    frame.style.borderWidth = parm.frame_border_width + parm.frame_unit_type;
    frame.style.borderStyle = parm.frame_border_style;
    frame.style.backgroundColor = '#C0C0C0';

    return frame;
  };

  prototype._num_to_cssstr = function(number, suffix) {
    return number + suffix;
  }

  prototype._animate = function(bar, width, left, direction) {

    var speed = 7;
    var from = 0;
    var to = 100;

    var curper = 0;
    var maxper = to;
    var _this = this;

    var fn = function() {
      var diff = 0.1 * speed;
      switch (direction) {
        case 'increase':
          if (curper < maxper) {
            curper += diff;
            if (curper > maxper) {
              curper = maxper;
            }
          } else {
            curper -= diff;
            if (curper < maxper) {
              curper = maxper;
            }
          }
          bar.style.left = (width * (100 - curper) / 100) * -1 + "px";
          break;
        case 'decrease':
          if (curper > maxper) {
            curper -= diff;
            if (curper < maxper) {
              curper = maxper;
            }
          } else {
            curper += diff;
            if (curper > maxper) {
              curper = maxper;
            }
          }
          // bar.style.left = width + (width * (100 - curper) / 100) + "px";
          bar.style.left = left - width + (width * (100 - curper) / 100) + "px";
          break;
      }
      if (curper != maxper) {
        setTimeout(fn, 10);
      }
    }
    fn();

  };

  prototype._draw_static_bar = function(color, width, height, left) {

    var parm = this.gparm;

    var bar = document.createElement('DIV');

    bar.style.width = this._num_to_cssstr(width, 'px');
    bar.style.height = this._num_to_cssstr(height, 'px');
    bar.style.position = 'absolute';
    bar.style.left = this._num_to_cssstr(left, 'px');
    // bar.style.overflow = 'hidden';
    bar.style.borderWidth = parm.bar_border_width + parm.bar_unit_type;
    bar.style.borderStyle = parm.bar_border_style;
    bar.style.float = 'left';

    var canvas = document.createElement('CANVAS');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    var baseColor = this._colorcode_to_rgb(color);
    var color1 = this._rgb_to_cssformat(this._lighten_rgb(baseColor, -0.15));
    var color2 = this._rgb_to_cssformat(this._lighten_rgb(baseColor, 0));
    var color3 = this._rgb_to_cssformat(this._lighten_rgb(baseColor, 0.15));
    var grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0.0, color1);
    grad.addColorStop(0.4, color2);
    grad.addColorStop(1.0, color3);
    ctx.fillStyle = grad;
    // ctx.rect(0, 0, parm.bar_width, parm.bar_height);
    ctx.rect(0, 0, width, height);
    ctx.fill();

    bar.appendChild(canvas);

    return bar;

  };

  /***
   * private methods
   */
  prototype._colorcode_to_rgb = function(colorcode) {
    var rgb = {};
    var hex = colorcode.match(/\#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/);
    rgb.r = parseInt(hex[1], 16);
    rgb.g = parseInt(hex[2], 16);
    rgb.b = parseInt(hex[3], 16);
    rgb.a = 1;

    return rgb;
  };

  prototype._rgb_to_cssformat = function(rgb) {
    var cssfmt = "rgb(" + rgb.r + ","  + rgb.g + ","  + rgb.b;
    if (typeof(rgb.a) != "undefined") {
      cssfmt = cssfmt +  ","  + rgb.a;
    }
    cssfmt = cssfmt + ")";
    return cssfmt;
  };

  prototype._rgb_to_yuv = function(rgb) {
    var r = {
      y: {r:  0.299, g:  0.587,  b:  0.144}, 
      u: {r: -0.169, g: -0.3316, b:  0.500}, 
      v: {r:  0.500, g: -0.4186, b: -0.0813},
    };

    return {
      y: parseInt(r.y.r * rgb.r + r.y.g * rgb.g + r.y.b * rgb.b),
      u: parseInt(r.u.r * rgb.r + r.u.g * rgb.g + r.u.b * rgb.b),
      v: parseInt(r.v.r * rgb.r + r.v.g * rgb.g + r.v.b * rgb.b),
    };
  };

  prototype._yuv_to_rgb = function(yuv) {
    var rgb = {
      r: parseInt(yuv.y + 1.402 * yuv.v),
      g: parseInt(yuv.y - 0.714 * yuv.v - 0.344 * yuv.u),
      b: parseInt(yuv.y + 1.772 * yuv.u),
    };
    for (var el in rgb) {
      if (rgb[el] > 255) {
        rgb[el] = 255;
      } else if (rgb[el] < 0) {
        rgb[el] = 0;
      }
    }
    return rgb;
  };

  prototype._lighten_rgb = function(rgb, gainrate) {
    var yuv = this._rgb_to_yuv(rgb);
    yuv.y = yuv.y + gainrate * 256;
    return this._yuv_to_rgb(yuv);
  };

} ());
