L.DeferredLayer = L.LayerGroup.extend({
    includes: L.Mixin.Events,
	options: {
		js: [],
		init: null,
		onload: null
	},

	_script_cache: {},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		L.LayerGroup.prototype.initialize.apply(this);
		this._loaded = false;
	},

    getURL: function () {

    },

	onAdd: function(map) {
        var self = this;
		L.LayerGroup.prototype.onAdd.apply(this, [map]);
		if (this._loaded) return;
		//console.info("Script cache", this._script_cache);
		var loaded = function() {
			//console.info("Loaded", this, this.options);
			this._loaded = true;
			var l = this.options.init();
			if (l) {
                l.on('load', function (e) {
                    self.fire('load', e);
                });
                this.addLayer(l);
            }
		}
		this._loadScripts(this.options.js.reverse(), L.Util.bind(loaded, this));
	},

	_loadScripts: function(scripts, cb, args) {
		if (!scripts || scripts.length == 0)
			return cb(args);
		var _this = this, s = scripts.pop(), c;
		c = this._script_cache[s];
		if (c === undefined) {
			c = {url: s, wait: []};
			//console.info("Load ", s);
			var script = document.createElement('script');
			script.src = s;
			script.type = 'text/javascript';
			script.onload = function () {
				//console.info("Element(cb)", c.e.readyState);
				c.e.readyState = "completed";
				var i = 0;
				for (i = 0; i < c.wait.length; i++)
					c.wait[i]();
			}
			c.e = script;
			document.getElementsByTagName('head')[0].appendChild(script);
		}
		function _cb() { _this._loadScripts(scripts, cb, args); }
		c.wait.push(_cb);
		//console.info("Element", c.e.readyState);
		if (c.e.readyState == "completed")
			_cb();
		this._script_cache[s] = c;
	}
});
