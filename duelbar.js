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
      width: 1000,
      height: 60,
      bar_border_width: 1,
      bar_border_style: 'solid',
      bar_unit_type: 'px',
      count_font: 'Arial, sans-serif',
      count_size: '20px',
      count_color: 'white',
      count_margin: 15,
      count_suffix: "人",
			count_shadow_color: '#101010',
			left_bar_color: '#f542c8',
			right_bar_color: '#6542f5',
			pointer_img: './pointer.png',
			pointer_img_width: 140,
			pointer_img_height: 55,
			pointer_depth: 10,
			background_color: '#C0C0C0',
			bar_speed: 20,
    };

    this.gparm = dparm;

		this.bar_draw_finished = {left: false, right: false};
    
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

		var ptrfrm = this._create_pointerframe();
		var ptr = this._create_pointer(lw);
		ptrfrm.appendChild(ptr);
		client.appendChild(ptrfrm);

    var lcount = this._create_count_box();
		this._draw_count(lcount, lval);
    var lbox_size = this._get_box_size(lcount, frame);
		var lcntpos = {left: parm.count_margin, top: Math.floor((parm.height - lbox_size.h) / 2)};
    lcount.style.left = this._num_to_cssstr(lcntpos.left, 'px');
		lcount.style.top = this._num_to_cssstr(lcntpos.top, 'px');
    var lbar = this._draw_static_bar(parm.left_bar_color, lw, h, ll, lcount);
    lbar.style.borderRight = 'none';
    frame.appendChild(lbar);
		var lshadow = this._create_shadowed_number(lcount, frame, lcntpos);
		frame.appendChild(lcount);
		this._animate(lbar, lw, ll, 'increase', lcount, lval, lshadow);
    
    var rcount = this._create_count_box();
		this._draw_count(rcount, rval);
    var rbox_size = this._get_box_size(rcount, frame);
		var rcntpos = {left: parm.width - rbox_size.w - parm.count_margin, top: Math.floor((parm.height - rbox_size.h) / 2)};
    rcount.style.left = this._num_to_cssstr(rcntpos.left, 'px');
		rcount.style.top = this._num_to_cssstr(rcntpos.top, 'px');
    var rbar = this._draw_static_bar(parm.right_bar_color, rw, h, rl, rcount);
    rbar.style.borderLeft = 'none';
		frame.appendChild(rbar);
		var rshadow = this._create_shadowed_number(rcount, frame, rcntpos);
		frame.appendChild(rcount);
		this._animate(rbar, rw, rl, 'decrease', rcount, rval, rshadow);

		this._slide_pointer(ptr);

  };

	prototype._create_pointer = function(position) {

		var hide = '-1000px';
		var ptrimg_w = this.gparm.pointer_img_width;
		var ptrimg_h = this.gparm.pointer_img_height;
		var ptrimg = new Image();
		ptrimg.src = this.gparm.pointer_img;
		ptrimg.style.position = 'relative';
		ptrimg.style.width = this._num_to_cssstr(ptrimg_w, 'px');
		ptrimg.style.height = this._num_to_cssstr(ptrimg_h, 'px');
		ptrimg.style.top = hide;
		ptrimg.style.left = this._num_to_cssstr(position - ptrimg_w / 2, 'px');
		
		return ptrimg;
	};

	prototype._slide_pointer = function(ptr) {

		var curpos = this.gparm.pointer_depth * -4;
		var minpos = 0;
		var maxpos = 0;
		var delay = 0;
		var fmt = this._num_to_cssstr;
		var interval = 1;
		var remain = 3;
		// var egd = [20, 0, 10];
		var egd = [this.gparm.pointer_depth * 2, 0, this.gparm.pointer_depth];
		var dly = [1.06, 1, 1.05];
		var _this = this;

		var fnd = function() {
			if (remain == 0) { return; }
			maxpos = egd[3-remain];
			delay = dly[3-remain];
			if (curpos < maxpos) {
				curpos += 1;
				if (curpos > maxpos) {
					curpos = maxpos;
				}
			}
			ptr.style.top = fmt(curpos, 'px');
			if (curpos != maxpos) {
				setTimeout(fnd, interval *= delay);
			} else {
				setTimeout(fnu, interval *= delay);
				remain--;
			}
		};
		var fnu = function() {
			if (remain == 0) { return; }
			minpos = egd[3-remain];
			delay = dly[3-remain];
			if (curpos > minpos) {
				curpos -= 1;
				if (curpos > minpos) {
					curpos = minpos;
				}
			}
			ptr.style.top = fmt(curpos, 'px');
			if (curpos != minpos) {
				setTimeout(fnu, interval *= delay);
			} else {
				setTimeout(fnd, interval *= delay);
				remain--;
			}
		};

		var boot = function() {
			if (_this.bar_draw_finished.left == true && _this.bar_draw_finished.right == true) {
				fnd();
			} else {
				setTimeout(boot, 10);
			}
		};

		boot();
	};

  prototype._create_pointerframe = function() {

    var frame = document.createElement('DIV'); 
    
    var parm = this.gparm;

		frame.style.marginTop = this._num_to_cssstr((this.gparm.height + this.gparm.pointer_img_height - this.gparm.pointer_depth) * -1, 'px');
    frame.style.width = this._num_to_cssstr(parm.width, 'px');
    frame.style.position = 'relative';
    frame.style.border = 'none';

    return frame;
  };

  prototype._create_barframe = function() {

    var frame = document.createElement('DIV'); 
    
    var parm = this.gparm;

		frame.style.marginTop = this._num_to_cssstr(this.gparm.pointer_img_height, 'px');
    frame.style.width = this._num_to_cssstr(parm.width, 'px');
    frame.style.height = this._num_to_cssstr(parm.height, 'px');
    frame.style.position = 'relative';
    frame.style.overflow = 'hidden';
    frame.style.borderWidth = parm.frame_border_width + parm.frame_unit_type;
    frame.style.borderStyle = parm.frame_border_style;
    frame.style.backgroundColor = this.gparm.background_color;

    return frame;
  };

  prototype._num_to_cssstr = function(number, suffix) {
    return number + suffix;
  }

  prototype._animate = function(bar, width, left, direction, cntbox, val, shadow) {

    var speed = this.gparm.bar_speed;
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
          _this._draw_count(cntbox, Math.floor(curper * val / 100), shadow);
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
          _this._draw_count(cntbox, Math.floor(curper * val / 100), shadow);
          break;
      }
      if (curper != maxper) {
        setTimeout(fn, 10);
			} else {
				switch (direction) {
					case 'increase':
						_this.bar_draw_finished.left = true;
						break;
					case 'decrease':
						_this.bar_draw_finished.right = true;
						break;
				}
      }
    }
    fn();

  };

  prototype._draw_static_bar = function(color, width, height, left, cntbox) {

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

    // this._draw_count(cntbox, 0, shadow);
    
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

  prototype._create_count_box = function() {
    var parm = this.gparm;
    var box = document.createElement('DIV');
    box.style.margin = 0;
    box.style.padding = 0;
    box.style.position = 'absolute';
    box.style.fontFamily = parm.count_font;
    box.style.fontSize = parm.count_size;
    box.style.color = parm.count_color;
		// box.style.textShadow = "0 1px 1px #101010, 1px 0 1px #101010, 0 -1px 1px #101010, -1px 0 1px #101010, -1px -1px 1px #101010, 1px -1px 1px #101010, -1px 1px 1px #101010, 1px 1px 1px #101010";
    return box;
  };

  prototype._draw_count = function(box, count, shadow) {
		var cnt = this._num_to_separated_str(count, ',', this.gparm.count_suffix);
		if (typeof(shadow) != 'undefined') {
			for (var i = 0; i < shadow.length; i++) {
				shadow[i].innerHTML = cnt;
			}
		}
		box.innerHTML = cnt;
  };

  prototype._get_box_size = function(box, frame) {
    var vis = box.style.visible;
    box.style.visible = "hidden";
    frame.appendChild(box);
    var sizes = {
      w: box.offsetWidth,
      h: box.offsetHeight,
    };
    frame.removeChild(box);
    box.style.visible = vis;
    return sizes;
  };

	prototype._num_to_separated_str = function(num, delim, suffix) {
		var sep = String(num);
		return sep.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delim) + suffix;
	};	

	prototype._create_shadowed_number = function(cntbox, frame, cntpos) {
		var parm = this.gparm;
		// var diff = [[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1]];
		var diff = [[0,1.5],[0,-1.5],[1.5,0],[1.5,1.5],[1.5,-1.5],[-1.5,0],[-1.5,1.5],[-1.5,-1.5]];
		var cntshadow = [];
		for (var i = 0; i < diff.length; i++) {
			var shadow = cntbox.cloneNode(true);
			shadow.style.margin = '0px';
			shadow.style.padding = '0px';
			shadow.style.position = 'absolute';
			shadow.style.color = parm.count_shadow_color;
			shadow.style.fontFamily = parm.count_font;
			shadow.style.fontSize = parm.count_size;
			shadow.style.left = (cntpos.left + diff[i][0]) + 'px';
			shadow.style.top = (cntpos.top + diff[i][1]) + 'px';
			frame.appendChild(shadow);
			cntshadow.push(shadow);
		}
		return cntshadow;
	};

} ());
