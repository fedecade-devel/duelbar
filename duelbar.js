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
			//dist---v
			bar_efect: 'gradient',
			//dist---^
			bar_style: 'gradient',
			animation: false,
			// pointer_fall_speed: [1.06, 1, 1.05]
			pointer_fall_speed: [0.05, 0.75, 0.59],
			gradient_lightness: [-0.15, 0, 0.15],
			gradient_position: [0.0, 0.4, 1.0],
			pointer_frame_width: 0
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
			var left_bar = this._slide_animated_left_bar(this._draw_static_bar(this.left_bar_prop), this.left_bar_prop, left_counts.counter);
			bar_frame.appendChild(left_bar);
			bar_frame.appendChild(left_counts.counter);
			bar_frame.appendChild(left_counts.suffix);

			/* right bar */
			var right_counts = this._prepare_right_static_count(bar_frame, this.right_bar_prop);
			var right_bar = this._slide_animated_right_bar(this._draw_static_bar(this.right_bar_prop), this.right_bar_prop, right_counts.counter);
			bar_frame.appendChild(right_bar);
			bar_frame.appendChild(right_counts.counter);
			bar_frame.appendChild(right_counts.suffix);

			/* pointer */
			var pointer = this._animated_pointer();
			pointer_frame.appendChild(pointer);

		} else {
			bar_frame.appendChild(this._draw_static_bar(this.left_bar_prop));
			bar_frame.appendChild(this._draw_static_bar(this.right_bar_prop));
			this._draw_static_count(bar_frame, this.left_bar_prop, this.right_bar_prop);
			pointer_frame.appendChild(this._draw_static_pointer(param.pointer_img_top_margin));
		}

	};

  prototype.draw2 = function(lval, rval) {

		var client = this.container;

    var parm = this.global_params;
		 
    var frame = this._create_barframe();
    client.appendChild(frame);

    var tval = lval + rval;
    var lw = Math.floor(parm.width * lval / tval);
    var rw = parm.width - lw;
    var ll = lw * -1;
    var rl = parm.width;
    var h = parm.height;

		var ptrfrm = this._create_pointerframe();
		var ptr = this._create_pointer2(lw);
		ptrfrm.appendChild(ptr);
		client.appendChild(ptrfrm);

    var lcount = this._create_count_box();
		this._draw_count(lcount, lval);
    var lbox_size = this._get_box_size(lcount, frame);
		var lcntpos = {left: parm.count_margin, top: Math.floor((parm.height - lbox_size.h) / 2)};
    lcount.style.left = this._num_to_cssstr(lcntpos.left, 'px');
		lcount.style.top = this._num_to_cssstr(lcntpos.top, 'px');
    var lbar = this._draw_static_bar(parm.left_bar_color, lw, h, ll, lcount);
    frame.appendChild(lbar);
		var lshadow = this._create_shadowed_number(lcount, frame, lcntpos);
		frame.appendChild(lcount);
		if (parm.animation) {
			this._animate(lbar, lw, ll, 'increase', lcount, lval, lshadow);
		} else {
			lbar.style.left = this._num_to_cssstr(0, 'px');
		}
    
    var rcount = this._create_count_box();
		this._draw_count(rcount, rval);
    var rbox_size = this._get_box_size(rcount, frame);
		var rcntpos = {left: parm.width - rbox_size.w - parm.count_margin, top: Math.floor((parm.height - rbox_size.h) / 2)};
    rcount.style.left = this._num_to_cssstr(rcntpos.left, 'px');
		rcount.style.top = this._num_to_cssstr(rcntpos.top, 'px');
    var rbar = this._draw_static_bar(parm.right_bar_color, rw, h, rl, rcount);
		frame.appendChild(rbar);
		var rshadow = this._create_shadowed_number(rcount, frame, rcntpos);
		frame.appendChild(rcount);
		if (parm.animation) {
			this._animate(rbar, rw, rl, 'decrease', rcount, rval, rshadow);
		} else {
			rbar.style.left = this._num_to_cssstr(lw, 'px');
		}

		if (parm.animation) {
			this._slide_pointer2(ptr);
		} else {
			ptr.style.top = 0;
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

	prototype._draw_static_count = function(frame, left_bar_prop, right_bar_prop) {

		var param = this.global_params;
		var _this = this;

		var lfn = function() {

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

			frame.appendChild(counter);
			frame.appendChild(suffix);

		};

		var rfn = function() {

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

			frame.appendChild(counter);
			frame.appendChild(suffix);

		};

		lfn();
		rfn();

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
		counter.innerHTML = '';

		return {counter: counter, suffix: suffix};

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
		counter.innerHTML = '';

		return {counter: counter, suffix: suffix};
		
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

	prototype._num_to_separated_str = function(num, delim) {

		var sep = String(num);

		return sep.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delim);

	};	

	prototype._slide_animated_left_bar = function(bar, bar_prop, counter) {

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

			_this._draw_counter(counter, Math.floor(curpos * bar_prop.value / 100));

      if (curpos != maxpos) {
        setTimeout(fn, 10);
			} else {
				_this.bar_draw_finished.left = true;
      }

		};

		fn();

		return bar;

	};

	prototype._slide_animated_right_bar = function(bar, bar_prop, counter) {

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

			_this._draw_counter(counter, Math.floor(curpos * bar_prop.value / 100));

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

	prototype._draw_counter = function(counter, value) {

		var count = this._num_to_separated_str(value, ',');
		counter.innerHTML = count;
		
	};

	/*======================================================================================*/

	prototype._create_pointer2 = function(position) {

		var hide = '-1000px';
		var ptrimg_w = this.global_params.pointer_img_width;
		var ptrimg_h = this.global_params.pointer_img_height;
		var ptrimg = new Image();
		ptrimg.src = this.global_params.pointer_img;
		ptrimg.style.position = 'relative';
		ptrimg.style.width = this._num_to_cssstr(ptrimg_w, 'px');
		ptrimg.style.height = this._num_to_cssstr(ptrimg_h, 'px');
		ptrimg.style.top = hide;
		ptrimg.style.left = this._num_to_cssstr(position - ptrimg_w / 2, 'px');
		
		return ptrimg;
	};

	prototype._slide_pointer2 = function(ptr) {

		var curpos = this.global_params.pointer_depth * -4;
		var minpos = 0;
		var maxpos = 0;
		var delay = 0;
		var fmt = this._num_to_cssstr;
		var interval = 1;
		var remain = 3;
		var egd = [this.global_params.pointer_depth * 1.5, this.global_params.pointer_depth * -0.5, 0];
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
    
    var parm = this.global_params;

		frame.style.marginTop = this._num_to_cssstr((this.global_params.height + this.global_params.pointer_img_height - this.global_params.pointer_depth) * -1, 'px');
    frame.style.width = this._num_to_cssstr(parm.width, 'px');
    frame.style.position = 'relative';
    frame.style.border = 'none';

    return frame;
  };

	prototype._create_barframe = function() {

		var frame = document.createElement('DIV'); 
		
		var parm = this.global_params;

		frame.style.marginTop = this._num_to_cssstr(this.global_params.pointer_img_height, 'px');
		frame.style.width = this._num_to_cssstr(parm.width, 'px');
		frame.style.height = this._num_to_cssstr(parm.height, 'px');
		frame.style.position = 'relative';
		frame.style.overflow = 'hidden';
		frame.style.borderWidth = parm.frame_border_width;
		frame.style.borderColor = parm.frame_border_color;
		frame.style.borderStyle = parm.frame_border_style;
		frame.style.backgroundColor = this.global_params.background_color;

		return frame;
	};

  prototype._num_to_cssstr = function(number, suffix) {
    return number + suffix;
  }

  prototype._animate = function(bar, width, left, direction, cntbox, val, shadow) {

    var speed = this.global_params.bar_speed;
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

  // prototype._draw_static_bar = function(color, width, height, left, cntbox) {

    // var parm = this.global_params;

    // var bar = document.createElement('DIV');

    // bar.style.width = this._num_to_cssstr(width, 'px');
    // bar.style.height = this._num_to_cssstr(100, '%');
    // bar.style.position = 'absolute';
    // bar.style.left = this._num_to_cssstr(left, 'px');
    // // bar.style.borderWidth = parm.bar_border_width + parm.bar_unit_type;
    // // bar.style.borderStyle = parm.bar_border_style;
    // bar.style.float = 'left';

		// if (parm.bar_efect == 'gradient') {
			// var canvas = document.createElement('CANVAS');
			// if (canvas && canvas.getContext) {
				// canvas.width = width;
				// canvas.height = height;
				// bar.appendChild(canvas);
				// var ctx = canvas.getContext('2d');
				// ctx.beginPath();
				// var baseColor = this._colorcode_to_rgb(color);
				// var color1 = this._rgb_to_cssformat(this._lighten_rgb(baseColor, -0.15));
				// var color2 = this._rgb_to_cssformat(this._lighten_rgb(baseColor, 0));
				// var color3 = this._rgb_to_cssformat(this._lighten_rgb(baseColor, 0.15));
				// var grad = ctx.createLinearGradient(0, 0, 0, height);
				// grad.addColorStop(0.0, color1);
				// grad.addColorStop(0.4, color2);
				// grad.addColorStop(1.0, color3);
				// ctx.fillStyle = grad;
				// ctx.rect(0, 0, width, height);
				// ctx.fill();
			// } else if (document.uniqueID) {
				// var baseColor = this._colorcode_to_rgb(color);
				// var color1 = this._rgb_to_csshexformat(this._lighten_rgb(baseColor, -0.15));
				// var color2 = this._rgb_to_csshexformat(this._lighten_rgb(baseColor, 0.15));
				// bar.style.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=" + color2 + ",EndColorStr=" + color1 + ")";
			// } else {
				// bar.style.backgroundColor = color;
			// }
		// } else {
			// bar.style.backgroundColor = color;
		// }

    // // this._draw_count(cntbox, 0, shadow);
    
    // return bar;

  // };

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

  prototype._create_count_box = function() {
    var parm = this.global_params;
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
		var cnt = this._num_to_separated_str2(count, ',', this.global_params.count_suffix);
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
      h: box.offsetHeight
    };
    frame.removeChild(box);
    box.style.visible = vis;
    return sizes;
  };

	prototype._create_shadowed_number = function(cntbox, frame, cntpos) {
		var parm = this.global_params;
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
	prototype._num_to_separated_str2 = function(num, delim, suffix) {
		var sep = String(num);
		return sep.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delim) + suffix;
	};	


	prototype._to_pixcel_num_str = function(number) {
		return this._num_to_cssstr(number, 'px');
	}

} ());
