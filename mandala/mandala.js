(function(glob) {
  mandala = {};

  var CIRCLE = 0;
  var SQUARE = 1;

  function makeShape(prev) {
    return {
      shape: CIRCLE,
      size: 100,
      stroke: 2,
      fill_color: 0,
      stroke_color: 0,
      rot: 0,
      prev: prev,
    };
  }

  function draw(state, shape) {
    var inner_size = shape.size - shape.stroke / 2;
    var s;
    if (shape.shape == CIRCLE) {
      s = state.g.circle(0, 0, inner_size);
    } else {
      s = state.g.rect(-inner_size, -inner_size, inner_size * 2, inner_size * 2);
    }
    s.attr({
        fill: state.color_scheme[shape.fill_color * 4],
        stroke: state.color_scheme[shape.stroke_color * 4 + 1],
        strokeWidth: shape.stroke
    });
    if (shape.rot) {
      s.transform("r"+shape.rot);
    }
  }

  function shrink_strat(state, prev) {
    var next = makeShape(prev);
    next.size = prev.size * state.shrink;
    next.stroke = prev.stroke * state.shrink;
    next.fill_color = (prev.fill_color + 1) % (state.color_scheme.length / 4)
    if (Math.random() < 0.5) {
      next.stroke_color = next.fill_color;
    } else {
      next.stroke_color = prev.stroke_color;
    }
    if (Math.random() < 0.5) {
      next.shape = CIRCLE;
    } else {
      next.shape = SQUARE;
      if (Math.random() < 0.4 && next.size <= 70.71) {
        next.rot = 45;
      }
    }
    return next;
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  mandala.run = function() {
    var circle_strat = [
      shrink_strat,
    ];

    var square_strat = [
      shrink_strat,
    ];

    var strats = [circle_strat, square_strat];

    var scheme = new ColorScheme();
    scheme.from_hue(Math.random() * 360).scheme('triade').variation('soft');
    var color_scheme = scheme.colors();

    var s = Snap(800, 800);
    var g = s.g();

    var state = {
      g: g,
      color_scheme: color_scheme,
      shrink: 0.8409,
    };

    var cur = makeShape(null);
    draw(state, cur);
    for (var i = 0; i < 24; i++) {
      cur = randomChoice(strats[cur.shape])(state, cur);
      draw(state, cur);
    }

    g.transform("s4t100,100");

  };
  glob.mandala = mandala
})(this);
