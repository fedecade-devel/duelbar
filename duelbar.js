if (typeof(fedecade) == 'undefined') {
  fedecade = new Object();
}

(function() {

  /***
   * constructor
   */
  fedecade.duelbar = function(container, param) {

		/**
		 * container region
		 */
		if (!(this.container = document.getElementById(container))) {
			return false;
		}

    /**
     * grobal parmeter defaut values
     */
    var default_params = {
      width: 1000,
      height: 60,
      frame_border_width: 1,
			frame_border_color: '#101010',
      frame_border_style: 'solid',
      count_font: 'Arial, sans-serif',
      count_size: '20px',
      count_color: 'white',
      count_margin: 15,
      count_suffix: "人",
			count_suffix_margin: 2,
			count_suffix_size: '16px',
			count_shadow_color: '#101010',
			left_bar_color: '#f542c8',
			right_bar_color: '#6542f5',
			pointer_img: './pointer.png',
			pointer_img_width: 140,
			pointer_img_height: 55,
			pointer_img_top_margin: 20,
			pointer_depth: 30,
			background_color: '#C0C0C0',
			bar_speed: 20,
			bar_style: 'gradient',
			animation: false,
			pointer_fall_speed: [0.05, 0.75, 0.59],
			gradient_lightness: [-0.15, 0, 0.15],
			gradient_position: [0.0, 0.4, 1.0],
			pointer_frame_width: 0,
			shadow: false
    };

    /**
     * grobal parmeters
     */
    this.global_params = default_params;

		/***
		 * accept user define parameters
		 */
		if (typeof(param) != 'undefined') {
			if (typeof(param.width) != 'undefined') {
				this.global_params.width = param.width;
			}
			if (typeof(param.height) != 'undefined') {
				this.global_params.height = param.height;
			}
			if (typeof(param.leftbar_color) != 'undefined') {
				this.global_params.left_bar_color = param.leftbar_color;
			}
			if (typeof(param.rightbar_color) != 'undefined') {
				this.global_params.right_bar_color = param.rightbar_color;
			}
			if (typeof(param.count_size) != 'undefined') {
				this.global_params.count_size = param.count_size;
			}
			if (typeof(param.count_suffix_size) != 'undefined') {
				this.global_params.count_suffix_size = param.count_suffix_size;
			}
			if (typeof(param.border_width) != 'undefined') {
				this.global_params.frame_border_width = param.border_width;
			}
			if (typeof(param.border_color) != 'undefined') {
				this.global_params.frame_border_color = param.border_color;
			}
			if (typeof(param.bar_style) != 'undefined') {
				this.global_params.bar_style = param.bar_style;
			}
			if (typeof(param.animation) != 'undefined') {
				this.global_params.animation = param.animation;
			}
			if (typeof(param.shadow) != 'undefined') {
				this.global_params.shadow = param.shadow;
			}
			if (typeof(param.count_shadow_color) != 'undefined') {
				this.global_params.count_shadow_color = param.count_shadow_color;
			}
		}

		this.global_params.pointer_frame_width = this.global_params.width + (this.global_params.frame_border_width * 2);

		/**
		 * setup constants
		 */
		this.bar_draw_finished = {left: false, right: false};
    
  };

  /***
   * prototype
   */
  var prototype = fedecade.duelbar.prototype;

	/***
	 * public methods
	 */
	prototype.draw = function(left_bar_value, right_bar_value) {

		var param = this.global_params;

		var container = this.container;
		
		var content_frame = this._create_content_frame();
		container.appendChild(content_frame);

		var pointer_frame = this._create_pointer_frame();
		content_frame.appendChild(pointer_frame);

		var bar_frame = this._create_bar_frame();
		content_frame.appendChild(bar_frame);

		this.left_bar_prop = {
			width: Math.floor(param.width * (left_bar_value / (left_bar_value + right_bar_value))),
			height: param.height,
			left: 0,
			color: param.left_bar_color,
			value: left_bar_value
		};

		this.right_bar_prop = {
			width: param.width - this.left_bar_prop.width,
			height: param.height,
			left: this.left_bar_prop.width,
			color: param.right_bar_color,
			value: right_bar_value
		};

		if (param.animation) {

			/* left bar */
			var left_counts = this._prepare_left_static_count(bar_frame, this.left_bar_prop);
			var left_bar = this._slide_animated_left_bar(this._draw_static_bar(this.left_bar_prop), this.left_bar_prop, left_counts.counter, left_counts.shadowed_counter);
			bar_frame.appendChild(left_bar);
			if (param.shadow) {
				bar_frame.appendChildlen(left_counts.shadowed_counter);
				bar_frame.appendChildlen(left_counts.shadowed_counter_suffix);
			}
			bar_frame.appendChild(left_counts.counter);
			bar_frame.appendChild(left_counts.suffix);

			/* right bar */
			var right_counts = this._prepare_right_static_count(bar_frame, this.right_bar_prop);
			var right_bar = this._slide_animated_right_bar(this._draw_static_bar(this.right_bar_prop), this.right_bar_prop, right_counts.counter, right_counts.shadowed_counter);
			bar_frame.appendChild(right_bar);
			if (param.shadow) {
				bar_frame.appendChildlen(right_counts.shadowed_counter);
				bar_frame.appendChildlen(right_counts.shadowed_counter_suffix);
			}
			bar_frame.appendChild(right_counts.counter);
			bar_frame.appendChild(right_counts.suffix);

			/* pointer */
			var pointer = this._animated_pointer();
			pointer_frame.appendChild(pointer);

		} else {

			bar_frame.appendChild(this._draw_static_bar(this.left_bar_prop));
			bar_frame.appendChild(this._draw_static_bar(this.right_bar_prop));

			var left_counts = this._prepare_left_static_count(bar_frame, this.left_bar_prop);
			if (param.shadow) {
				bar_frame.appendChildlen(left_counts.shadowed_counter);
				bar_frame.appendChildlen(left_counts.shadowed_counter_suffix);
			}
			bar_frame.appendChild(left_counts.counter);
			bar_frame.appendChild(left_counts.suffix);

			var right_counts = this._prepare_right_static_count(bar_frame, this.right_bar_prop);
			if (param.shadow) {
				bar_frame.appendChildlen(right_counts.shadowed_counter);
				bar_frame.appendChildlen(right_counts.shadowed_counter_suffix);
			}
			bar_frame.appendChild(right_counts.counter);
			bar_frame.appendChild(right_counts.suffix);

			pointer_frame.appendChild(this._draw_static_pointer(param.pointer_img_top_margin));

		}

	};

	/***
	 * private methods
	 */
  prototype._create_content_frame = function() {

    var param = this.global_params;

    var frame = document.createElement('DIV'); 

    frame.style.position = 'relative';
    frame.style.width = 'auto';
    frame.style.height = 'auto';
    frame.style.overflow = 'hidden';

    return frame;

  };

	prototype._create_pointer_frame = function() {

    var param = this.global_params;

    var frame = document.createElement('DIV'); 

    frame.style.position = 'relative';
		frame.style.width = this._to_pixcel_num_str(param.pointer_frame_width);
		frame.style.height = this._to_pixcel_num_str(param.pointer_img_height + param.pointer_img_top_margin);
		frame.style.zIndex = 1;

    return frame;

	};

	prototype._create_bar_frame = function() {

    var param = this.global_params;

    var frame = document.createElement('DIV'); 

    frame.style.position = 'relative';
    frame.style.width = this._to_pixcel_num_str(param.width);
    frame.style.height = this._to_pixcel_num_str(param.height);
    frame.style.overflow = 'hidden';
    frame.style.borderWidth = this._to_pixcel_num_str(param.frame_border_width);
    frame.style.borderColor = param.frame_border_color;
    frame.style.borderStyle = param.frame_border_style;
    frame.style.backgroundColor = this.global_params.background_color;

		frame.appendChildlen = function(childlen) {
			for (var i = 0; i < childlen.length; i++) {
				frame.appendChild(childlen[i]);
			}
		};

    return frame;

	};

	prototype._create_counter_box = function() {

    var param = this.global_params;

    var box = document.createElement('DIV'); 

    box.style.position = 'absolute';
    box.style.margin = 0;
    box.style.padding = 0;
    box.style.fontFamily = param.count_font;
    box.style.fontSize = param.count_size;
    box.style.color = param.count_color;
		box.style.textAlign = 'right';

    return box;

	}

	prototype._create_counter_suffix_box = function() {

    var param = this.global_params;

    var box = document.createElement('DIV'); 

    box.style.position = 'absolute';
    box.style.margin = 0;
    box.style.padding = 0;
    box.style.fontFamily = param.count_font;
    box.style.fontSize = param.count_suffix_size;
    box.style.color = param.count_color;

    return box;

	}

	prototype._draw_static_bar = function(prop) {

		var param = this.global_params;

		var bar = document.createElement('DIV');

		bar.style.position = 'absolute';
		bar.style.width = this._to_pixcel_num_str(prop.width);
		bar.style.height = this._to_pixcel_num_str(prop.height);
		bar.style.left = this._to_pixcel_num_str(prop.left);
		bar.style.float = 'left';

		if (param.bar_style === 'gradient') {
			
			var canvas = document.createElement('CANVAS');

			if (canvas && canvas.getContext) {

				canvas.width = prop.width;
				canvas.height = prop.height;
				bar.appendChild(canvas);

				var ctx = canvas.getContext('2d');
				
				ctx.beginPath();

				var rgb = this._colorcode_to_rgb(prop.color);
				var color_top = this._rgb_to_cssformat(this._lighten_rgb(rgb, param.gradient_lightness[0]));
				var color_mid = this._rgb_to_cssformat(this._lighten_rgb(rgb, param.gradient_lightness[1]));
				var color_btm = this._rgb_to_cssformat(this._lighten_rgb(rgb, param.gradient_lightness[2]));
				var grad = ctx.createLinearGradient(0, 0, 0, prop.height);
				grad.addColorStop(param.gradient_position[0], color_top);
				grad.addColorStop(param.gradient_position[1], color_mid);
				grad.addColorStop(param.gradient_position[2], color_btm);

				ctx.fillStyle = grad;
				ctx.rect(0, 0, prop.width, prop.height);
				ctx.fill();

			} else if (document.uniqueID) {

				var rgb = this._colorcode_to_rgb(prop.color);
				var color_top = this._rgb_to_csshexformat(this._lighten_rgb(rgb, parm.gradient_lightness[0]));
				var color_btm = this._rgb_to_csshexformat(this._lighten_rgb(rgb, parm.gradient_lightness[2]));
				bar.style.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=" + color_btm + ",EndColorStr=" + color_top + ")";

			} else {
				bar.style.backgroundColor = prop.color;
			}

		} else {
			bar.style.backgroundColor = prop.color;
		}

		return bar;

	}

	prototype._prepare_left_static_count = function(frame, left_bar_prop) {

		var param = this.global_params;
		var _this = this;

		var counter = _this._create_counter_box();
		counter.innerHTML = _this._num_to_separated_str(left_bar_prop.value, ',');
		var counter_size = _this._calcualte_box_size(counter, frame);
		
		var suffix = _this._create_counter_suffix_box();
		suffix.innerHTML = param.count_suffix;
		var suffix_size = _this._calcualte_box_size(suffix, frame);

		var counter_top = Math.floor((param.height - counter_size.height) / 2);
		var counter_left = param.count_margin;
		counter.style.top = _this._to_pixcel_num_str(counter_top);
		counter.style.left = _this._to_pixcel_num_str(counter_left);

		var suffix_top = counter_size.height - suffix_size.height + counter_top;
		var suffix_left = counter_size.width + counter_left + param.count_suffix_margin
		suffix.style.top = _this._to_pixcel_num_str(suffix_top);
		suffix.style.left = _this._to_pixcel_num_str(suffix_left);

		counter.style.width = this._to_pixcel_num_str(counter_size.width);
		
		var shadowed_counter = (param.shadow) ? (this._create_shadowed_counter(counter, {top: counter_top, left: counter_left})) : (null);
		var shadowed_counter_suffix = (param.shadow) ? (this._create_shadowed_counter_suffix(suffix, {top: suffix_top, left: suffix_left})) : (null);

		return {counter: counter, suffix: suffix, shadowed_counter: shadowed_counter, shadowed_counter_suffix: shadowed_counter_suffix};

	}

	prototype._prepare_right_static_count = function(frame, right_bar_prop) {

		var param = this.global_params;
		var _this = this;

		var counter = _this._create_counter_box();
		counter.innerHTML = _this._num_to_separated_str(right_bar_prop.value, ',');
		var counter_size = _this._calcualte_box_size(counter, frame);

		var suffix = _this._create_counter_suffix_box();
		suffix.innerHTML = param.count_suffix;
		var suffix_size = _this._calcualte_box_size(suffix, frame);
		
		var counter_top = Math.floor((param.height - counter_size.height) / 2);
		var counter_left = param.width - (counter_size.width + param.count_suffix_margin + suffix_size.width + param.count_margin);
		counter.style.top = _this._to_pixcel_num_str(counter_top);
		counter.style.left = _this._to_pixcel_num_str(counter_left);

		var suffix_top = counter_size.height - suffix_size.height + counter_top;
		var suffix_left = param.width - (suffix_size.width + param.count_margin);
		suffix.style.top = _this._to_pixcel_num_str(suffix_top);
		suffix.style.left = _this._to_pixcel_num_str(suffix_left);

		counter.style.width = this._to_pixcel_num_str(counter_size.width);

		var shadowed_counter = (param.shadow) ? (this._create_shadowed_counter(counter, {top: counter_top, left: counter_left})) : (null);
		var shadowed_counter_suffix = (param.shadow) ? (this._create_shadowed_counter_suffix(suffix, {top: suffix_top, left: suffix_left})) : (null);

		return {counter: counter, suffix: suffix, shadowed_counter: shadowed_counter, shadowed_counter_suffix: shadowed_counter_suffix};
	}

	prototype._draw_static_pointer = function(top_position) {

		var param = this.global_params;

		var pointer = this._create_pointer();

		this._slide_pointer(pointer, this.right_bar_prop.left + param.frame_border_width);
		pointer.style.top = this._to_pixcel_num_str(top_position);

		return pointer;

	};

	prototype._slide_pointer = function(pointer, position) {

		var param = this.global_params;

		var left = this._to_pixcel_num_str(position - param.pointer_img_width / 2);
		pointer.style.left = left;

	};

	prototype._create_pointer = function() {

		var param = this.global_params;

		var pointer_prop = {
			width: param.pointer_img_width,
			height: param.pointer_imt_height
		};

		var pointer_img = new Image();

		pointer_img.style.position = 'absolute';
		pointer_img.src = param.pointer_img;
		pointer_img.style.width = this._to_pixcel_num_str(param.pointer_img_width);
		pointer_img.style.height = this._to_pixcel_num_str(param.pointer_img_height);
		pointer_img.style.top = this._to_pixcel_num_str(0);
		pointer_img.style.left = this._to_pixcel_num_str(0);

		return pointer_img;

	};

	prototype._calcualte_box_size = function(box, frame) {

    var vis = box.style.visible;

    box.style.visible = "hidden";
    frame.appendChild(box);

    var sizes = {
      width: box.offsetWidth,
      height: box.offsetHeight
    };

    frame.removeChild(box);
    box.style.visible = vis;

    return sizes;

	};

	prototype._slide_animated_left_bar = function(bar, bar_prop, counter, shadows) {

		bar.style.left = this._to_pixcel_num_str(bar_prop.width * -1);

		var param = this.global_params;

		var from = 0;
		var to = 100;

		var curpos = from;
		var maxpos = to;
		var _this = this;

		var fn = function() {

      var diff = 0.1 * param.bar_speed;

			if (curpos < maxpos) {
				curpos += diff;
				if (curpos > maxpos) {
					curpos = maxpos;
				}
			} else {
				curpos -= diff;
				if (curpos < maxpos) {
					curpos = maxpos;
				}
			}

			bar.style.left = _this._to_pixcel_num_str((bar_prop.width * (100 - curpos) / 100) * -1);

			_this._draw_counter(counter, Math.floor(curpos * bar_prop.value / 100), shadows);

      if (curpos != maxpos) {
        setTimeout(fn, 10);
			} else {
				_this.bar_draw_finished.left = true;
      }

		};

		fn();

		return bar;

	};

	prototype._slide_animated_right_bar = function(bar, bar_prop, counter, shadows) {

		bar.style.left = this._to_pixcel_num_str(bar_prop.left + bar_prop.width);

		var param = this.global_params;

		var from = 0;
		var to = 100;

		var curpos = from;
		var maxpos = to;
		var _this = this;

		var fn = function() {

			var diff = 0.1 * param.bar_speed;

			if (curpos > maxpos) {
				curpos -= diff;
				if (curpos < maxpos) {
					curpos = maxpos;
				}
			} else {
				curpos += diff;
				if (curpos > maxpos) {
					curpos = maxpos;
				}
			}

			bar.style.left = _this._to_pixcel_num_str((bar_prop.left + bar_prop.width) - (bar_prop.width * curpos / 100));

			_this._draw_counter(counter, Math.floor(curpos * bar_prop.value / 100), shadows);

			if (curpos != maxpos) {
				setTimeout(fn, 10);
			} else {
				_this.bar_draw_finished.right = true;
			}

		};

		fn();

		return bar;

	};

	prototype._animated_pointer = function() {

		var pointer = this._draw_static_pointer((this.global_params.pointer_img_height + this.global_params.pointer_img_top_margin) * -1);

		var curpos = this.global_params.pointer_depth * -4;
		var minpos = 0;
		var maxpos = 0;
		var delay = 0;
		var fmt = this._num_to_cssstr;
		var interval = 1;
		var remain = 3;
		var egd = [this.global_params.pointer_depth * 1, this.global_params.pointer_depth * -0.5, this.global_params.pointer_img_top_margin];
		var dly = this.global_params.pointer_fall_speed;
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

			pointer.style.top = fmt(curpos, 'px');

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

			pointer.style.top = fmt(curpos, 'px');

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

		return pointer;

	};

	prototype._draw_counter = function(counter, value, shadows) {

		var count = this._num_to_separated_str(value, ',');

		counter.innerHTML = count;

		if (this.global_params.shadow) {
			for (var i = 0; i < shadows.length; i++) {
				shadows[i].innerHTML = count;
			}
		}
		
	};

	prototype._create_shadowed_counter = function(counter, counter_position) {

		var parm = this.global_params;

		var cntshadow = [];

		var diff = [[0,1.5],[0,-1.5],[1.5,0],[1.5,1.5],[1.5,-1.5],[-1.5,0],[-1.5,1.5],[-1.5,-1.5]];
		
		for (var i = 0; i < diff.length; i++) {

			var shadow = counter.cloneNode(true);

			shadow.style.margin = '0px';
			shadow.style.padding = '0px';
			shadow.style.position = 'absolute';
			shadow.style.color = parm.count_shadow_color;
			shadow.style.fontFamily = parm.count_font;
			shadow.style.fontSize = parm.count_size;
			shadow.style.left = (counter_position.left + diff[i][0]) + 'px';
			shadow.style.top = (counter_position.top + diff[i][1]) + 'px';

			cntshadow.push(shadow);

		}

		return cntshadow;

	};

	prototype._create_shadowed_counter_suffix = function(counter, counter_position) {

		var parm = this.global_params;

		var cntshadow = [];

		var diff = [[0,1.5],[0,-1.5],[1.5,0],[1.5,1.5],[1.5,-1.5],[-1.5,0],[-1.5,1.5],[-1.5,-1.5]];
		
		for (var i = 0; i < diff.length; i++) {

			var shadow = counter.cloneNode(true);

			shadow.style.margin = '0px';
			shadow.style.padding = '0px';
			shadow.style.position = 'absolute';
			shadow.style.color = parm.count_shadow_color;
			shadow.style.fontFamily = parm.count_font;
			shadow.style.fontSize = parm.count_suffix_size;
			shadow.style.left = (counter_position.left + diff[i][0]) + 'px';
			shadow.style.top = (counter_position.top + diff[i][1]) + 'px';

			cntshadow.push(shadow);

		}

		return cntshadow;

	};

	/**
	 * utility methods
	 */

	prototype._num_to_separated_str = function(num, delim) {

		var sep = String(num);

		return sep.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delim);

	};	

  prototype._num_to_cssstr = function(number, suffix) {
    return number + suffix;
  }

	prototype._to_pixcel_num_str = function(number) {
		return this._num_to_cssstr(number, 'px');
	}

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

	prototype._rgb_to_csshexformat = function(rgb) {
		var hex = {
			r: rgb.r.toString(16),
			g: rgb.g.toString(16),
			b: rgb.b.toString(16)
		};
		if (hex.r.length == 1) { hex.r = '0' + hex.r;}
		if (hex.g.length == 1) { hex.g = '0' + hex.g;}
		if (hex.b.length == 1) { hex.b = '0' + hex.b;}
		return '#' + hex.r + hex.g + hex.b;

	};

  prototype._rgb_to_yuv = function(rgb) {
    var r = {
      y: {r:  0.299, g:  0.587,  b:  0.144}, 
      u: {r: -0.169, g: -0.3316, b:  0.500}, 
      v: {r:  0.500, g: -0.4186, b: -0.0813}
    };

    return {
      y: parseInt(r.y.r * rgb.r + r.y.g * rgb.g + r.y.b * rgb.b),
      u: parseInt(r.u.r * rgb.r + r.u.g * rgb.g + r.u.b * rgb.b),
      v: parseInt(r.v.r * rgb.r + r.v.g * rgb.g + r.v.b * rgb.b)
    };
  };

  prototype._yuv_to_rgb = function(yuv) {
    var rgb = {
      r: parseInt(yuv.y + 1.402 * yuv.v),
      g: parseInt(yuv.y - 0.714 * yuv.v - 0.344 * yuv.u),
      b: parseInt(yuv.y + 1.772 * yuv.u)
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
