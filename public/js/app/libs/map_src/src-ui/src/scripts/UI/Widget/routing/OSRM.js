/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// Leaflet extension: LabelMarker
// [marker class that allows for changing icons while dragging]


// extended marker class
L.LabelMarker = L.Marker.extend({
    options: {
        clickable: true
    },
	// change marker icon
	changeIcon: function( icon ) {
		this.options.icon = icon;

		if (this._map) {
			this._changeIcon();
		}
	},

	// add/change marker label
	setLabel: function( label ) {
		if(this._icon) {
			this._icon.lastChild.innerHTML=label;
			this._icon.lastChild.style.display = "block";
		}
	},
	
	// add/change marker tooltip
	setTitle: function ( title ) {
		this.options.title = title;
		this._icon.title = title;
	},
	
	// actual icon changing routine
	_changeIcon: function () {
		var options = this.options,
	    	map = this._map,
	    	animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
	    	classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

		if (this._icon) {
			this._icon = options.icon.changeIcon( this._icon );
			L.DomUtil.addClass(this._icon, classToAdd);
			L.DomUtil.addClass(this._icon, 'leaflet-clickable');
		}
	}
});
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// Leaflet extension: LabelMarkerIcon
// [icon class with extra label and simple icon changing]


// extended icon class 
L.LabelMarkerIcon = L.Icon.extend({
	// altered icon creation (with label)
	_createImg: function (src) {
		var el;
		if (!L.Browser.ie6) {
			el = document.createElement('div');
			
			var img = document.createElement('img');
			var num = document.createElement('div');
			img.src = src;
			num.className = 'via-counter';
			num.innerHTML = "";
			
			el.appendChild(img);
			el.appendChild(num);
		} else {
			el = document.createElement('div');
			el.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
		}
		return el;
	},

	// non-destructive icon changing
	changeIcon: function (el) {
		return this._changeIcon('icon', el);
	},

	changeShadow: function (el) {
		return this.options.shadowUrl ? this._changeIcon('shadow', el) : null;
	},
	
	_changeIcon: function (name, el) {
		var src = this._getIconUrl(name);
		if (!src) {
			if (name === 'icon') {
				throw new Error("iconUrl not set in Icon options (see the docs).");
			}
			return null;
		}		
		
		var img = this._changeImg(src, el);
		this._setIconStyles(img, name);
		
		return img;
	},	
	
	_changeImg: function (src, el) {
		if (!L.Browser.ie6) {
			el.firstChild.src = src;
		} else {
			el.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
		}
		return el;
	}
});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM base class
// [has to be loaded before all other OSRM classes]

var OSRM = {};
OSRM.VERSION = '0.1.11';
OSRM.DATE = '131122';
OSRM.CONSTANTS = {};
OSRM.DEFAULTS = {};
OSRM.GLOBALS = {};
OSRM.Control = {};			// control container
OSRM.G = OSRM.GLOBALS;		// abbreviations
OSRM.C = OSRM.CONSTANTS;

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM config file
// [has to be loaded directly after OSRM.base]

OSRM.DEFAULTS = {
		ROUTING_ENGINES: [
			{	url: Gis.config(Gis.GEO_ROUTING_URL, 'http://router.project-osrm.org/viaroute'),
				timestamp: Gis.config(Gis.GEO_TIMESTAMP_URL, 'http://router.project-osrm.org/timestamp'),
				metric: 0,
				label: 'ENGINE_0',
			}
		],

	
	WEBSITE_URL: document.URL.replace(/#*(\?.*|$)/i,""),					// truncates URL before first ?, and removes tailing #
	HOST_GEOCODER_URL: Gis.config(Gis.GEO_FORWARD_SEARCH_URL, 'http://nominatim.openstreetmap.org/search'),
	HOST_REVERSE_GEOCODER_URL: Gis.config(Gis.GEO_REVERSE_SEARCH_URL, 'http://nominatim.openstreetmap.org/reverse'),
	HOST_SHORTENER_URL:  Gis.config(Gis.GEO_SHORTEN_URL, 'http://map.project-osrm.org/shorten/'),				// use '' to not use url shortener service
	
	SHORTENER_PARAMETERS: '%url&jsonp=%jsonp',
	SHORTENER_REPLY_PARAMETER: 'ShortURL',									// keep set, even if not using url shortener service!
	
	ROUTING_ENGINE: 0,
	DISTANCE_FORMAT: 0,														// 0: km, 1: miles
	GEOCODER_BOUNDS: '',	
	ZOOM_LEVEL: 14,
	HIGHLIGHT_ZOOM_LEVEL: 16,
	JSONP_TIMEOUT: 10000,
	EDITOR_MIN_ZOOM_LEVEL: 16,
	JOSM_MIN_ZOOM_LEVEL: 16,	
	NOTES_MIN_ZOOM_LEVEL: 8,
	
	ONLOAD_ZOOM_LEVEL: 5,
	ONLOAD_LATITUDE: 48.84,
	ONLOAD_LONGITUDE: 10.10,
	ONLOAD_SOURCE: "",
	ONLOAD_TARGET: "",
	
	LANGUAGE: "ru",
	LANGUAGE_USE_BROWSER_SETTING: true,
	LANUGAGE_ONDEMAND_RELOADING: true,
	LANGUAGE_SUPPORTED: [ 
		{encoding:"en", name:"English"},
		{encoding:"bg", name:"Български"},
		{encoding:"ca", name:"Català"},
		{encoding:"cs", name:"Česky"},
		{encoding:"de", name:"Deutsch"},
		{encoding:"da", name:"Dansk"},
		{encoding:"el", name:"Ελληνικά"},
		{encoding:"eo", name:"Esperanto"},
		{encoding:"es", name:"Español"},
		{encoding:"fi", name:"Suomi"},
		{encoding:"fr", name:"Français"},
		{encoding:"it", name:"Italiano"},
		{encoding:"ja", name:"日本人"},
		{encoding:"ka", name:"ქართული"},
		{encoding:"lv", name:"Latviešu"},
		{encoding:"nb", name:"Bokmål"},
		{encoding:"pl", name:"Polski"},
		{encoding:"pt", name:"Portugues"},
		{encoding:"ro", name:"Română"},
		{encoding:"ru", name:"Русский"},
		{encoding:"sk", name:"Slovensky"},
		{encoding:"sv", name:"Svenska"},
		{encoding:"ta", name:"தமிழ்"},
		{encoding:"tr", name:"Türkçe"},
		{encoding:"uk", name:"Українська"}
	],
		
	TILE_SERVERS: [
		{	display_name: 'Mapbox Terrain',
			url:'http://{s}.tiles.mapbox.com/v3/dennisl.map-dfbkqsr2/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://mapbox.com/">MapBox</a>',
			options:{maxZoom: 18}
		},
		{
			display_name: 'Mapbox Labelled Satellite',
			url:'http://{s}.tiles.mapbox.com/v3/dennisl.map-6g3jtnzm/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://mapbox.com/">MapBox</a>',
			options:{maxZoom: 18}
		},
		{
			display_name: 'Mapbox Satellite',
			url:'http://{s}.tiles.mapbox.com/v3/dennisl.map-inp5al1s/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://mapbox.com/">MapBox</a>',
			options:{maxZoom: 18}
		},
		{	display_name: 'osm.org',
			url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (CC-BY-SA)',
			options:{maxZoom: 18}
		},
		{	display_name: 'osm.de',
			url:'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (CC-BY-SA)',
			options:{maxZoom: 18}
		},
		{	display_name: 'MapQuest',
			url:'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
			attribution:'Data © <a href="http://www.openstreetmap.org/copyright/en">OpenStreetMap</a> contributors (ODbL), Imagery © <a href="http://www.mapquest.de/">MapQuest</a>',
			options:{maxZoom: 18, subdomains: '1234'}
		}
	],
	
	OVERLAY_SERVERS: [
  		{	display_name: 'Small Components',
			url:'http://tools.geofabrik.de/osmi/tiles/routing_i/{z}/{x}/{y}.png',
			attribution:'',
			options:{}
		}
	],

	NOTIFICATIONS: {
		LOCALIZATION:	1800000,	// 30min
		CLICKING: 		60000,		// 1min
		DRAGGING: 		120000,		// 2min 
		MAINTENANCE:	false
	},
	OVERRIDE_MAINTENANCE_NOTIFICATION_HEADER: undefined,
	OVERRIDE_MAINTENANCE_NOTIFICATION_BODY: undefined
};

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM old/cross browser support
// [browser detection and routines for old/cross browser support] 


// browser detection (runs anonymous function to prevent local variables cluttering global namespace)
(function() {
	var useragent = navigator.userAgent;
	
	OSRM.Browser = {
 		FF3:	useragent.search(/Firefox\/3/),
 		IE6_7:	useragent.search(/MSIE (6|7)/),
 		IE6_8:	useragent.search(/MSIE (6|7|8)/),
		IE6_9:	useragent.search(/MSIE (6|7|8|9)/)
	};
}());


// compatibility tools

//add document.head reference for older browsers
document.head = document.head || document.getElementsByTagName('head')[0];

// supply getElementsByClassName method for older browser
OSRM.Browser.getElementsByClassName = function( node, classname ) {
    var a = [];
    var re = new RegExp('(^| )'+classname+'( |$)');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
};

// call a function when DOM has finished loading and remove event handler (optionally pass a different window object)
OSRM.Browser.onLoadHandler = function( function_pointer, the_window ) {
	the_window = the_window || window;			// default document
	var the_document = the_window.document;
	
	if(the_window.addEventListener) {			// FF, CH, IE9+
		var temp_function = function() { 
			the_window.removeEventListener("DOMContentLoaded", arguments.callee, false);
			function_pointer.call();
		};
		the_window.addEventListener("DOMContentLoaded", temp_function, false);
	}

	else if(the_document.attachEvent) {			// IE8-
		var temp_function = function() { 
			if ( the_document.readyState === "interactive" || the_document.readyState === "complete" ) { 
				the_document.detachEvent("onreadystatechange", arguments.callee); 
				function_pointer.call(); 
			}
		};
		the_document.attachEvent("onreadystatechange", temp_function);
	}
};
OSRM.Browser.onUnloadHandler = function( function_pointer, the_window ) {
	the_window = the_window || window;			// default document
	var the_document = the_window.document;
	
	if(the_window.addEventListener) {			// FF, CH, IE9+
		the_window.addEventListener("unload", function_pointer, false);
	}
	else if(the_document.attachEvent) {			// IE8-
		the_document.attachEvent("onunload", function_pointer);
	}
};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM classes
// [support for inheritance and other function related functionality]

// declare one class to be a subclass of another class
// (runs anonymous function to prevent local functions cluttering global namespace)
(function() {
var _inheritFromHelper = function() {};
OSRM.inheritFrom = function( sub_class, base_class ) {
	_inheritFromHelper.prototype = base_class.prototype;
	sub_class.prototype = new _inheritFromHelper();
	sub_class.prototype.constructor = sub_class;
	sub_class.prototype.base = base_class.prototype;
};
}());


// extend prototypes of a class -> used to add member values and functions
OSRM.extend = function( target_class, properties ) {
	for( property in properties ) {
		target_class.prototype[property] = properties[property];
	}
};


// bind a function to an execution context, i.e. an object (needed for correcting this pointers)
OSRM.bind = function( context, fct1 ) {
	return function() {
		fct1.apply(context, arguments);
	};
};


// concatenate the execution of two functions with the same set of parameters
OSRM.concat = function( fct1, fct2 ) {
	return function() { 
		fct1.apply(this,arguments); 
		fct2.apply(this,arguments); 
	};
};


// [usage of convenience functions]
// SubClass = function() {
// 	SubClass.prototype.base.constructor.apply(this, arguments);
// }
// OSRM.inheritFrom( SubClass, BaseClass );
// OSRM.extend( SubClass, { property:value } );

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM initialization
// [initialization, image prefetching]


// onload initialization routine
OSRM.init = function() {
    if (!this._inited) {
        OSRM.showHTML();


        OSRM.prefetchImages();
        OSRM.prefetchIcons();
//	OSRM.prefetchCSSIcons();

        OSRM.GUI.init();
        OSRM.Map.init();
        OSRM.Routing.init();
        OSRM.RoutingAlternatives.init();
        OSRM.Localization.init();

        // check if the URL contains some GET parameter, e.g. for showing a route
        OSRM.parseParameters();


        // only init default position / geolocation position if GET parameters do not specify a different one
        if (OSRM.G.initial_position_override == false)
            OSRM.Map.initPosition();

        // finalize initialization of map
        OSRM.Map.initFinally();
        this._inited = true;
    } else {
        OSRM.Map.initEvents();
    }
};

OSRM.deinit = function () {
    OSRM.Map.deinit();
};


// prefetch images
OSRM.GLOBALS.images = {};
OSRM.prefetchImages = function() {
    var path = Gis.config('relativePath');
	var image_list = [	{id:'marker-shadow',					url: path +'images/marker-shadow.png'},
	                  	{id:'marker-source',					url: path +'images/marker-source.png'},
						{id:'marker-target',					url: path +'images/marker-target.png'},
						{id:'marker-via',						url: path +'images/marker-via.png'},
						{id:'marker-highlight',					url: path +'images/marker-highlight.png'},
						{id:'marker-source-drag',				url: path +'images/marker-source-drag.png'},
		              	{id:'marker-target-drag',				url: path +'images/marker-target-drag.png'},
		              	{id:'marker-via-drag',					url: path +'images/marker-via-drag.png'},
		              	{id:'marker-highlight-drag',			url: path +'images/marker-highlight-drag.png'},
		              	{id:'marker-drag',						url: path +'images/marker-drag.png'},
		              	{id:'cancel',							url: path +'images/cancel.png'},
		              	{id:'cancel_active',					url: path +'images/cancel_active.png'},
		              	{id:'cancel_hover',						url: path +'images/cancel_hover.png'},
		              	{id:'restore',							url: path +'images/restore.png'},
		              	{id:'restore_active',					url: path +'images/restore_active.png'},
		              	{id:'restore_hover',					url: path +'images/restore_hover.png'},
		              	{id:'up',								url: path +'images/up.png'},
		              	{id:'up_active',						url: path +'images/up_active.png'},
		              	{id:'up_hover',							url: path +'images/up_hover.png'},		
		              	{id:'down',								url: path +'images/down.png'},
		              	{id:'down_active',						url: path +'images/down_active.png'},
		              	{id:'down_hover',						url: path +'images/down_hover.png'},
		              	{id:'config',							url: path +'images/config.png'},
		              	{id:'config_active',					url: path +'images/config_active.png'},
		              	{id:'config_hover',						url: path +'images/config_hover.png'},		              	
		              	{id:'mapping',							url: path +'images/mapping.png'},
		              	{id:'mapping_active',					url: path +'images/mapping_active.png'},
		              	{id:'mapping_hover',					url: path +'images/mapping_hover.png'},		              	
		              	{id:'printer',							url: path +'images/printer.png'},
		              	{id:'printer_active',					url: path +'images/printer_active.png'},
		              	{id:'printer_hover',					url: path +'images/printer_hover.png'},
		              	{id:'printer_inactive',					url: path +'images/printer_inactive.png'},
		              	{id:'zoom_in',							url: path +'images/zoom_in.png'},
		              	{id:'zoom_in_active',					url: path +'images/zoom_in_active.png'},
		              	{id:'zoom_in_hover',					url: path +'images/zoom_in_hover.png'},
		              	{id:'zoom_in_inactive',					url: path +'images/zoom_in_inactive.png'},
		              	{id:'zoom_out',							url: path +'images/zoom_out.png'},
		              	{id:'zoom_out_active',					url: path +'images/zoom_out_active.png'},
		              	{id:'zoom_out_hover',					url: path +'images/zoom_out_hover.png'},
		              	{id:'zoom_out_inactive',				url: path +'images/zoom_out_inactive.png'},
		              	{id:'locations_user',					url: path +'images/locations_user.png'},
		              	{id:'locations_user_active',			url: path +'images/locations_user_active.png'},
		              	{id:'locations_user_hover',				url: path +'images/locations_user_hover.png'},
		              	{id:'locations_user_inactive',			url: path +'images/locations_user_inactive.png'},
		              	{id:'locations_route',					url: path +'images/locations_route.png'},
		              	{id:'locations_route_active',			url: path +'images/locations_route_active.png'},
		              	{id:'locations_route_hover',			url: path +'images/locations_route_hover.png'},
		              	{id:'locations_route_inactive',			url: path +'images/locations_route_inactive.png'},
		              	{id:'layers',							url: path +'images/layers.png'},
		        		{id:'direction_0',						url: path +'images/default.png'},		              	
		              	{id:'direction_1',						url: path +'images/continue.png'},
		              	{id:'direction_2',						url: path +'images/slight-right.png'},
		              	{id:'direction_3',						url: path +'images/turn-right.png'},
		              	{id:'direction_4',						url: path +'images/sharp-right.png'},
		              	{id:'direction_5',						url: path +'images/u-turn.png'},
		              	{id:'direction_6',						url: path +'images/sharp-left.png'},
		              	{id:'direction_7',						url: path +'images/turn-left.png'},
		              	{id:'direction_8',						url: path +'images/slight-left.png'},
		              	{id:'direction_10',						url: path +'images/head.png'},
		        		{id:'direction_11',						url: path +'images/round-about.png'},
		        		{id:'direction_15',						url: path +'images/target.png'},
		        		{id:'osrm-logo',						url: path +'images/osrm-logo.png'},
		        		{id:'selector',							url: path +'images/selector.png'}
	               ];
		
	for(var i=0; i<image_list.length; i++) {
		OSRM.G.images[image_list[i].id] = new Image();
		OSRM.G.images[image_list[i].id].src = image_list[i].url;
	}
};


// prefetch icons
OSRM.GLOBALS.icons = {};
OSRM.prefetchIcons = function() {
	var icon_list = [	{id:'marker-source',					image_id:'marker-source'},
						{id:'marker-target',					image_id:'marker-target'},
						{id:'marker-via',						image_id:'marker-via'},
						{id:'marker-highlight',					image_id:'marker-highlight'},
						{id:'marker-source-drag',				image_id:'marker-source-drag'},
						{id:'marker-target-drag',				image_id:'marker-target-drag'},
						{id:'marker-via-drag',					image_id:'marker-via-drag'},
						{id:'marker-highlight-drag',			image_id:'marker-highlight-drag'}
						//{id:'marker-drag',						image_id:'marker-drag'}				// special treatment because of size
	              ];
	
	var LabelMarkerIcon = L.LabelMarkerIcon.extend({
		options: {
			shadowUrl: OSRM.G.images["marker-shadow"].getAttribute("src"),
			iconSize:     [25, 41],
			shadowSize:   [41, 41],
			iconAnchor:   [13, 41],
			shadowAnchor: [13, 41],
			popupAnchor:  [0, -33]
		} });
	for(var i=0; i<icon_list.length; i++) {
		OSRM.G.icons[icon_list[i].id] = new LabelMarkerIcon({iconUrl: OSRM.G.images[icon_list[i].image_id].getAttribute("src")});
	}
	
	// special values for drag marker
	OSRM.G.icons['marker-drag'] = new L.LabelMarkerIcon( {iconUrl: OSRM.G.images["marker-drag"].getAttribute("src"), iconSize: new L.Point(18, 18) } );
};


// set css styles for images
OSRM.prefetchCSSIcons = function() {
	var css_list = [
	                	{ id:'#gui-printer-inactive',			image_id:'printer_inactive'},
	                	{ id:'#gui-printer',					image_id:'printer'},
	                	{ id:'#gui-printer:hover',				image_id:'printer_hover'},
	                	{ id:'#gui-printer:active',				image_id:'printer_active'},

	                	{ id:'.gui-zoom-in-inactive',			image_id:'zoom_in_inactive'},	                	
	                	{ id:'.gui-zoom-in',					image_id:'zoom_in'},
	                	{ id:'.gui-zoom-in:hover',				image_id:'zoom_in_hover'},
	                	{ id:'.gui-zoom-in:active',				image_id:'zoom_in_active'},

	                	{ id:'.gui-zoom-out-inactive',			image_id:'zoom_out_inactive'},	                	
	                	{ id:'.gui-zoom-out',					image_id:'zoom_out'},
	                	{ id:'.gui-zoom-out:hover',				image_id:'zoom_out_hover'},
	                	{ id:'.gui-zoom-out:active',			image_id:'zoom_out_active'},
	                	
	                	{ id:'.gui-locations-user-inactive',	image_id:'locations_user_inactive'},
	                	{ id:'.gui-locations-user',				image_id:'locations_user'},
	                	{ id:'.gui-locations-user:hover',		image_id:'locations_user_hover'},
	                	{ id:'.gui-locations-user:active',		image_id:'locations_user_active'},
	                	
	                	{ id:'.gui-locations-route-inactive',	image_id:'locations_route_inactive'},
	                	{ id:'.gui-locations-route',			image_id:'locations_route'},
	                	{ id:'.gui-locations-route:hover',		image_id:'locations_route_hover'},
	                	{ id:'.gui-locations-route:active',		image_id:'locations_route_active'},
	                	
	                	{ id:'.gui-layers',						image_id:'layers'},
	                	
	                	{ id:'.cancel-marker',					image_id:'cancel'},
	                	{ id:'.cancel-marker:hover',			image_id:'cancel_hover'},
	                	{ id:'.cancel-marker:active',			image_id:'cancel_active'},
	                	
	                	{ id:'.up-marker',						image_id:'up'},
	                	{ id:'.up-marker:hover',				image_id:'up_hover'},
	                	{ id:'.up-marker:active',				image_id:'up_active'},
	                	
	                	{ id:'.down-marker',					image_id:'down'},
	                	{ id:'.down-marker:hover',				image_id:'down_hover'},
	                	{ id:'.down-marker:active',				image_id:'down_active'},
	                	
	                	{ id:'#input-mask-header',				image_id:'osrm-logo'},
	                	{ id:'.styled-select',					image_id:'selector'},
	                	
	                	{ id:'#config-handle-icon',				image_id:'config'},
	                	{ id:'#config-handle-icon:hover',		image_id:'config_hover'},
	                	{ id:'#config-handle-icon:active',		image_id:'config_active'},
	                	           	
	                	{ id:'#mapping-handle-icon',			image_id:'mapping'},
	                	{ id:'#mapping-handle-icon:hover',		image_id:'mapping_hover'},
	                	{ id:'#mapping-handle-icon:active',		image_id:'mapping_active'},
	                	          	
	                	{ id:'#main-handle-icon',				image_id:'restore'},
	                	{ id:'#main-handle-icon:hover',			image_id:'restore_hover'},
	                	{ id:'#main-handle-icon:active',		image_id:'restore_active'}	                	
	                ];
	
	var stylesheet = OSRM.CSS.getStylesheet("main.css");
	for(var i=0; i<css_list.length; i++) {
		OSRM.CSS.insert( stylesheet, css_list[i].id, "background-image:url("+ OSRM.G.images[css_list[i].image_id].getAttribute("src") + ");" );
	}
};




// only show html content of website, if javascript is active 
OSRM.showHTML = function() {
	document.getElementById("gui").style.display = "block";
};


// parse URL GET parameters
OSRM.parseParameters = function(){
	var called_url = document.location.search.substr(1,document.location.search.length);
	
	// state, if GET parameters specify a different initial position
	OSRM.G.initial_position_override = false;
	
	// reject messages that are clearly too long or too small
	if( called_url.length > 1000 || called_url.length == 0)
		return;
	
	// storage for parameter values
	var params = {};
	
	// default values for parameters for which using PARAMS_VALUE || DEFAULT_VALUE is not an option (as they can evaluate to 0)
	params.active_routing_engine = OSRM.DEFAULTS.ROUTING_ENGINE;

	// parse input
	var splitted_url = called_url.split('&');
	for(var i=0; i<splitted_url.length; i++) {
		var name_val = splitted_url[i].split('=');
		if(name_val.length!=2)
			continue;
		
		if(name_val[0] == 'hl') {
			OSRM.Localization.setLanguage(name_val[1]);
		}
		else if(name_val[0] == 'df') {
			var type = parseInt(name_val[1]);
			if(type != 0 && type != 1)
				return;
			OSRM.GUI.setDistanceFormat(type);
		}		
//		else if(name_val[0] == 'loc') {
//			var coordinates = unescape(name_val[1]).split(',');
//			if(coordinates.length!=2 || !OSRM.Utils.isLatitude(coordinates[0]) || !OSRM.Utils.isLongitude(coordinates[1]) )
//				return;
//			params.positions = params.positions || [];
//			params.positions.push ( new L.LatLng( coordinates[0], coordinates[1]) );
//		}
//		else if(name_val[0] == 'dest') {
//			var coordinates = unescape(name_val[1]).split(',');
//			if(coordinates.length!=2 || !OSRM.Utils.isLatitude(coordinates[0]) || !OSRM.Utils.isLongitude(coordinates[1]) )
//				return;
//			params.destinations = params.destinations || [];
//			params.destinations.push ( new L.LatLng( coordinates[0], coordinates[1]) );
//		}
		else if(name_val[0] == 'loc') {
			params.locations = params.locations || [];
			params.locations.push ( decodeURI(name_val[1]).replace(/<\/?[^>]+(>|$)/g ,"") );
		}
		else if(name_val[0] == 'dest') {
			params.destinations = params.dlocations || [];
			params.destinations.push ( decodeURI(name_val[1]).replace(/<\/?[^>]+(>|$)/g ,"") );
		}
		else if(name_val[0] == 'destname') {
			params.destination_name = decodeURI(name_val[1]).replace(/<\/?[^>]+(>|$)/g ,"");	// discard tags	
		}
		else if(name_val[0] == 'z') {
			var zoom_level = Number(name_val[1]);
			if( zoom_level<0 || zoom_level > 18)
				return;
			params.zoom = zoom_level;
		}
		else if(name_val[0] == 'center') {
			var coordinates = unescape(name_val[1]).split(',');
			if(coordinates.length!=2 || !OSRM.Utils.isLatitude(coordinates[0]) || !OSRM.Utils.isLongitude(coordinates[1]) )
				return;				
			params.center = new L.LatLng( coordinates[0], coordinates[1]);			
		}
		else if(name_val[0] == 'alt') {
			var active_alternative = Number(name_val[1]);
			if( active_alternative<0 || active_alternative>OSRM.RoutingAlternatives>10)	// using 10 as arbitrary upper limit
				return;
			params.active_alternative = active_alternative;
		}
		else if(name_val[0] == 're') {
			var active_routing_engine = Number(name_val[1]);
			if( active_routing_engine<0 || active_routing_engine>=OSRM.DEFAULTS.ROUTING_ENGINES.length)
				return;
			params.active_routing_engine = active_routing_engine;
		}
		else if(name_val[0] == 'ly') {
			var active_tile_layer_hash = Number(name_val[1]);
			for(var j=0; j<OSRM.DEFAULTS.TILE_SERVERS.length;j++) {
				if( OSRM.Utils.getHash( OSRM.DEFAULTS.TILE_SERVERS[j].display_name ) == active_tile_layer_hash ) {
					OSRM.G.map.layerControl.setActiveLayerByName( OSRM.DEFAULTS.TILE_SERVERS[j].display_name );
					break;
				}
			}
		}
		else if(name_val[0] == 'mainbox') {
			if(name_val[1] == 'hide') {
				OSRM.G.map.zoomControl.show();
			}
		}		
	}

	// set routing engine
	OSRM.GUI.setRoutingEngine( params.active_routing_engine );
	
	// case 1: locations/destinations given (as strings)
	if( params.locations || params.destinations ) {
		var locations = params.destinations ? params.destinations : params.locations;
		var callback = params.destinations ? "_showInitResults_Destinations" : "_showInitResults_Locations";
		
		OSRM.G.initial_positions = {};
		var data = OSRM.G.initial_positions;
		data.positions = [];
		data.done = 0;
		data.fail = false;
		data.zoom = params.zoom;
		data.center = params.center;
		data.active_alternative = params.active_alternative;		
		//data.engine = params.active_routing_engine;
		data.name = params.destination_name;
		for(var id=0; id<locations.length; id++) {
			// prepare placeholder positions for coordinates
			// (have to prepared before starting geocoder!)
			data.positions.push( new L.LatLng(0,0) );
		}		
		for(var id=0; id<locations.length; id++) {
			// geo coordinates given -> directly incorporate results
			var query = locations[id]; 
			if(query.match(/^\s*[-+]?[0-9]*\.?[0-9]+\s*[,;]\s*[-+]?[0-9]*\.?[0-9]+\s*$/)){
				var coord = query.split(/[,;]/);
				OSRM.Geocoder._showInitResults( [{lat:coord[0],lon:coord[1]} ], {id:id,callback:callback} );
			} else {
				OSRM.GUI.exclusiveNotify( OSRM.loc("NOTIFICATION_GEOCODERWAIT_HEADER"), OSRM.loc("NOTIFICATION_GEOCODERWAIT_BODY"), false );				
				var call = Gis.config(Gis.GEO_FORWARD_SEARCH_URL, OSRM.DEFAULTS.HOST_GEOCODER_URL) + "?format=json&json_callback=%jsonp" + OSRM.DEFAULTS.GEOCODER_BOUNDS + "&accept-language="+OSRM.Localization.current_language+"&limit=1&q=" + query;
				OSRM.JSONP.call( call, OSRM.Geocoder._showInitResults, OSRM.Geocoder._showInitResults, OSRM.DEFAULTS.JSONP_TIMEOUT, "init_geocoder_"+id, {id:id,callback:callback} );
			}
		}
		return;
	}
		
//	// case 1: destination given
//	if( params.destinations ) {
//		var index = OSRM.G.markers.setTarget( params.destinations[params.destinations.length-1] );
//		if( params.destination_name )
//			OSRM.G.markers.route[index].description = params.destination_name;	// name in GUI will be set when languages are loaded
//		else 
//			OSRM.Geocoder.updateAddress( OSRM.C.TARGET_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
//		OSRM.G.markers.route[index].show();
//		OSRM.G.markers.route[index].centerView( params.zoom );
//		OSRM.G.initial_position_override = true;
//		for(var i=0; i<params.destinations.length-1;i++)
//			OSRM.G.markers.addInitialVia( params.destinations[i] );
//		return;
//	}

//	// case 2: locations given
//	if( params.positions ) {
//		// draw via points
//		if( params.positions.length > 0 ) {
//			OSRM.G.markers.setSource( params.positions[0] );
//			OSRM.Geocoder.updateAddress( OSRM.C.SOURCE_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
//		}
//		if( params.positions.length > 1 ) {
//			OSRM.G.markers.setTarget( params.positions[params.positions.length-1] );
//			OSRM.Geocoder.updateAddress( OSRM.C.TARGET_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
//		}
//		for(var i=1; i<params.positions.length-1;i++)
//			OSRM.G.markers.setVia( i-1, params.positions[i] );
//		for(var i=0; i<OSRM.G.markers.route.length;i++)
//			OSRM.G.markers.route[i].show();
//		
//		// center on route (support for old links) / move to given view (new behaviour)
//		if( params.zoom == null || params.center == null ) {
//			var bounds = new L.LatLngBounds( params.positions );
//			OSRM.G.map.fitBoundsUI( bounds );
//		} else {
//			OSRM.G.map.setView(params.center, params.zoom);
//		}
//		
//		// set active alternative (if via points are set or alternative does not exists, fallback to shortest route)
//		OSRM.G.active_alternative = params.active_alternative || 0;
//		
//		// set routing server
//		OSRM.GUI.setRoutingEngine( params.active_routing_engine );
//			
//		// compute route
//		OSRM.Routing.getRoute({keepAlternative:true});
//		OSRM.G.initial_position_override = true;
//		return;
//	}
	
	// default case: do nothing	
	return;
};


/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// locations control
// [navigation buttons for important locations - zoom on route, zoom on user]
OSRM.Control.Locations = L.Control.extend({
	options: {
		position: 'topright'
	},
	
	onAdd: function (map) {
		// create wrapper
		var container = L.DomUtil.create('div', 'box-wrapper gui-control-wrapper');
		L.DomEvent.disableClickPropagation(container);
		
		// create buttons
		this._userButton = this._createButton('gui-locations-user', container, OSRM.GUI.zoomOnUser, map, !!navigator.geolocation );
		this._routeButton = this._createButton('gui-locations-route', container, OSRM.GUI.zoomOnRoute, map, false);

		this._container = container;		
		return container;
	},

	_createButton: function (id, container, fn, context, isActive) {
		var inactive = (isActive == false) ? "-inactive" : "";
		var classNames = "box-content" + " " + "gui-control"+inactive + " " + id+inactive;
		var link = L.DomUtil.create('a', classNames, container);
		link.title = id;

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', fn, context)
			.on(link, 'dblclick', L.DomEvent.stopPropagation);

		return link;
	},
	
	activateRoute: function() {
		this._routeButton.className = "box-content gui-control gui-locations-route";		
	},
	deactivateRoute: function() {
		this._routeButton.className = "box-content gui-control-inactive gui-locations-route-inactive";		
	},
	setTooltips: function( userButton, routeButton) {
		this._userButton.title = userButton;
		this._routeButton.title = routeButton;
	}
});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM Map control
// [extension of L.Map with additional view & bounds methods that respect OSRM UI visibility; methods for querying active layers]
L.Map = L.Map.extend({
	_boundsInsideView: function(bounds) {
		var viewBounds = this.getBounds(),
		viewSw = this.project(viewBounds.getSouthWest()),
		viewNe = this.project(viewBounds.getNorthEast()),
		sw = this.project(bounds.getSouthWest()),
		ne = this.project(bounds.getNorthEast());

		if (viewNe.y > ne.y) { // north
			return false;
		}
		if (viewNe.x < ne.x) { // east
			return false;
		}
		if (viewSw.y < sw.y) { // south
			return false;
		}
		if (viewSw.x > sw.x) { // west
			return false;
		}		
		return true;
	},
	setViewBounds: function(bounds) {
		var zoom = this.getBoundsZoom(bounds);			// maximum zoom level at which the bounds fit onto the map
		
		if( this._zoom > zoom ) {						// if current zoom level is too close change zoom level and recenter
			this.setView(bounds.getCenter(), zoom);
		} else if(!this._boundsInsideView(bounds)){	// if current zoom level is okay, but bounds are outside the viewport, pan
			this.setView(bounds.getCenter(),  this._zoom);
		}
	},	
	setViewUI: function(position, zoom, no_animation) {
		this.setView( position, zoom, no_animation);
	},
	setViewBoundsUI: function(bounds) {
		var southwest = bounds.getSouthWest();
		var northeast = bounds.getNorthEast();
		var zoom = this.getBoundsZoom(bounds);
		var sw_point = this.project( southwest, zoom);
			sw_point.x-=20;
		sw_point.y+=20;
		var ne_point = this.project( northeast, zoom);
		ne_point.y-=20;
		ne_point.x+=20;
		bounds.extend( this.unproject(sw_point,zoom) );
		bounds.extend( this.unproject(ne_point,zoom) );
		this.setViewBounds( bounds );	
	},	
	fitBoundsUI: function(bounds) {
		var southwest = bounds.getSouthWest();
		var northeast = bounds.getNorthEast();
		var zoom = this.getBoundsZoom(bounds);
		var sw_point = this.project( southwest, zoom);
			sw_point.x-=20;
		sw_point.y+=20;
		var ne_point = this.project( northeast, zoom);
		ne_point.y-=20;
		ne_point.x+=20;
		bounds.extend( this.unproject(sw_point,zoom) );
		bounds.extend( this.unproject(ne_point,zoom) );
		this.fitBounds( bounds );	
	},
	getBoundsUI: function(unbounded) {
		var bounds = this.getPixelBounds();
		var sw = this.unproject(new L.Point(bounds.min.x, bounds.max.y), this._zoom, true),
			ne = this.unproject(new L.Point(bounds.max.x, bounds.min.y), this._zoom, true);
		return new L.LatLngBounds(sw, ne);		
	},	
	getCenterUI: function(unbounded) {
		var viewHalf = this.getSize();
		var centerPoint = this._getTopLeftPoint().add(viewHalf.divideBy(2));
		
		return this.unproject(centerPoint, this._zoom, unbounded);
	}
});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM markers 
// [base marker class, derived highlight marker and route marker classes]  


// base marker class (wraps Leaflet markers)
OSRM.Marker = function( label, style, position ) {
	this.label = label ? label : "marker";
	this.position = position ? position : new L.LatLng(0,0);
	this.description = null;

	this.marker = new L.LabelMarker( this.position, style );
	this.marker.parent = this;
	
	this.shown = false;
	this.hint = null;
};
OSRM.extend( OSRM.Marker,{
show: function() {
	OSRM.G.map.addLayer(this.marker);
	this.shown = true;
},
hide: function() {
	OSRM.G.map.removeLayer(this.marker);
	this.shown = false;
	
	// revert highlighted description
	if( this.label == "highlight" )
	if( this.description ) {
		var desc = document.getElementById("description-"+this.description);
		desc &&	(desc.className = "description-body-item");
		this.description = null;
	}
},
setPosition: function( position ) {
	this.position = position;
	this.marker.setLatLng( position );
	this.hint = null;	
},
getPosition: function() {
	return this.position;
},
getLat: function() {
	return this.position.lat;
},
getLng: function() {
	return this.position.lng;
},
isShown: function() {
	return this.shown;
},
centerView: function(zoom) {
	if( zoom == undefined )
		zoom = OSRM.DEFAULTS.ZOOM_LEVEL;
	OSRM.G.map.setViewUI( this.position, zoom );
},
toString: function() {
	return "OSRM.Marker: \""+this.label+"\", "+this.position+")";
}
});


// route marker class (draggable, invokes route drawing routines) 
OSRM.RouteMarker = function ( label, style, position ) {
	style.baseicon = style.icon;
	OSRM.RouteMarker.prototype.base.constructor.apply( this, arguments );
	this.label = label ? label : "route_marker";

 	this.marker.on( 'click', this.onClick );
 	this.marker.on( 'drag', this.onDrag );
 	this.marker.on( 'dragstart', this.onDragStart );
 	this.marker.on( 'dragend', this.onDragEnd );
};
OSRM.inheritFrom( OSRM.RouteMarker, OSRM.Marker );
OSRM.extend( OSRM.RouteMarker, {
onClick: function(e) {
	if( e.originalEvent.shiftKey==true || e.originalEvent.metaKey==true || e.originalEvent.altKey==true )	// only remove markers on simple clicks
		return;	
	for( var i=0; i<OSRM.G.markers.route.length; i++) {
		if( OSRM.G.markers.route[i].marker === this ) {
			OSRM.G.markers.removeMarker( i );
			break;
		}
	}
	
	OSRM.Routing.getRoute();
	OSRM.G.markers.highlight.hide();
	OSRM.G.markers.dragger.hide();
},
onDrag: function(e) {
	this.parent.setPosition( e.target.getLatLng() );
	if(OSRM.G.markers.route.length>1)
		OSRM.Routing.getRoute_Dragging();
	OSRM.Geocoder.updateLocation( this.parent.label );
},
onDragStart: function(e) {
	OSRM.G.dragging = true;
	this.changeIcon(this.options.dragicon);
	this.parent.description = null;
	
	// store id of dragged marker
	for( var i=0; i<OSRM.G.markers.route.length; i++)
		if( OSRM.G.markers.route[i].marker === this ) {
			OSRM.G.dragid = i;
			break;
		}
	
	if( this.parent != OSRM.G.markers.highlight)
		OSRM.G.markers.highlight.hide();
	if( this.parent != OSRM.G.markers.dragger)
		OSRM.G.markers.dragger.hide();
	if (OSRM.G.route.isShown())
		OSRM.G.route.showOldRoute();
},
onDragEnd: function(e) {
	OSRM.G.dragging = false;
	this.changeIcon(this.options.baseicon);
	
	this.parent.setPosition( e.target.getLatLng() );	
	if (OSRM.G.route.isShown()) {
		OSRM.Routing.getRoute();
		OSRM.G.route.hideOldRoute();
		OSRM.G.route.hideUnnamedRoute();
	} else {
		OSRM.Geocoder.updateAddress(this.parent.label);
		OSRM.GUI.clearResults();
	}
},
toString: function() {
	return "OSRM.RouteMarker: \""+this.label+"\", "+this.position+")";
}
});


//drag marker class (draggable, invokes route drawing routines) 
OSRM.DragMarker = function ( label, style, position ) {
	OSRM.DragMarker.prototype.base.constructor.apply( this, arguments );
	this.label = label ? label : "drag_marker";
};
OSRM.inheritFrom( OSRM.DragMarker, OSRM.RouteMarker );
OSRM.extend( OSRM.DragMarker, {
onClick: function(e) {
	if( this.parent != OSRM.G.markers.dragger)
		this.parent.hide();
	else {
		var new_via_index = OSRM.Via.findViaIndex( e.target.getLatLng() );
		OSRM.G.markers.route.splice(new_via_index+1,0, this.parent );
		OSRM.RouteMarker.prototype.onDragStart.call(this,e);
		
		OSRM.G.markers.route[OSRM.G.dragid] = new OSRM.RouteMarker(OSRM.C.VIA_LABEL, {draggable:true,icon:OSRM.G.icons['marker-via'],dragicon:OSRM.G.icons['marker-via-drag']}, e.target.getLatLng() );
		OSRM.G.markers.route[OSRM.G.dragid].show();
		OSRM.RouteMarker.prototype.onDragEnd.call(this,e);
		this.parent.hide();
	}
},
onDragStart: function(e) {
	var new_via_index = OSRM.Via.findViaIndex( e.target.getLatLng() );
	OSRM.G.markers.route.splice(new_via_index+1,0, this.parent );

	OSRM.RouteMarker.prototype.onDragStart.call(this,e);
},
onDragEnd: function(e) {
	OSRM.G.markers.route[OSRM.G.dragid] = new OSRM.RouteMarker(OSRM.C.VIA_LABEL, {draggable:true,icon:OSRM.G.icons['marker-via'],dragicon:OSRM.G.icons['marker-via-drag']}, e.target.getLatLng() );
	OSRM.G.markers.route[OSRM.G.dragid].show();
	
	OSRM.RouteMarker.prototype.onDragEnd.call(this,e);
	this.parent.hide();
},
toString: function() {
	return "OSRM.DragMarker: \""+this.label+"\", "+this.position+")";
}
});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routes
// [drawing of all types of route geometry] 


// simple route class (wraps Leaflet Polyline)
OSRM.SimpleRoute = function (label, style) {
	this.label = (label ? label : "route");
	this.route = new L.Polyline( [], style );
	this.shown = false;
	
 	this.route.on('click', this.onClick, this);
};
OSRM.extend( OSRM.SimpleRoute,{
show: function() {
	OSRM.G.map.addLayer(this.route);
	this.shown = true;
},
hide: function() {
	OSRM.G.map.removeLayer(this.route);
	this.shown = false;
},
isShown: function() {
	return this.shown;
},
getPoints: function() {
	return this.route._originalPoints;
},
getPositions: function() {
	return this.route.getLatLngs();
},
setPositions: function(positions) {
	this.route.setLatLngs( positions );
},
setStyle: function(style) {
	this.route.setStyle(style);
},
centerView: function() {
	var bounds = new L.LatLngBounds( this.getPositions() );
	OSRM.g.map.fitBoundsUI( bounds );
},
onClick: function(e) {
    if (this == OSRM.G.route) {
        if (e.originalEvent.shiftKey == true || e.originalEvent.metaKey == true || e.originalEvent.altKey == true)	// only create markers on simple clicks
            return;
        var new_via_index = Math.max(0, OSRM.Via.findViaIndex(e.latlng));
        var index = OSRM.G.markers.setVia(new_via_index, e.latlng);
        OSRM.G.markers.route[index].show();

        OSRM.Routing.getRoute();
    }
},
toString: function() {
	return "OSRM.Route("+ this.label + ", " + this.route.getLatLngs().length + " points)";
}
});


// multiroute class (wraps Leaflet LayerGroup to hold several disjoint routes)
OSRM.MultiRoute = function (label) {
	this.label = (label ? label : "multiroute");
	this.route = new L.LayerGroup();

	this.shown = false;
};
OSRM.extend( OSRM.MultiRoute,{
show: function() {
	OSRM.G.map.addLayer(this.route);
	this.shown = true;
},
hide: function() {
	OSRM.G.map.removeLayer(this.route);
	this.shown = false;
},
isShown: function() {
	return this.shown;
},
addRoute: function(positions) {
	var line = new L.Polyline( positions );
	line.on('click', function(e) { OSRM.G.route.fire('click',e); });
	this.route.addLayer( line );
},
clearRoutes: function() {
	this.route.clearLayers();
},
setStyle: function(style) {
	this.route.invoke('setStyle', style);
},
toString: function() {
	return "OSRM.MultiRoute("+ this.label + ")";
}
});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM map handling
// [initialization, event handling, centering relative to UI]

// will hold the map object
OSRM.GLOBALS.map = null;
OSRM.GLOBALS.localizable_maps = [];


// map controller
// [map initialization, event handling]
OSRM.Map = {

// map initialization
init: function() {
	// check if GUI is initialized!
	if(OSRM.G.main_handle == null)
		OSRM.GUI.init();
	
	// setup tile servers
	var tile_servers = OSRM.DEFAULTS.TILE_SERVERS;
	var base_maps = {};
	for(var i=0, size=tile_servers.length; i<size; i++) {
		tile_servers[i].options.attribution = tile_servers[i].attribution;
		base_maps[ tile_servers[i].display_name ] = new L.TileLayer( tile_servers[i].url, tile_servers[i].options );
		L.Util.stamp( base_maps[ tile_servers[i].display_name ] );			// stamp tile servers so that their order is correct in layers control
	}
	
	// setup overlay servers
	var overlay_servers = OSRM.DEFAULTS.OVERLAY_SERVERS;
	var overlay_maps = {};
	for(var i=0, size=overlay_servers.length; i<size; i++) {
		overlay_servers[i].options.attribution = overlay_servers[i].attribution;
		overlay_maps[ overlay_servers[i].display_name ] = new L.TileLayer( overlay_servers[i].url, overlay_servers[i].options );
		L.Util.stamp( overlay_maps[ overlay_servers[i].display_name ] );			// stamp tile servers so that their order is correct in layers control
	}	

	// setup map
	OSRM.G.map = Gis.Map.CURRENT_MAP.options.provider.map;


	// map events
    this.initEvents();
},
    initEvents: function () {
        OSRM.G.map.on('zoomend', OSRM.Map.zoomed );
        OSRM.G.map.on('click', OSRM.Map.click );
        OSRM.G.map.on('mousemove', OSRM.Map.mousemove );
        OSRM.GUI.showRouting();
    },
    deinit: function () {
        OSRM.G.map.off('zoomend', OSRM.Map.zoomed );
        OSRM.G.map.off('click', OSRM.Map.click );
        OSRM.G.map.off('mousemove', OSRM.Map.mousemove );
        OSRM.GUI.hideRouting();
    },
initFinally: function() {
},

// init map position and zoom (respect UI visibility / use browser geolocation) 
initPosition: function() {

},

// map event handlers
zoomed: function(e) {
	// prevent redraw when zooming out less than 4 levels (no need to reduce route geometry data)
	var delta_zoom = OSRM.G.route.getZoomLevel() - OSRM.G.map.getZoom(); 
	if( delta_zoom >= 0 && delta_zoom <= 3 ) 
		return;
	// redraw routes
	if(OSRM.G.dragging)
		OSRM.Routing.getRoute_Dragging();
	else
		OSRM.Routing.getRoute_Redraw({keepAlternative:true});
},
contextmenu: function(e) {;},
mousemove: function(e) { OSRM.Via.drawDragMarker(e); },
click: function(e) {
	if( e.originalEvent.shiftKey==true || e.originalEvent.metaKey==true || e.originalEvent.altKey==true )	// only create/remove markers on simple clicks
		return;
	if( !OSRM.G.markers.hasSource() ) {
		var index = OSRM.G.markers.setSource( e.latlng );
		OSRM.Geocoder.updateAddress( OSRM.C.SOURCE_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
		OSRM.G.markers.route[index].show();		
		OSRM.Routing.getRoute( {recenter:OSRM.G.markers.route.length == 2} );	// allow recentering when the route is first shown 
	} else if( !OSRM.G.markers.hasTarget() ) {
		var index = OSRM.G.markers.setTarget( e.latlng );
		OSRM.Geocoder.updateAddress( OSRM.C.TARGET_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
		OSRM.G.markers.route[index].show();
		OSRM.Routing.getRoute( {recenter:OSRM.G.markers.route.length == 2} );	// allow recentering when the route is first shown
	}
},
geolocationResponse: function(response) {
	var latlng = new L.LatLng(response.coords.latitude, response.coords.longitude);		
	OSRM.G.map.setViewUI(latlng, OSRM.DEFAULTS.ZOOM_LEVEL );
}
};

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM marker management (all route markers should only be set and deleted with these routines!)
// [this holds the vital information of the route]

OSRM.Markers = function() {
	this.route = new Array();
	this.highlight = new OSRM.DragMarker("highlight", {zIndexOffset:-1,draggable:true,icon:OSRM.G.icons['marker-highlight'],dragicon:OSRM.G.icons['marker-highlight-drag']});
	this.hover = new OSRM.Marker("hover", {zIndexOffset:-1,draggable:false,icon:OSRM.G.icons['marker-highlight']});;
	this.dragger = new OSRM.DragMarker("drag", {draggable:true,icon:OSRM.G.icons['marker-drag'],dragicon:OSRM.G.icons['marker-drag']});;
	this.initial_vias = new Array();
};
OSRM.extend( OSRM.Markers,{
reset: function() {
	// remove route markers
	for(var i=0; i<this.route.length;i++)
		this.route[i].hide();
	this.route.splice(0, this.route.length);
//	document.getElementById('gui-delete-source').style.visibility = "hidden";
//	document.getElementById('gui-delete-target').style.visibility = "hidden";
	// remove special markers
	this.highlight.hide();
	this.dragger.hide();
	// remove initial vias
	this.initial_vias.length=0;
},
    hide: function () {
        for(var i=0; i<this.route.length;i++)
            this.route[i].hide();
        this.highlight.hide();
        this.dragger.hide();
    },
    show: function () {
        for(var i=0; i<this.route.length;i++)
            this.route[i].show();
//        this.highlight.show();
//        this.dragger.show();
    },
removeVias: function() {
	// assert correct route array s - v - t
	for(var i=1; i<this.route.length-1;i++)
		this.route[i].hide();
	this.route.splice(1, this.route.length-2);
},
setSource: function(position) {
	// source node is always first node
	if( this.route[0] && this.route[0].label == OSRM.C.SOURCE_LABEL )
		this.route[0].setPosition(position);
	else
		this.route.splice(0,0, new OSRM.RouteMarker(OSRM.C.SOURCE_LABEL, {draggable:true,icon:OSRM.G.icons['marker-source'],dragicon:OSRM.G.icons['marker-source-drag']}, position));
//	document.getElementById('gui-delete-source').style.visibility = "visible";
	
	// setting initial vias (not so nice, as showing is done here too)
	if(this.initial_vias.length>0) {
		for(var i=0; i<this.initial_vias.length;i++)
			OSRM.G.markers.setVia( i, this.initial_vias[i] );
		for(var i=1; i<OSRM.G.markers.route.length-1;i++)
			OSRM.G.markers.route[i].show();
	}
	
	return 0;	
},
setTarget: function(position) {
	// target node is always last node
	if( this.route[this.route.length-1] && this.route[ this.route.length-1 ].label == OSRM.C.TARGET_LABEL )
		this.route[this.route.length-1].setPosition(position);
	else
		this.route.splice( this.route.length,0, new OSRM.RouteMarker(OSRM.C.TARGET_LABEL, {draggable:true,icon:OSRM.G.icons['marker-target'],dragicon:OSRM.G.icons['marker-target-drag']}, position));
//	document.getElementById('gui-delete-target').style.visibility = "visible";

	// setting initial vias (not so nice, as showing is done here too)	
	if(this.initial_vias.length>0) {
		for(var i=0; i<this.initial_vias.length;i++)
			OSRM.G.markers.setVia( i, this.initial_vias[i] );
		for(var i=1; i<OSRM.G.markers.route.length-1;i++)
			OSRM.G.markers.route[i].show();
	}
	
	return this.route.length-1;
},
setVia: function(id, position) {
	// via nodes only between source and target nodes
	if( this.route.length<2 || id > this.route.length-2 )
		return -1;
	
	this.route.splice(id+1,0, new OSRM.RouteMarker(OSRM.C.VIA_LABEL, {draggable:true,icon:OSRM.G.icons['marker-via'],dragicon:OSRM.G.icons['marker-via-drag']}, position));
	return id+1;
},
removeMarker: function(id) {
	if( id >= this.route.length )
		return;
	
	// also remove vias if source or target are removed
	if( id==0 && this.route[0].label == OSRM.C.SOURCE_LABEL ) {
		this.removeVias();
		document.getElementById('gui-input-source').value = "";
//		document.getElementById('gui-delete-source').style.visibility = "hidden";
		OSRM.GUI.clearResults();
	} else if( id == this.route.length-1 && this.route[ this.route.length-1 ].label == OSRM.C.TARGET_LABEL ) {
		this.removeVias();
		id = this.route.length-1;
		document.getElementById('gui-input-target').value = "";
//		document.getElementById('gui-delete-target').style.visibility = "hidden";
		OSRM.GUI.clearResults();
	}
	
	this.route[id].hide();
	this.route.splice(id, 1);
	// remove initial vias
	this.initial_vias.length=0;
},
reverseDescriptions: function() {
	var last = this.route.length-1;
	var size = this.route.length / 2;
	
	for(var i=0; i<size; ++i) {
		var temp = this.route[i].description;
		this.route[i].description = this.route[last-i].description; 
		this.route[last-i].description =  temp;
	}
},
reverseMarkers: function() {
	var size = this.route.length;
	
	// switch positions in nodes
	var temp_position = this.route[0].getPosition();
	this.route[0].setPosition( this.route[size-1].getPosition() );
	this.route[size-1].setPosition( temp_position );
	// switch nodes in array
	var temp_node = this.route[0];
	this.route[0] = this.route[size-1];
	this.route[size-1] = temp_node;
	// reverse route
	this.route.reverse();
	// clear information (both delete markers stay visible)
	OSRM.GUI.clearResults();

	// remove initial vias	
	this.reverseInitialVias();
},
hasSource: function() {
	if( this.route[0] && this.route[0].label == OSRM.C.SOURCE_LABEL )
		return true;
	return false;
},
hasTarget: function() {
	if( this.route[this.route.length-1] && this.route[this.route.length-1].label == OSRM.C.TARGET_LABEL )
		return true;
	return false;
},

addInitialVia: function(position) {
	this.initial_vias.push(position);
},
reverseInitialVias: function() {
	this.initial_vias.reverse();
},

//relabel all via markers
relabelViaMarkers: function() {
	for(var i=1, size=this.route.length-1; i<size; i++)
		this.route[i].marker.setLabel(i);
}
});
(function () {
    /*
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU AFFERO General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
    or see http://www.gnu.org/licenses/agpl.txt.
    */

    // OSRM route management (handles drawing of route geometry - current route, old route, unnamed route, highlight unnamed streets)
    // [this holds the route geometry]
    var currentId = 1;
    function zoomed () {
        // prevent redraw when zooming out less than 4 levels (no need to reduce route geometry data)
        var delta_zoom = this.getZoomLevel() - OSRM.G.map.getZoom();
        if( delta_zoom >= 0 && delta_zoom <= 3 )
            return;
        // redraw routes
        if(!OSRM.G.dragging) {
            OSRM.Routing.getRoute_Redraw({keepAlternative:true}, this);
        }
    }
    function onAdd () {
        OSRM.G.map.on('zoomend', zoomed, this);
    }
    function onRemove () {
        this._current_route.route.off('add', onAdd, this);
        this._current_route.route.off('remove', onRemove, this);
        OSRM.G.map.off('zoomend', zoomed, this);
    }
    OSRM.Route = function() {
        this.ID = currentId++;
        this._current_route		= new OSRM.SimpleRoute("current" , {dashArray:"", color: 'blue', weight: 5, opacity: 1, clickable: true} );
        this._alternative_route	= new OSRM.SimpleRoute("alternative" , {dashArray:"", color: 'blue', weight: 5, opacity: 0.5} );
        this._old_route			= new OSRM.SimpleRoute("old", {color:"#123", dashArray:"", weight: 5, opacity: 0.5} );
        this._unnamed_route		= new OSRM.MultiRoute("unnamed");
        this._current_route.route.on('add', onAdd, this);
        this._current_route.route.on('remove', onRemove, this);
        this._current_route_style	= {color:Gis.Widget.geoPathProperty().getSelectedColor(), weight:5, dashArray:"", stroke: true};
        this._current_noroute_style	= {color:'#222222', weight:2, dashArray:"8,6", stroke: true};
        this._old_route_style	= {color:'#112233', weight:5, dashArray:"", stroke: true};
        this._old_noroute_style	= {color:'#000000', weight:2, dashArray:"8,6", stroke: true};
        this._unnamed_route_style = {color:'#FF00FF', weight:10, dashArray:"", stroke: true};
        this._old_unnamed_route_style = {color:'#990099', weight:10, dashArray:"", stroke: true};
        this._alternative_route_style	= {color:'#770033', weight:5, opacity:0.6, dashArray:"", stroke: true};

        this._noroute = OSRM.Route.ROUTE;
        this._history = new OSRM.HistoryRoute();
        this._zoomlevel = 0;
    };
    OSRM.Route.NOROUTE = true;
    OSRM.Route.ROUTE = false;
    OSRM.extend( OSRM.Route,{
        updateCurrentRouteStyle: function (color) {
            this._current_route_style.color = color;
            this._current_route.setStyle( this._current_route_style );
        },
        // show/hide route
        showRoute: function(positions, noroute) {
            this._noroute = noroute;
            this._current_route.setPositions( positions );
            if ( this._noroute == OSRM.Route.NOROUTE )
                this._current_route.setStyle( this._current_noroute_style );
            else
                this._current_route.setStyle( this._current_route_style );
            this._current_route.show();
            //this._raiseUnnamedRoute();

            this._history.fetchHistoryRoute();
            this._history.showHistoryRoutes();
            this._history.storeHistoryRoute();
            this._zoomlevel = OSRM.G.map.getZoom();
        },
        hideRoute: function() {
            this._current_route.hide();
            this._unnamed_route.hide();

            this._history.fetchHistoryRoute();
            this._history.showHistoryRoutes();
            this._zoomlevel = 0;
            // deactivate GUI features that need a route
            OSRM.GUI.deactivateRouteFeatures();
        },
        // show/hide route
        show: function() {
            this._current_route.show();
            this._zoomlevel = OSRM.G.map.getZoom();
        },
        hide: function() {
            this._current_route.hide();
            this._unnamed_route.hide();
        },
        showAdditional: function() {
            this._current_route.show();
            this._zoomlevel = OSRM.G.map.getZoom();
        },
        hideAdditional: function() {
            this._unnamed_route.hide();

            this._history.fetchHistoryRoute();
            this._history.showHistoryRoutes();
        },

        // show/hide highlighting for unnamed routes
        showUnnamedRoute: function(positions) {
            this._unnamed_route.clearRoutes();
            for(var i=0; i<positions.length; i++) {
                this._unnamed_route.addRoute(positions[i]);
            }
            this._unnamed_route.setStyle( this._unnamed_route_style );
            this._unnamed_route.show();
        },
        hideUnnamedRoute: function() {
            this._unnamed_route.hide();
        },
        // TODO: hack to put unnamed_route above old_route -> easier way in will be available Leaflet 0.4
        _raiseUnnamedRoute: function() {
            if(this._unnamed_route.isShown()) {
                this._unnamed_route.hide();
                this._unnamed_route.show();
            }
        },

        // show/hide previous route as shadow
        showOldRoute: function() {
            this._old_route.setPositions( this._current_route.getPositions() );
            if ( this._noroute == OSRM.Route.NOROUTE)
                this._old_route.setStyle( this._old_noroute_style );
            else
                this._old_route.setStyle( this._old_route_style );
            this._old_route.show();
            this._raiseUnnamedRoute();
            // change color of unnamed route highlighting - no separate object as dragged route does not have unnamed route highlighting
            this._unnamed_route.setStyle( this._old_unnamed_route_style );
        },
        hideOldRoute: function() {
            this._old_route.hide();
        },

        // show/hide alternative route
        showAlternativeRoute: function(positions) {
            this._alternative_route.setPositions( positions );
            this._alternative_route.setStyle( this._alternative_route_style );
            this._alternative_route.show();
        },
        hideAlternativeRoute: function() {
            this._alternative_route.hide();
        },

        // query routines
        isShown: function() {
            return this._current_route.isShown();
        },
        isRoute: function() {
            return !(this._noroute);
        },
        getPositions: function() {
            return this._current_route.getPositions();
        },
        getPoints: function() {
            return this._current_route.getPoints();
        },
        getZoomLevel: function() {
            return this._zoomlevel;
        },

        // helper routines
        reset: function() {
            this.hideRoute();
            this._old_route.hide();
            this._noroute = OSRM.Route.ROUTE;
            this._history.clearHistoryRoutes();
        },
        fire: function(type,event) {
            this._current_route.route.fire(type,event);
        },
        centerView: function() {
            this._current_route.centerView();
        },

        // handle history routes
        activateHistoryRoutes: function() {
            this._history.activate();
        },
        deactivateHistoryRoutes: function() {
            this._history.deactivate();
        }
    });
}());
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM route management (handles drawing of route geometry - current route, old route, unnamed route, highlight unnamed streets) 
// [this holds the route geometry]


OSRM.HistoryRoute = function() {
	// style and count of history routes
	this._history_styles = [{color:'#FFFFFF', opacity:0.5, weight:5, dashArray:""},
	                        {color:'#0000DD', opacity:0.45, weight:5, dashArray:""},
	                        {color:'#0000BB', opacity:0.40, weight:5, dashArray:""},
	                        {color:'#000099', opacity:0.35, weight:5, dashArray:""},
	                        {color:'#000077', opacity:0.30, weight:5, dashArray:""},
	                        {color:'#000055', opacity:0.25, weight:5, dashArray:""},
	                        {color:'#000033', opacity:0.20, weight:5, dashArray:""},
	                        {color:'#000011', opacity:0.15, weight:5, dashArray:""},
	                        {color:'#000000', opacity:0.10, weight:5, dashArray:""}
	                        ];
	this._history_length = this._history_styles.length;
	
	// actual history data
	this._history = [];
	for(var i=0, size=this._history_length; i<size; i++) {
		var history = {};
		history.route = new OSRM.SimpleRoute("current" , {dashArray:""} );
		history.markers = [];
		history.checksum = null;
		this._history.push(history);
	}
	
	// helper functions bound to this
	this._initiate_redrawHistory = OSRM.bind(this, this._getRoute_RedrawHistory);
	this._callback_redrawHistory = OSRM.bind(this, this._showRoute_RedrawHistory);
};
OSRM.extend( OSRM.HistoryRoute,{
	// switch history routes on/off
	activate: function() {
		this.storeHistoryRoute = this._storeHistoryRoute;
		this.fetchHistoryRoute = this._fetchHistoryRoute;
		this.showHistoryRoutes = this._showHistoryRoutes;
		this.clearHistoryRoutes = this._clearHistoryRoutes;
		OSRM.G.map.on('zoomend', this._initiate_redrawHistory );
		
		this.storeHistoryRoute();
	},
	deactivate: function() {
		this.clearHistoryRoutes();
		
		this.storeHistoryRoute = this.empty;
		this.fetchHistoryRoute = this.empty;
		this.showHistoryRoutes = this.empty;
		this.clearHistoryRoutes = this.empty;
		OSRM.G.map.off('zoomend', this._initiate_redrawHistory );
	},
	
	// empty function
	empty: function() {},
	storeHistoryRoute: function() {},
	fetchHistoryRoute: function() {},
	showHistoryRoutes: function() {},
	clearHistoryRoutes: function() {},
	
	// actual functions
	_storeHistoryRoute: function() {
		var route = OSRM.G.route;
		if( !route.isShown() || !route.isRoute() )
			return;
			
		// store current route in staging spot
		var hint_data = OSRM.G.response.hint_data;
		this._history[0].route.setPositions( route.getPositions() );
		this._history[0].checksum = hint_data.checksum;
		this._history[0].markers = [];

		var markers = this._getCurrentMarkers();
		for(var i=0,size=markers.length; i<size; i++) {
			var position = { lat:markers[i].lat, lng:markers[i].lng, hint:hint_data.locations[i] };
			this._history[0].markers.push(position);
		}
	},
	_fetchHistoryRoute: function() {
		if( this._history[0].markers.length == 0 )
			return;
		if( OSRM.G.route.isShown() && this._equalMarkers(this._history[0].markers, this._getCurrentMarkers()) )
			return;
		if( this._equalMarkers(this._history[0].markers, this._history[1].markers) )
			return;		

		// move all routes down one position
		for(var i=this._history_length-1; i>0; i--) {
			this._history[i].route.setPositions( this._history[i-1].route.getPositions() ); // copying positions quicker than creating new route!
			this._history[i].markers = this._history[i-1].markers;
			this._history[i].checksum = this._history[i-1].checksum;
		}		
		// reset staging spot
		this._history[0].route.setPositions( [] );
		this._history[0].markers = [];
		this._history[0].checksum = null;
	},	
	_showHistoryRoutes: function() {
		for(var i=1,size=this._history_length; i<size; i++) {
			this._history[i].route.setStyle( this._history_styles[i] );
			this._history[i].route.show();
			OSRM.G.route.hideOldRoute();
		}
	},
	_clearHistoryRoutes: function() {
		for(var i=0,size=this._history_length; i<size; i++) {
			this._history[i].route.hide();
			this._history[i].route.setPositions( [] );
			this._history[i].markers = [];
			this._history[i].checksum = null;
		}
	},
	
	// get positions of current markers (data of jsonp response used, as not all data structures up-to-date!)
	_getCurrentMarkers: function() {
		var route = [];
		
		var positions = OSRM.G.route.getPositions();
		if(positions.length == 0)
			return route;
		
		for(var i=0; i<OSRM.G.response.via_points.length; i++)
			route.push( {lat:OSRM.G.response.via_points[i][0], lng:OSRM.G.response.via_points[i][1]} );
		return route;
	},
	
	// check if two routes are equivalent by checking their markers
	_equalMarkers: function(lhs, rhs) {
		if(lhs.length != rhs.length)
			return false;
		var pr = OSRM.C.PRECISION;
		for(var i=0,size=lhs.length; i<size; i++) {
			if( lhs[i].lat.toFixed(pr) != rhs[i].lat.toFixed(pr) || lhs[i].lng.toFixed(pr) != rhs[i].lng.toFixed(pr) )
				return false;
		}
		return true;
	},
	
	// requery history routes
	_showRoute_RedrawHistory: function(response, history_id) {
		if(!response)
			return;
		
		var positions = OSRM.RoutingGeometry._decode(response.route_geometry, OSRM.C.PRECISION);
		this._history[history_id].route.setPositions(positions);
		this._updateHints(response, history_id);
	},
	_getRoute_RedrawHistory: function() {
		for(var i=0,size=this._history_length; i<size; i++)
			if( this._history[i].markers.length > 0 ) {
				OSRM.JSONP.clear('history'+i);
				OSRM.JSONP.call(this._buildCall(i)+'&instructions=false', this._callback_redrawHistory, OSRM.JSONP.empty, OSRM.DEFAULTS.JSONP_TIMEOUT, 'history'+i, i);
			}
	},
	_buildCall: function(history_id) {
		var source = OSRM.G.active_routing_server_url;
		source += '?z=' + Gis.OSRM.getMapZoom() + '&output=json&jsonp=%jsonp';
		
		if(this._history[history_id].checksum)
			source += '&checksum=' + this._history[history_id].checksum;
		
		var history_markers = this._history[history_id].markers;
		var pr = OSRM.C.PRECISION;
		for(var i=0,size=history_markers.length; i<size; i++) {
			source += '&loc='  + history_markers[i].lat.toFixed(pr) + ',' + history_markers[i].lng.toFixed(pr);
			if( history_markers[i].hint )
				source += '&hint=' + history_markers[i].hint;
		}
		return source;
	},
	_updateHints: function(response, history_id) {
        if (response.hint_data) {
            this._history[history_id].checksum = response.hint_data.checksum;

            var hints = response.hint_data.locations;
            for (var i = 0; i < hints.length; i++)
                this._history[history_id].markers[i].hint = hints[i];
        }
	}
});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM GUI
// [base GUI class, all other GUI modules extend this class]


OSRM.GUI = {
		
// initialization functions of all GUI parts
init_functions: [],

// init GUI
init: function() {
	for(var i=0, size=OSRM.GUI.init_functions.length; i<size; i++) {
		OSRM.GUI.init_functions[i]();
	}
},

//extend GUI class and add init functions to the array
extend: function( properties ) {
	for( property in properties ) {
		if( property == 'init' )
			OSRM.GUI.init_functions.push( properties[property] );
		else
			OSRM.GUI[property] = properties[property];
	}
} 

};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM MainGUI
// [handles all GUI events that interact with appearance of main window]


// OSRM GUIBoxGroup
// [group UI boxes so that handles can be shown/hidden together]

OSRM.GUIBoxGroup = function() {
	this._handles = [];
};

OSRM.extend( OSRM.GUIBoxGroup, {
add: function( handle ) {
	this._handles.push( handle );
	handle.$addToGroup(this);
},
select: function( handle ) {
	for(var i=0; i< this._handles.length; i++) {
		if( this._handles[i] != handle )
			this._handles[i].$hideBox();
		else
			this._handles[i].$showBox();
	}
},

$hide: function() {
	for(var i=0; i< this._handles.length; i++) {
		this._handles[i].$hide();
	}
},
$show: function() {
	for(var i=0; i< this._handles.length; i++) {
		this._handles[i].$show();
	}
}
});
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM GUIBoxHandle
// [performs showing and hiding of UI boxes]

OSRM.GUIBoxHandle = function( box_name, side, css, transitionStartFct, transitionEndFct  ) {
	// do not create handle if box does not contain a toggle button
	var toggle = document.getElementById( box_name + '-toggle');
	if( toggle == null ) {
		console.log("[error] No toggle button for " + box_name);
		return;
	}
	
	// create handle DOM elements
	var wrapper = document.createElement('div');
	wrapper.id = box_name + '-handle-wrapper';
	wrapper.className = 'box-wrapper box-handle-wrapper-'+side;
	wrapper.style.cssText += css;
	var content = document.createElement('div');
	content.id = box_name + '-handle-content';
	content.className = 'box-content box-handle-content-'+side;
	var icon = document.createElement('div');
	icon.id = box_name + '-handle-icon';
	icon.className = 'iconic-button';
	icon.title = box_name;
	
	content.appendChild(icon);
	wrapper.appendChild(content);
	document.body.appendChild(wrapper);
	
	// create attributes
	this._box = document.getElementById( box_name + '-wrapper' );
	this._class = this._box.className;
	this._width = this._box.clientWidth;
	this._side = side;
	this._handle = wrapper;
	this._box_group = null;
	this._transitionEndFct = transitionEndFct;

	// hide box and show handle by default
	this._box.style[this._side]=-this._width+"px";
	this._box_visible = false;
	this._box.style.visibility="hidden";
	this._handle.style.visibility="visible";

	// add functionality
	var full_fct = transitionStartFct ? OSRM.concat(this._toggle, transitionStartFct) : this._toggle;
	var fct = OSRM.bind( this, full_fct );
	toggle.onclick = fct;
	icon.onclick = fct;
	
	var full_fct = transitionEndFct ? OSRM.concat(this._onTransitionEnd, transitionEndFct) : this._onTransitionEnd;
	var fct = OSRM.bind( this, full_fct );	
	if( OSRM.Browser.FF3==-1 && OSRM.Browser.IE6_9==-1 ) {
		var box_wrapper = document.getElementById(box_name + '-wrapper');
		box_wrapper.addEventListener("transitionend", fct, false);
		box_wrapper.addEventListener("webkitTransitionEnd", fct, false);
		box_wrapper.addEventListener("oTransitionEnd", fct, false);
		box_wrapper.addEventListener("MSTransitionEnd", fct, false);
	} else {
		this._legacyTransitionEndFct = OSRM.bind( this, function(){fct({target:this._box});} );	// legacy browser support
	}
};

OSRM.extend( OSRM.GUIBoxHandle, {
boxVisible: function() {
	return this._box_visible;
},
boxWidth: function() {
	return this._width;
},

$addToGroup: function(group) {
	this._box_group = group;
},
$show: function() {
	this._handle.style.visibility="visible";
},
$hide: function() {
	this._handle.style.visibility="hidden";
},
$showBox: function() {
	this._box_visible = true;
	this._box.style.visibility="visible";
	this._handle.style.visibility="hidden";
	this._box.style[this._side]="5px";
},
$hideBox: function() {
	this._box_visible = false;
	this._box.style.visibility="hidden";
	this._handle.style.visibility="visible";
	this._box.style[this._side]=-this._width+"px";
},

_toggle: function() {
	this._box.className += " box-animated";
	if( this._box_visible == false ) {
		this._box_group.$hide();
		this._box.style[this._side]="5px";
		this._box.style.visibility="visible";			// already show box, so that animation is seen
	} else {
		this._box.style[this._side]=-this._width+"px";
	}
	// legacy browser support
	if( OSRM.Browser.FF3!=-1 || OSRM.Browser.IE6_9!=-1 )
		setTimeout( this._legacyTransitionEndFct, 0);
},
_onTransitionEnd: function(e) {
	if(e.target != this._box)
		return;
	this._box.className = this._class;
	if( this._box_visible == true ) {
		this._box_group.$show();
		this._box_visible = false;
		this._box.style.visibility="hidden";
	} else {
		this._box_visible = true;
		this._box.style.visibility="visible";
	}	
}
});
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM selector
// [create special selector elements]


OSRM.GUI.extend( {

// initialize selector with all options and our look&feel
selectorInit: function(id, options, selected, onchange_fct) {
	// create dropdown menu
	var select = document.getElementById(id);
	select.className += " styled-select-helper base-font";
	select.onchange = function() { OSRM.GUI._selectorOnChange(this); onchange_fct(this.value); };	
		
	// fill dropdown menu
	for(var i=0, size=options.length; i<size; i++) {
		var option=document.createElement("option");
		option.innerHTML = options[i].display;
		option.value = options[i].value;
		select.appendChild(option);
	}
	select.value = options[selected].value;
	
	// create visible dropdown menu
	var textnode = document.createTextNode( options[selected].display );
	var myspan = document.createElement("span");
	myspan.className = "styled-select base-font";
	myspan.id = "styled-select-" + select.id;
	myspan.appendChild(textnode);
	select.parentNode.insertBefore(myspan, select);
	myspan.style.width = (select.offsetWidth-2)+"px";
	myspan.style.height = (select.offsetHeight)+"px";	// clientHeight gives the height of the opened dropbox!
},

// required behaviour of selector on change to switch shown name
_selectorOnChange: function(select) {
	var option = select.getElementsByTagName("option");	
	for(var i = 0; i < option.length; i++)
	if(option[i].selected == true) {
		document.getElementById("styled-select-" + select.id).childNodes[0].nodeValue = option[i].childNodes[0].nodeValue;
		break;
	}
},

// change selector value
selectorChange: function(id, value) {
	var select = document.getElementById(id);
	select.value = value;
	OSRM.GUI._selectorOnChange(select);
},

// replace selector options with new names
selectorRenameOptions: function(id, options) {
	var select = document.getElementById(id);
	var styledSelect = document.getElementById("styled-select-"+id);

	// create new dropdown menu
	var new_select = document.createElement("select");
	new_select.id = id;
	new_select.className = select.className;
	new_select.onchange = select.onchange;	
		
	// fill new dropdown menu
	var selected_display = "";
	for(var i=0, size=options.length; i<size; i++) {
		var option=document.createElement("option");
		option.innerHTML = options[i].display;
		option.value = options[i].value;
		new_select.appendChild(option);
		
		if( options[i].value == select.value )
			selected_display = options[i].display;		
	}
	new_select.value = select.value;
	
	// switch old with new dropdown menu
	select.parentNode.insertBefore(new_select, select);
	select.parentNode.removeChild(select);
	
	// change styled dropdown menu size & language
	styledSelect.childNodes[0].nodeValue = selected_display;
	styledSelect.style.width = (new_select.offsetWidth-2)+"px";
	styledSelect.style.height = (new_select.offsetHeight)+"px";
	
//	// old variant without creating a new dropdown menu (works in current browsers, but not in older FF or IE)
//	var select = document.getElementById(id);
//	var select_options = select.getElementsByTagName("option");
//	var styledSelect = document.getElementById("styled-select-"+id);
//	
//	// fill dropdown menu with new option names
//	for(var i = 0; i < select_options.length; i++) {
//		select_options[i].childNodes[0].nodeValue = options[i].display;
//		
//		if(select_options[i].selected == true)
//			styledSelect.childNodes[0].nodeValue = options[i].display;
//	}
//	
//	// resize visible dropdown menu as needed
//	styledSelect.style.width = (select.offsetWidth-2)+"px";
//	styledSelect.style.height = (select.offsetHeight)+"px";	// clientHeight gives the height of the opened dropbox!	
}

});
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM MainGUI
// [handles all GUI events that interact with appearance of main window]


OSRM.GUI.extend( {
		
// init GUI
init: function() {
	// init main box
	OSRM.G.main_handle = 1;

	// init additional boxes
	var option_group = new OSRM.GUIBoxGroup();
	option_group.select( null );
	
	// init starting source/target
	document.getElementById('gui-input-source').value = OSRM.DEFAULTS.ONLOAD_SOURCE;
	document.getElementById('gui-input-target').value = OSRM.DEFAULTS.ONLOAD_TARGET;
	
	//init units selector
},

// set language dependent labels
setLabels: function() {
//	document.getElementById("gui-reset").innerHTML = OSRM.loc("GUI_RESET");
	document.getElementById("gui-reverse").innerHTML = OSRM.loc("GUI_REVERSE");
	document.getElementById("gui-search-source-label").innerHTML = OSRM.loc("GUI_START")+":";
	document.getElementById("gui-search-target-label").innerHTML = OSRM.loc("GUI_END")+":";
	document.getElementById("gui-input-source").title = OSRM.loc("GUI_START_TOOLTIP");
	document.getElementById("gui-input-target").title = OSRM.loc("GUI_END_TOOLTIP");
	OSRM.GUI.setDistanceFormatsLanguage();
	OSRM.GUI.setRoutingEnginesLanguage();	
},

// clear output area
clearResults: function() {
	document.getElementById('information-box').className = 'information-box-with-normal-header';
	document.getElementById('information-box').innerHTML = "";
	document.getElementById('information-box-header').innerHTML = "";
    Gis.EventBus.fire('route-changed');
},

// reposition and hide zoom controls before main box animation
beforeMainTransition: function() {
	OSRM.G.map.zoomControl.hide();
},
// show zoom controls after main box animation
afterMainTransition: function() {
	OSRM.G.map.zoomControl.show();
},

// distance format routines
initDistanceFormatsSelector: function() {
	var options = OSRM.GUI.getDistanceFormats();
	OSRM.GUI.selectorInit( "gui-units-toggle", options, OSRM.DEFAULTS.DISTANCE_FORMAT, OSRM.GUI._onDistanceFormatChanged );	
},
setDistanceFormat: function(type) {
	if( OSRM.G.active_distance_format == type )
		return;
	OSRM.G.active_distance_format = type;
	
	// change scale control
	if(OSRM.G.map) {
		OSRM.G.map.scaleControl.removeFrom(OSRM.G.map);
		OSRM.G.map.scaleControl.options.metric = (type != 1);
		OSRM.G.map.scaleControl.options.imperial = (type == 1);
		OSRM.G.map.scaleControl.addTo(OSRM.G.map);
	}
	
	// change converter
	if( type == 1 )
		OSRM.Utils.toHumanDistance = OSRM.Utils.toHumanDistanceMiles;
	else
		OSRM.Utils.toHumanDistance = OSRM.Utils.toHumanDistanceMeters;
},
_onDistanceFormatChanged: function(type) {
	OSRM.GUI.setDistanceFormat(type);
	OSRM.Routing.getRoute({keepAlternative:true});
},
setDistanceFormatsLanguage: function() {
	var options = OSRM.GUI.getDistanceFormats();
},
getDistanceFormats: function() {
	return [{display:OSRM.loc("GUI_KILOMETERS"),value:0},{display:OSRM.loc("GUI_MILES"),value:1}];
},

// data timestamp routines
queryDataTimestamp: function() {
	OSRM.G.data_timestamp = "n/a";
//	document.getElementById('gui-data-timestamp').innerHTML = OSRM.G.data_timestamp;
	OSRM.JSONP.call( OSRM.G.active_routing_timestamp_url+"?jsonp=%jsonp", OSRM.GUI.setDataTimestamp, OSRM.JSONP.empty, OSRM.DEFAULTS.JSONP_TIMEOUT, 'data_timestamp');
},
setDataTimestamp: function(response) {
	if(!response)
		return;

	OSRM.G.data_timestamp = response.timestamp.slice(0,25).replace(/<\/?[^>]+(>|$)/g ,"");	// discard tags
//	document.getElementById('gui-data-timestamp').innerHTML = OSRM.G.data_timestamp;
}

});
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routing
// [management of routing requests and processing of responses]

// some variables
OSRM.GLOBALS.route = null;
OSRM.GLOBALS.markers = null;

OSRM.GLOBALS.dragging = null;
OSRM.GLOBALS.dragid = null;
OSRM.GLOBALS.pending = false;


function getRequestUrl (marker) {
    var pr = OSRM.C.PRECISION;
    return Gis.config(Gis.GEO_NEAREST_URL, 'http://router.project-osrm.org/locate') + '?output=json&loc='  + marker.getLat().toFixed(pr) + ',' + marker.getLng().toFixed(pr);
}
OSRM.Routing = {
		
// init routing data structures
init: function() {
	// init variables	
	OSRM.GUI.setRoutingEngine( OSRM.DEFAULTS.ROUTING_ENGINE );

	OSRM.G.markers = new OSRM.Markers();	
	OSRM.G.route = new OSRM.Route();
	OSRM.G.response = { via_points:[] };
	
	OSRM.RoutingDescription.init();
},


// -- JSONP processing -- 

// process JSONP response of routing server
timeoutRoute: function() {
	OSRM.G.response = { via_points:[] }; 
	OSRM.RoutingGeometry.showNA();
	OSRM.RoutingNoNames.showNA();
	OSRM.RoutingDescription.showNA( OSRM.loc("TIMED_OUT") );
	OSRM.Routing._snapRoute();	
},
timeoutRoute_Dragging: function() {
	OSRM.RoutingGeometry.showNA();
	OSRM.RoutingDescription.showNA( OSRM.loc("TIMED_OUT") );
},
timeoutRoute_Reversed: function() {
	OSRM.G.markers.reverseMarkers();
	OSRM.Routing.timeoutRoute();
},
showRoute: function(response, parameters) {
	if(!response)
		return;
	if( parameters.keepAlternative != true )
		OSRM.G.active_alternative = 0;
	
	OSRM.G.response = response;	// needed for printing & history routes!
	OSRM.Routing._snapRoute();
	if(response.status == 207) {
		OSRM.RoutingGeometry.showNA();
		OSRM.RoutingNoNames.showNA();
		OSRM.RoutingDescription.showNA( OSRM.loc("NO_ROUTE_FOUND") );
	} else {
		OSRM.RoutingAlternatives.prepare(OSRM.G.response);
		OSRM.RoutingGeometry.show(OSRM.G.response);
		OSRM.RoutingNoNames.show(OSRM.G.response);
		OSRM.RoutingDescription.show(OSRM.G.response);
	}
	OSRM.Routing._updateHints(response);
	if( parameters.recenter == true ) {		// allow recentering when the route is first shown
		var bounds = new L.LatLngBounds( OSRM.G.route._current_route.getPositions() );
		OSRM.G.map.setViewBoundsUI(bounds);
	}
},
showRoute_Dragging: function(response) {
 	if(!response)
 		return;
 	if( !OSRM.G.dragging )		// prevent simple routing when not dragging (required as there can be drag events after a dragstop event!)
 		return;

	OSRM.G.response = response;	// needed for history routes!
	if( response.status == 207) {
		OSRM.RoutingGeometry.showNA();
		OSRM.RoutingDescription.showNA( OSRM.loc("YOUR_ROUTE_IS_BEING_COMPUTED") );
	} else {
		OSRM.RoutingGeometry.show(response);
		OSRM.RoutingDescription.showSimple(response);
	}
	OSRM.Routing._updateHints(response);

	if(OSRM.G.pending)
		setTimeout(OSRM.Routing.draggingTimeout,1);		
},
showRoute_Redraw: function(response, parameters) {
	if(!response)
		return;
    var route = parameters.route || OSRM.G.route;
    var isActiveRoute = !parameters.route || parameters.route === OSRM.G.route;
	if(isActiveRoute && parameters.keepAlternative == false )
		OSRM.G.active_alternative = 0;

    if (isActiveRoute) {
        OSRM.G.response = response;	// not needed, even harmful as important information is not stored! ==> really ????
    }
	if(response.status != 207) {
        if (isActiveRoute) {
            OSRM.RoutingAlternatives.prepare(response);
        }
		OSRM.RoutingGeometry.show(response, route);
        if (isActiveRoute) {
            OSRM.RoutingNoNames.show(response);
        }
	}
    if (isActiveRoute) {
        OSRM.Routing._updateHints(response);
    }
},


//-- main function --

    getNearest: function (callback) {
        var markers = OSRM.G.markers.route;
        $.ajax({
            url: getRequestUrl(markers[0]),
            dataType: 'json',
            success: function (data) {
                if (data && data.mapped_coordinate) {
                    markers[0].setPosition(L.latLng(data.mapped_coordinate[0], data.mapped_coordinate[1]));
                    $.ajax({
                        url: getRequestUrl(markers[markers.length - 1]),
                        dataType: 'json',
                        success: function (data) {
                            if (data && data.mapped_coordinate) {
                                markers[markers.length - 1].setPosition(L.latLng(data.mapped_coordinate[0], data.mapped_coordinate[1]));
                                callback();
                            }
                        }
                    });
                }
            }
        });
    },
//generate server calls to query routes
getRoute: function(parameters) {
	// if source or target are not set -> hide route
	if( OSRM.G.markers.route.length < 2 ) {
		OSRM.G.route.hideRoute();
		return;
	}
	
	parameters = parameters || {};
	
	OSRM.JSONP.clear('dragging');
	OSRM.JSONP.clear('redraw');
	OSRM.JSONP.clear('route');
	OSRM.JSONP.call(OSRM.Routing._buildCall()+'&instructions=true', OSRM.Routing.showRoute, OSRM.Routing.timeoutRoute, OSRM.DEFAULTS.JSONP_TIMEOUT, 'route', parameters);
},
getRoute_Reversed: function() {
	if( OSRM.G.markers.route.length < 2 )
		return;
	
	OSRM.JSONP.clear('dragging');
	OSRM.JSONP.clear('redraw');
	OSRM.JSONP.clear('route');
	OSRM.JSONP.call(OSRM.Routing._buildCall()+'&instructions=true', OSRM.Routing.showRoute, OSRM.Routing.timeoutRoute_Reversed, OSRM.DEFAULTS.JSONP_TIMEOUT, 'route', {});
},
getRoute_Redraw: function(parameters, route) {
	if( OSRM.G.markers.route.length < 2 && (!route || !route.route || route.route.length < 2))
		return;
	
	parameters = parameters || {};
    parameters.route = route || OSRM.G.route;
	
	OSRM.JSONP.clear('dragging');
	OSRM.JSONP.clear('redraw');
	OSRM.JSONP.call(OSRM.Routing._buildCall(route && route.route)+'&instructions=true', OSRM.Routing.showRoute_Redraw, OSRM.Routing.timeoutRoute, OSRM.DEFAULTS.JSONP_TIMEOUT, 'redraw' + parameters.route.ID,parameters);
},
getRoute_Dragging: function() {
	OSRM.G.pending = !OSRM.JSONP.call(OSRM.Routing._buildCall()+'&alt=false&instructions=false', OSRM.Routing.showRoute_Dragging, OSRM.Routing.timeoutRoute_Dragging, OSRM.DEFAULTS.JSONP_TIMEOUT, 'dragging');
},
draggingTimeout: function() {
	OSRM.G.markers.route[OSRM.G.dragid].hint = null;
	OSRM.Routing.getRoute_Dragging();
},

_buildCall: function(markers) {
	var source = OSRM.G.active_routing_server_url, latLng;
	source += '?z=' + Gis.OSRM.getMapZoom() + '&output=json&jsonp=%jsonp';
	if(OSRM.G.markers.checksum)
		source += '&checksum=' + OSRM.G.markers.checksum;
	markers = markers || OSRM.G.markers.route;
	var pr = OSRM.C.PRECISION;
	for(var i=0,size=markers.length; i<size; i++) {
        latLng = this._getLatLng(markers[i]);
		source += '&loc='  + latLng.lat.toFixed(pr) + ',' + latLng.lng.toFixed(pr);
		if( markers[i].hint)
			source += '&hint=' + markers[i].hint;
	}
	return source;
},
    _getLatLng: function (marker) {
        return marker.getLat ? L.latLng(marker.getLat(), marker.getLng()) : L.latLng(marker.lat, marker.lng);
    },

//-- helper functions --

// update hints of all markers
_updateHints: function(response) {
    if (response.hint_data) {
        var hint_locations = response.hint_data.locations;
        OSRM.G.markers.checksum = response.hint_data.checksum;
        for (var i = 0; i < hint_locations.length; i++)
            OSRM.G.markers.route[i].hint = hint_locations[i];
    }
},

// snap all markers to the received route
_snapRoute: function() {
	var markers = OSRM.G.markers.route;
	var via_points = OSRM.G.response.via_points;

    if (via_points) {
        for (var i = 0; i < via_points.length; i++)
            markers[i].setPosition(new L.LatLng(via_points[i][0], via_points[i][1]));
    }

 	OSRM.Geocoder.updateAddress(OSRM.C.SOURCE_LABEL);
 	OSRM.Geocoder.updateAddress(OSRM.C.TARGET_LABEL);

	OSRM.G.markers.relabelViaMarkers();
}

};

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routing alternatives
// [everything about handling alternatives]


OSRM.RoutingAlternatives = {

// data of gui buttons for alternativess
_buttons: [
	{id:"gui-a", label:"A"},
	{id:"gui-b", label:"B"}
],

// initialize required values
init: function() {
	OSRM.G.active_alternative = 0;
	OSRM.G.alternative_count = 0;
},

// restructure response data
prepare: function(response) {
	// move best route to alternative array
	var the_response = OSRM.G.response;
	the_response.route_name = the_response.route_name || [];							// delete when fully implemented in routing engine
	the_response.alternative_names = the_response.alternative_names || [ [] ];			// delete when fully implemented in routing engine
	if (the_response.alternative_geometries) {
		the_response.alternative_geometries.unshift( response.route_geometry );
		the_response.alternative_instructions.unshift( response.route_instructions );
		the_response.alternative_summaries.unshift( response.route_summary );
		the_response.alternative_names.unshift( response.route_name );

		// update basic information
		OSRM.G.alternative_count = response.alternative_geometries.length;
		if( OSRM.G.active_alternative >= OSRM.G.alternative_count )	// reset if the selected alternative cannot be found
			OSRM.G.active_alternative = 0;

		// switch data
		the_response.route_geometry = the_response.alternative_geometries[OSRM.G.active_alternative];
		the_response.route_instructions = the_response.alternative_instructions[OSRM.G.active_alternative];
		the_response.route_summary = the_response.alternative_summaries[OSRM.G.active_alternative];
		the_response.route_name = the_response.alternative_names[OSRM.G.active_alternative];
	}
},

// switch active alternative and redraw buttons accordingly
setActive: function(button_id) {
	// switch active alternative
	OSRM.G.active_alternative = button_id;

	// redraw clickable buttons
	var buttons = OSRM.RoutingAlternatives._buttons;
	for(var i=0, size=OSRM.G.alternative_count; i<size; i++) {
		document.getElementById( buttons[i].id ).className = (button_id == i) ? "selected top-right-button widget-control gis-propertys-button" : "widget-control gis-propertys-button  top-right-button";
	}
	// do nothing for non-clickable buttons
},

//draw GUI and register click events
show: function() {
	var buttons = OSRM.RoutingAlternatives._buttons;
	var data = "";
	// draw clickable buttons
	for(var i=0, size=OSRM.G.alternative_count; i<size && OSRM.G.response.alternative_summaries; i++) {
		var distance = OSRM.Utils.toHumanDistance(OSRM.G.response.alternative_summaries[i].total_distance);
		var time = OSRM.Utils.toHumanTime(OSRM.G.response.alternative_summaries[i].total_time);
		var route_name = " &#10;(";
		for(var j=0, sizej=OSRM.G.response.alternative_names[i].length; j<sizej; j++)
			route_name += ( j>0 && OSRM.G.response.alternative_names[i][j] != "" && OSRM.G.response.alternative_names[i][j-1] != "" ? " - " : "") + OSRM.G.response.alternative_names[i][j];
		route_name += ")";
		var tooltip = OSRM.loc("DISTANCE")+": "+distance+" &#10;"+OSRM.loc("DURATION")+": "+time+route_name;
		var buttonClass = (i == OSRM.G.active_alternative) ? "selected" : "";
		data = '<button class="'+buttonClass+' widget-control gis-propertys-button top-right-button" id="'+buttons[i].id+'" title="'+tooltip+'">'+buttons[i].label+'</button>' + data;
	}
	// draw non-clickable buttons
	for(var i=OSRM.G.alternative_count, size=buttons.length; i<size; ++i) {
		data = '<button class="disabled widget-control gis-propertys-button  top-right-button" id="'+buttons[i].id+'">'+buttons[i].label+'</button>' + data;
	}
	// add buttons to DOM
	document.getElementById('information-box-header').innerHTML = data + document.getElementById('information-box-header').innerHTML;
    Gis.EventBus.fire('route-changed');

	// add events
	for(var i=0, size=OSRM.G.alternative_count; i<size; i++) {
        var button = document.getElementById(buttons[i].id);
        if (button) {
            button.onclick = function (button_id) {
                return function () {
                    OSRM.RoutingAlternatives._click(button_id);
                };
            }(i);
            button.onmouseover = function (button_id) {
                return function () {
                    OSRM.RoutingAlternatives._mouseover(button_id);
                };
            }(i);
            button.onmouseout = function (button_id) {
                return function () {
                    OSRM.RoutingAlternatives._mouseout(button_id);
                };
            }(i);
        }
	}
},

// mouse events on buttons
_click: function(button_id) {
	if( OSRM.G.active_alternative == button_id )
		return;
	OSRM.RoutingAlternatives.setActive(button_id);
	OSRM.G.route.hideAlternativeRoute();

	// switch data
	var the_response = OSRM.G.response;
	the_response.route_geometry = the_response.alternative_geometries[button_id];
	the_response.route_instructions = the_response.alternative_instructions[button_id];
	the_response.route_summary = the_response.alternative_summaries[button_id];
	the_response.route_name = the_response.alternative_names[button_id];

	// redraw route & data
	OSRM.RoutingGeometry.show(the_response);
	OSRM.RoutingNoNames.show(the_response);
	OSRM.RoutingDescription.show(the_response);
	OSRM.G.markers.highlight.hide();
},
_mouseover: function(button_id) {
	if( OSRM.G.active_alternative == button_id )
		return;

	var geometry = OSRM.RoutingGeometry._decode( OSRM.G.response.alternative_geometries[button_id], OSRM.C.PRECISION);
	OSRM.G.route.showAlternativeRoute(geometry);
},
_mouseout: function(button_id) {
	if( OSRM.G.active_alternative == button_id )
		return;

	OSRM.G.route.hideAlternativeRoute();
}

};

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routing description
// [renders routing description and manages events]


OSRM.RoutingDescription = {
		
// directory with qrcodes files
QR_DIRECTORY: 'qrcodes/',
		
// initialization of required variables and events
init: function() {
	OSRM.G.active_shortlink = null;
	OSRM.Browser.onUnloadHandler( OSRM.RoutingDescription.uninit );
},
uninit: function() {
	if( OSRM.G.qrcodewindow )
		OSRM.G.qrcodewindow.close();	
},

// route description events
onMouseOverRouteDescription: function(lat, lng) {
	OSRM.G.markers.hover.setPosition( new L.LatLng(lat, lng) );
	OSRM.G.markers.hover.show();

},
onMouseOutRouteDescription: function(lat, lng) {
	OSRM.G.markers.hover.hide();	
},
onClickRouteDescription: function(lat, lng, desc) {
	OSRM.G.markers.highlight.setPosition( new L.LatLng(lat, lng) );
	OSRM.G.markers.highlight.show();
	OSRM.G.markers.highlight.centerView(OSRM.DEFAULTS.HIGHLIGHT_ZOOM_LEVEL);	

	if( OSRM.G.markers.highlight.description != null && document.getElementById("description-"+OSRM.G.markers.highlight.description) )
		document.getElementById("description-"+OSRM.G.markers.highlight.description).className = "description-body-item";
	OSRM.G.markers.highlight.description = desc;
	document.getElementById("description-"+desc).className = "description-body-item description-body-item-selected";
},


// handling of routing description
show: function(response) {
	var pr = OSRM.C.PRECISION;
	
	// activate GUI features that need a route
	OSRM.GUI.activateRouteFeatures();
	
	// compute query string
	var query_string = '?hl=' + OSRM.Localization.current_language;
	for(var i=0; i<OSRM.G.markers.route.length; i++)
		query_string += '&loc=' + OSRM.G.markers.route[i].getLat().toFixed(pr) + ',' + OSRM.G.markers.route[i].getLng().toFixed(pr); 

	// check highlight marker to get id of corresponding description
	// [works as changing language or metric does not remove the highlight marker!]	
	var selected_description = null;
	if( OSRM.G.markers.highlight.isShown() )
		selected_description = OSRM.G.markers.highlight.description;
		
	// create route description
	var positions = OSRM.G.route.getPositions();
	var body = "";
	body += '<table class="description data-list element-hover medium-font">';
	for(var i=0; i < response.route_instructions.length; i++){
		//odd or even ?
		var rowstyle='description-body-odd';
		if(i%2==0) { rowstyle='description-body-even'; }

		body += '<tr class="'+rowstyle+'">';
		
		body += '<td class="description-body-directions">';
		body += '<img class="description-body-direction" src="'+ OSRM.RoutingDescription._getDrivingInstructionIcon(response.route_instructions[i][0]) + '" alt=""/>';		
		body += '</td>';
		
		body += '<td class="description-body-items">';
		var pos = positions[response.route_instructions[i][3]];
		body += '<div id="description-'+i+'" class="description-body-item '+(selected_description==i ? "description-body-item-selected": "")+'" ' +
			'onclick="OSRM.RoutingDescription.onClickRouteDescription('+pos.lat.toFixed(pr)+","+pos.lng.toFixed(pr)+","+i+')" ' +
			'onmouseover="OSRM.RoutingDescription.onMouseOverRouteDescription('+pos.lat.toFixed(pr)+","+pos.lng.toFixed(pr)+')" ' +
			'onmouseout="OSRM.RoutingDescription.onMouseOutRouteDescription('+pos.lat.toFixed(pr)+","+pos.lng.toFixed(pr)+')">';

		// build route description
		if( response.route_instructions[i][1] != "" )
			body += OSRM.loc(OSRM.RoutingDescription._getDrivingInstruction(response.route_instructions[i][0])).replace(/\[(.*)\]/,"$1").replace(/%s/, OSRM.RoutingDescription._getStreetName(response.route_instructions[i][1]) ).replace(/%d/, OSRM.loc(response.route_instructions[i][6]));
		else
			body += OSRM.loc(OSRM.RoutingDescription._getDrivingInstruction(response.route_instructions[i][0])).replace(/\[(.*)\]/,"").replace(/%d/, OSRM.loc(response.route_instructions[i][6]));

		body += '</div>';
		body += "</td>";
		
		body += '<td class="description-body-distance">';
		if( i != response.route_instructions.length-1 )
		body += '<b>'+OSRM.Utils.toHumanDistance(response.route_instructions[i][2])+'</b>';
		body += "</td>";
		
		body += "</tr>";
	}	
	body += '</table>';
	
	// create route name
    var route_name = "";
    var route_name_src = "";
    for(var j=0, sizej=response.route_name.length; j<sizej; j++) {
        route_name += ( j>0 && response.route_name[j] != "" && response.route_name[j-1] != "" ? " - " : "") + "<span style='white-space:nowrap;'>" + OSRM.RoutingDescription._getStreetName(response.route_name[j]) + "</span>";
        route_name_src += ( j>0 && response.route_name[j] != "" && response.route_name[j-1] != "" ? " - " : "") + OSRM.RoutingDescription._getStreetName(response.route_name[j]);
    }
    Gis.EventBus.fire('route-name-changed', {name: route_name_src});
    route_name = "(" + route_name + ")";
	
	// build header
	header = OSRM.RoutingDescription._buildHeader(OSRM.Utils.toHumanDistance(response.route_summary.total_distance), OSRM.Utils.toHumanTime(response.route_summary.total_time), route_name);
	
	// check if route_name causes a line break -> information-box height has to be reduced
	var tempDiv = document.createElement('tempDiv');
	document.body.appendChild(tempDiv);
	tempDiv.className = "base-font absolute-hidden";
	tempDiv.innerHTML = route_name;
	var width = tempDiv.clientWidth;
	var max_width = 370;					// 370 = information-box.width - header-subtitle.margin-left	
	document.body.removeChild(tempDiv);

	// update DOM
	document.getElementById('information-box').className = (width > max_width ? 'information-box-with-larger-header' : 'information-box-with-large-header');
	document.getElementById('information-box-header').innerHTML = header;
	document.getElementById('information-box').innerHTML = body;
	
	// add alternative GUI (has to be done last since DOM has to be updated before events are registered)
	OSRM.RoutingAlternatives.show();
    Gis.EventBus.fire('route-changed');
},

// simple description
showSimple: function(response) {
	// build header
	header = OSRM.RoutingDescription._buildHeader(OSRM.Utils.toHumanDistance(response.route_summary.total_distance), OSRM.Utils.toHumanTime(response.route_summary.total_time), "", "");

	// update DOM
	document.getElementById('information-box').className = 'information-box-with-normal-header';	
	document.getElementById('information-box-header').innerHTML = header;
	document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+OSRM.loc("YOUR_ROUTE_IS_BEING_COMPUTED")+"</div>";
    Gis.EventBus.fire('route-changed');
},

// no description
showNA: function( display_text ) {
	// activate GUI features that need a route
	OSRM.GUI.activateRouteFeatures();
	
	// compute query string
	var query_string = '?hl=' + OSRM.Localization.current_language;
	var pr = OSRM.C.PRECISION;
	for(var i=0; i<OSRM.G.markers.route.length; i++)
		query_string += '&loc=' + OSRM.G.markers.route[i].getLat().toFixed(pr) + ',' + OSRM.G.markers.route[i].getLng().toFixed(pr); 
 						
	// build header
	header = OSRM.RoutingDescription._buildHeader("N/A", "N/A", "");

	// update DOM
	document.getElementById('information-box').className = 'information-box-with-normal-header';	
	document.getElementById('information-box-header').innerHTML = header;
	document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+display_text+"</div>";
    Gis.EventBus.fire('route-changed');
},

// build header
_buildHeader: function(distance, duration, route_name) {
	var temp = 
		'<div class="header-title">' + OSRM.loc("ROUTE_DESCRIPTION") + (route_name ? '<br/><div class="header-subtitle">' + route_name + '</div>' : '') + '</div>' +
		
		'<div class="full">' +
		'<div class="row">' +

		'<div class="left">' +
		'<div class="full">' +
		'<div class="row">' +
		'<div class="left header-label nowrap">' + OSRM.loc("DISTANCE")+":" + '</div>' +
		'<div class="left header-content stretch">' + distance + '</div>' +
		'</div>' +
		'<div class="row">' +
		'<div class="left header-label nowrap">' + OSRM.loc("DURATION")+":" + '</div>' +
		'<div class="left header-content stretch">' + duration + '</div>' +
		'</div>' +
		'</div>' +
		'</div>' +

		'</div>' +
		'</div>' +		
		
		'</div>';
	return temp;
},

// retrieve driving instruction icon from instruction id
_getDrivingInstructionIcon: function(server_instruction_id) {
	var local_icon_id = "direction_";
	server_instruction_id = server_instruction_id.replace(/^11-\d{1,}$/,"11");		// dumb check, if there is a roundabout (all have the same icon)
	local_icon_id += server_instruction_id;
	
	if( OSRM.G.images[local_icon_id] )
		return OSRM.G.images[local_icon_id].getAttribute("src");
	else
		return OSRM.G.images["direction_0"].getAttribute("src");
},

// retrieve driving instructions from instruction ids
_getDrivingInstruction: function(server_instruction_id) {
	var local_instruction_id = "DIRECTION_";
	server_instruction_id = server_instruction_id.replace(/^11-\d{2,}$/,"11-x");	// dumb check, if there are 10+ exits on a roundabout (say the same for exit 10+)
	local_instruction_id += server_instruction_id;
	
	var description = OSRM.loc( local_instruction_id );
	if( description == local_instruction_id)
		return OSRM.loc("DIRECTION_0");
	return description;
},

// retrieve street name
_getStreetName: function(street) {
	var name = street.match(/\{highway:(.*)\}/);
	if( name )
		name = OSRM.loc('HIGHWAY_'+name[1].toUpperCase(), 'HIGHWAY_DEFAULT');
	else
		name = street;
	return name;
}

};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routing geometry
// [renders routing geometry]

OSRM.CONSTANTS.PRECISION = 6;

OSRM.RoutingGeometry = {

// show route geometry - if there is a route
show: function(response, route) {
	var geometry = OSRM.RoutingGeometry._decode(response.route_geometry, OSRM.C.PRECISION );
    route = route || OSRM.G.route;
    route.showRoute(geometry, OSRM.Route.ROUTE);
},

//show route geometry - if there is no route
showNA: function() {
	var positions = [];
	for(var i=0, size=OSRM.G.markers.route.length; i<size; i++)
		positions.push( OSRM.G.markers.route[i].getPosition() );

	OSRM.G.route.showRoute(positions, OSRM.Route.NOROUTE);
},

//decode compressed route geometry
_decode: function(encoded, precision) {
	precision = Math.pow(10, -precision);
	var len = encoded.length, index=0, lat=0, lng = 0, array = [];
	while (index < len) {
		var b, shift = 0, result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lat += dlat;
		shift = 0;
		result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);
		var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lng += dlng;
		//array.push( {lat: lat * precision, lng: lng * precision} );
		array.push( [lat * precision, lng * precision] );
	}
	return array;
}

};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM RoutingGUI
// [handles all GUI events that interact with routing in main window]


OSRM.GUI.extend( {
		
// init
init: function() {
	// init variables
	OSRM.GUI.setDistanceFormat(OSRM.DEFAULTS.DISTANCE_FORMAT);
	
	// init events
	document.getElementById("gui-input-source").onchange = function() {OSRM.GUI.inputChanged(OSRM.C.SOURCE_LABEL);};
//	document.getElementById("gui-delete-source").onclick = function() {OSRM.GUI.deleteMarker(OSRM.C.SOURCE_LABEL);};
	document.getElementById("gui-search-source").onclick = function() {OSRM.GUI.showMarker(OSRM.C.SOURCE_LABEL);};	
	
	document.getElementById("gui-input-target").onchange = function() {OSRM.GUI.inputChanged(OSRM.C.TARGET_LABEL);};
//	document.getElementById("gui-delete-target").onclick = function() {OSRM.GUI.deleteMarker(OSRM.C.TARGET_LABEL);};
	document.getElementById("gui-search-target").onclick = function() {OSRM.GUI.showMarker(OSRM.C.TARGET_LABEL);};
	
//	document.getElementById("gui-reset").onclick = OSRM.GUI.resetRouting;
	document.getElementById("gui-reverse").onclick = OSRM.GUI.reverseRouting;
},

// toggle GUI features that need a route to work
activateRouteFeatures: function() {
	OSRM.G.active_shortlink = null;							// delete shortlink when new route is shown (RoutingDescription calls this method!)
},
deactivateRouteFeatures: function() {
	OSRM.G.active_shortlink = null;							// delete shortlink when the route is hidden
},

// click: button "reset"
resetRouting: function() {
	document.getElementById('gui-input-source').value = "";
	document.getElementById('gui-input-target').value = "";
	
	OSRM.G.route.reset();
	OSRM.G.markers.reset();
	
	OSRM.GUI.clearResults();
	
	OSRM.JSONP.reset();	
},
hideRouting: function() {
    if (OSRM.G.route) {
        OSRM.G.route.hide();
    }
    if (OSRM.G.markers) {
        OSRM.G.markers.hide();
    }
},
showRouting: function() {
    if (OSRM.G.route) {
        OSRM.G.route.show();
    }
    if (OSRM.G.markers) {
        OSRM.G.markers.show();
    }
},

// click: button "reverse"
reverseRouting: function() {
	// invert input boxes
	var tmp = document.getElementById("gui-input-source").value;
	document.getElementById("gui-input-source").value = document.getElementById("gui-input-target").value;
	document.getElementById("gui-input-target").value = tmp;
	
	// recompute route if needed
	if( OSRM.G.route.isShown() ) {
		OSRM.G.markers.route.reverse();
		OSRM.Routing.getRoute_Reversed();				// temporary route reversal for query, actual reversal done after receiving response
		OSRM.G.markers.route.reverse();
		OSRM.G.markers.highlight.hide();
		OSRM.RoutingDescription.showSimple( OSRM.G.response );
	
	// simply reverse markers		
	} else {
		OSRM.G.markers.reverseMarkers();		
	}
	
	// reverse description labels
	OSRM.G.markers.reverseDescriptions();
},

// click: button "show"
showMarker: function(marker_id) {
	if( OSRM.JSONP.fences["geocoder_source"] || OSRM.JSONP.fences["geocoder_target"] )	// needed when focus was on input box and user clicked on button
		return;
	
	if( marker_id == OSRM.C.SOURCE_LABEL && OSRM.G.markers.hasSource() )
		OSRM.G.markers.route[0].centerView();
	else if( marker_id == OSRM.C.TARGET_LABEL && OSRM.G.markers.hasTarget() )
		OSRM.G.markers.route[OSRM.G.markers.route.length-1].centerView();
},

// changed: any inputbox (is called when enter is pressed [after] or focus is lost [before])
inputChanged: function(marker_id) {
	if( marker_id == OSRM.C.SOURCE_LABEL)	
		OSRM.Geocoder.call(OSRM.C.SOURCE_LABEL, document.getElementById('gui-input-source').value);
	else if( marker_id == OSRM.C.TARGET_LABEL)
		OSRM.Geocoder.call(OSRM.C.TARGET_LABEL, document.getElementById('gui-input-target').value);
},

//click: button "open JOSM"
openJOSM: function() {
	var zoom = OSRM.G.map.getZoom();
	if( zoom < OSRM.DEFAULTS.JOSM_MIN_ZOOM_LEVEL ) {
		window.alert( OSRM.loc("OPEN_JOSM_FAILED") );
	} else {	
		var center = OSRM.G.map.getCenterUI();
		var bounds = OSRM.G.map.getBoundsUI();
		
		var xdelta = Math.min(0.02, Math.abs(bounds.getSouthWest().lng - center.lng) );
		var ydelta = Math.min(0.01, Math.abs(bounds.getSouthWest().lat - center.lat) );
		
		var p = [ 'left='  + (center.lng - xdelta).toFixed(6), 'bottom=' + (center.lat - ydelta).toFixed(6), 'right=' + (center.lng + xdelta).toFixed(6), 'top=' + (center.lat + ydelta).toFixed(6)];
		var url = 'http://127.0.0.1:8111/load_and_zoom?' + p.join('&');
	 
		var frame = document.getElementById('josm-frame');
		if(!frame) {
			frame = L.DomUtil.create('iframe', null, document.body);
			frame.style.display = "none";
			frame.id = 'josm-frame';
		}
		frame.src = url;
	}
},

// click: button "Editor"
openEditor: function() {
	var zoom = OSRM.G.map.getZoom();
	if( zoom < OSRM.DEFAULTS.EDITOR_MIN_ZOOM_LEVEL ) {
		window.alert( OSRM.loc("OPEN_EDITOR_FAILED") );
	} else {
		var position = OSRM.G.map.getCenterUI();
		var pr = OSRM.C.PRECISION;
		window.open( "http://www.openstreetmap.org/edit?lat="+position.lat.toFixed(pr)+"&lon="+position.lng.toFixed(pr)+"&zoom="+zoom );
	}	
},

//click: button "open OSM Bugs"
openOSMBugs: function() {
	var zoom = OSRM.G.map.getZoom();
	if( zoom < OSRM.DEFAULTS.NOTES_MIN_ZOOM_LEVEL ) {
		window.alert( OSRM.loc("OPEN_OSMBUGS_FAILED") );
	} else {
		var position = OSRM.G.map.getCenterUI();
		var pr = OSRM.C.PRECISION;
		window.open( "http://www.openstreetmap.org/?lat="+position.lat.toFixed(pr)+"&lon="+position.lng.toFixed(pr)+"&zoom="+zoom+"&notes=yes" );
	}
},

//click: button "delete marker"
deleteMarker: function(marker_id) {
	var id = null;
	if(marker_id == 'source' && OSRM.G.markers.hasSource() )
		id = 0;
	else if(marker_id == 'target' && OSRM.G.markers.hasTarget() )
		id = OSRM.G.markers.route.length-1;
	if( id == null)
		return;
	
	OSRM.G.markers.removeMarker( id );
	OSRM.Routing.getRoute();
	OSRM.G.markers.highlight.hide();	
},

//click: checkbox "show previous routes"
showPreviousRoutes: function(value) {
	if( document.getElementById('option-show-previous-routes').checked == false)
		OSRM.G.route.deactivateHistoryRoutes();
	else
		OSRM.G.route.activateHistoryRoutes();
},

//click: button "zoom on route"
zoomOnRoute: function() {
	if( OSRM.G.route.isShown() == false )
		return;
	
	var bounds = new L.LatLngBounds( OSRM.G.route._current_route.getPositions() );
	OSRM.G.map.fitBoundsUI(bounds);	
},

//click: button "zoom on user"
zoomOnUser: function() {
	if (navigator.geolocation) 
		navigator.geolocation.getCurrentPosition(OSRM.Map.geolocationResponse);	
},

//click: toggle highlighting unnamed streets
hightlightNonames: function() {
	OSRM.Routing.getRoute_Redraw({keepAlternative:true});
}

});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM RoutingEngineGUI
// [handles all GUI aspects that deals with switching the routing engine]


OSRM.GUI.extend( {
		
// init
init: function() {
	// gather routing engines
	var options = OSRM.GUI.getRoutingEngines();

	// generate selectors
	OSRM.GUI.selectorInit("gui-engine-toggle", options, OSRM.DEFAULTS.ROUTING_ENGINE, OSRM.GUI._onRoutingEngineChanged);		
},

// change active routing engine
setRoutingEngine: function(engine) {
	if( engine == OSRM.G.active_routing_engine )
		return;
	
	OSRM.GUI.selectorChange( 'gui-engine-toggle', engine );
	
	OSRM.G.active_routing_engine = engine;
	OSRM.G.active_routing_metric = OSRM.DEFAULTS.ROUTING_ENGINES[ OSRM.G.active_routing_engine ].metric;
	OSRM.G.active_routing_server_url = Gis.config(Gis.GEO_ROUTING_URL, OSRM.DEFAULTS.ROUTING_ENGINES[ OSRM.G.active_routing_engine ].url);
	OSRM.G.active_routing_timestamp_url = Gis.config(Gis.GEO_TIMESTAMP_URL, OSRM.DEFAULTS.ROUTING_ENGINES[ OSRM.G.active_routing_engine ].timestamp);
	
	// requery data timestamp
	OSRM.GUI.queryDataTimestamp();
},
_onRoutingEngineChanged: function(engine) {
	if( engine == OSRM.G.active_routing_engine )
		return;
	
	OSRM.GUI.setRoutingEngine( engine );
	
	// requery route
	if( OSRM.G.markers.route.length > 1 )
		OSRM.Routing.getRoute();
},

// change language of routing engine entries
setRoutingEnginesLanguage: function() {
	// gather routing engines
	var options = OSRM.GUI.getRoutingEngines();
	
	// change dropdown menu names
	OSRM.GUI.selectorRenameOptions( "gui-engine-toggle", options );
},

// gather routing engines
getRoutingEngines: function() {
	var engines = OSRM.DEFAULTS.ROUTING_ENGINES;
	var options = [];
	for(var i=0, size=engines.length; i<size; i++) {
		options.push( {display:OSRM.loc(engines[i].label), value:i} );
	}
	
	return options;
}

});

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM routing
// [renders route segments that are unnamed streets]


OSRM.RoutingNoNames = {
		
// displays route segments that are unnamed streets
show: function(response) {
	// do not display unnamed streets?
	if( true) {
		OSRM.G.route.hideUnnamedRoute();
		return;
	}
		
	// mark geometry positions where unnamed/named streets switch
	var named = [];
	for (var i = 0; i < response.route_instructions.length; i++) {
		if( response.route_instructions[i][1] == '' )
			named[ response.route_instructions[i][3] ] = false;		// no street name
		else
			named[ response.route_instructions[i][3] ] = true;		// yes street name
	}

	// aggregate geometry for unnamed streets
	var geometry = OSRM.RoutingGeometry._decode(response.route_geometry, OSRM.C.PRECISION);
	var is_named = true;
	var current_positions = [];
	var all_positions = [];
	for( var i=0; i < geometry.length; i++) {
		current_positions.push( geometry[i] );

		// still named/unnamed?
		if( (named[i] == is_named || named[i] == undefined) && i != geometry.length-1 )
			continue;

		// switch between named/unnamed!
		if(is_named == false)
			all_positions.push( current_positions );
		current_positions = [];
		current_positions.push( geometry[i] );
		is_named = named[i];
	}
	
	// display unnamed streets
	OSRM.G.route.showUnnamedRoute(all_positions);
},

showNA: function() {
	OSRM.G.route.hideUnnamedRoute();	
}
};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM via marker routines
// [find correct position for a via marker]


OSRM.Via = {
		
// find route segment of current route geometry that is closest to the new via node (marked by index of its endpoint)
_findNearestRouteSegment: function( new_via ) {
	var min_dist = Number.MAX_VALUE;
	var min_index = undefined;

	var p = OSRM.G.map.latLngToLayerPoint( new_via );
	var positions = OSRM.G.route.getPoints();
	for(var i=1; i<positions.length; i++) {
		var _sqDist = L.LineUtil._sqClosestPointOnSegment(p, positions[i-1], positions[i], true);
		if( _sqDist < min_dist) {
			min_dist = _sqDist;
			min_index = i;
		}
	}

	return min_index;
},


// find the correct index among all via nodes to insert the new via node, and insert it  
findViaIndex: function( new_via_position ) {
	// find route segment that is closest to click position (marked by last index)
	var nearest_index = OSRM.Via._findNearestRouteSegment( new_via_position );

	// find correct index to insert new via node
	var via_points = OSRM.G.response.via_points;
	var new_via_index = via_points.length-2;
	var via_index = Array();
	for(var i=1; i<via_points.length-1; i++) {
		via_index[i-1] = OSRM.Via._findNearestRouteSegment( new L.LatLng(via_points[i][0], via_points[i][1]) );
		if(via_index[i-1] > nearest_index) {
			new_via_index = i-1;
			break;
		}
	}

	// add via node
	return new_via_index;
},


//function that draws a drag marker
dragTimer: new Date(),

drawDragMarker: function(event) {
	if( OSRM.G.route.isShown() == false)
		return;
	if( OSRM.G.dragging == true )
		return;
	
	// throttle computation
	if( (new Date() - OSRM.Via.dragTimer) < 25 )
		return;
	OSRM.Via.dragTimer = new Date();
	
	// get distance to route
	var minpoint = OSRM.G.route._current_route.route.closestLayerPoint( event.layerPoint );
	var min_dist = minpoint ? minpoint.distance : 1000;
	
	// get distance to markers
	var mouse = event.latlng;
	for(var i=0, size=OSRM.G.markers.route.length; i<size; i++) {
		if(OSRM.G.markers.route[i].label=='drag')
			continue;
		var position = OSRM.G.markers.route[i].getPosition();
		var dist = OSRM.G.map.project(mouse).distanceTo(OSRM.G.map.project(position));
		if( dist < 20 )
			min_dist = 1000;
	}
	
	// check whether mouse is over another marker
	var pos = OSRM.G.map.layerPointToContainerPoint(event.layerPoint);
	var obj = document.elementFromPoint(pos.x,pos.y);
	for(var i=0, size=OSRM.G.markers.route.length; i<size; i++) {
		if(OSRM.G.markers.route[i].label=='drag')
			continue;
		if( obj == OSRM.G.markers.route[i].marker._icon)
			min_dist = 1000;
	}
	
	// special care for highlight marker
	if( OSRM.G.markers.highlight.isShown() ) {
		if( OSRM.G.map.project(mouse).distanceTo(OSRM.G.map.project( OSRM.G.markers.highlight.getPosition() ) ) < 20 )
			min_dist = 1000;
		else if( obj == OSRM.G.markers.highlight.marker._icon)
			min_dist = 1000;
	}
	
	if( min_dist < 20) {
		OSRM.G.markers.dragger.setPosition( OSRM.G.map.layerPointToLatLng(minpoint) );
		OSRM.G.markers.dragger.show();
	} else
		OSRM.G.markers.dragger.hide();
}

};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM geocoding routines
// [geocoder query, management and display of geocoder results]

// some constants
OSRM.CONSTANTS.SOURCE_LABEL = "source";
OSRM.CONSTANTS.TARGET_LABEL = "target";
OSRM.CONSTANTS.VIA_LABEL = "via";
OSRM.CONSTANTS.DO_FALLBACK_TO_LAT_LNG = true;


OSRM.Geocoder = {

//[normal geocoding]

// process input request and call geocoder if needed
call: function(marker_id, query) {
	if(query=="")
		return;
	
	// geo coordinates given -> directly draw results
	if(query.match(/^\s*[-+]?[0-9]*\.?[0-9]+\s*[,;]\s*[-+]?[0-9]*\.?[0-9]+\s*$/)){
		var coord = query.split(/[,;]/);
		OSRM.Geocoder._onclickResult(marker_id, coord[0], coord[1]);
		OSRM.Geocoder.updateAddress( marker_id );
		return;
	}
	
	// build basic request for geocoder
	var call = Gis.config(Gis.GEO_FORWARD_SEARCH_URL, OSRM.DEFAULTS.HOST_GEOCODER_URL) + "?format=json&json_callback=%jsonp" + OSRM.DEFAULTS.GEOCODER_BOUNDS + "&accept-language="+OSRM.Localization.current_language+"&limit=30&q=" + query;
	// prioritize results in currently shown mapview
	var bounds = OSRM.G.map.getBounds();
	call += "&viewbox=" + bounds._southWest.lng + "," + bounds._northEast.lat + "," + bounds._northEast.lng + "," + bounds._southWest.lat;
	OSRM.JSONP.call( call, OSRM.Geocoder._showResults, OSRM.Geocoder._showResults_Timeout, OSRM.DEFAULTS.JSONP_TIMEOUT, "geocoder_"+marker_id, {marker_id:marker_id,query:query} );
},


// helper function for clicks on geocoder search results
_onclickResult: function(marker_id, lat, lon, zoom) {
	var index;
	if( marker_id == OSRM.C.SOURCE_LABEL )
		index = OSRM.G.markers.setSource( new L.LatLng(lat, lon) );
	else if( marker_id == OSRM.C.TARGET_LABEL )
		index = OSRM.G.markers.setTarget( new L.LatLng(lat, lon) );
	else
		return;
	
	OSRM.G.markers.route[index].show();
	OSRM.G.markers.route[index].centerView(zoom);	
	if( OSRM.G.markers.route.length > 1 )
		OSRM.Routing.getRoute();
},


// process geocoder response
_showResults: function(response, parameters) {
	if(!response){
		OSRM.Geocoder._showResults_Empty(parameters);
		return;
	}
	if(response.length == 0) {
		OSRM.Geocoder._showResults_Empty(parameters);
		return;
	}	
	
//	// filter/sort inputs
//	var filtered_response_temp = [];									// filter results
//	for(var i=0, iEnd=response.length; i < iEnd; i++){
//		var result = response[i];
//		if( OSRM.Geocoder._filterResult( result ) )
//			continue;
//		filtered_response_temp.push( result );
//	}
//	if(filtered_response_temp.length == 0) {							// stop if no results remain
//		OSRM.Geocoder._showResults_Empty(parameters);
//		return;
//	}
//	filtered_response_temp.sort( OSRM.Geocoder._compareResults );		// rank results
//	filtered_response_temp.sort( OSRM.Geocoder._compareLocations );		// remove duplicate locations (stable sort -> retain highest ranked; but sorts all results of one category by location -> bad)
//	var filtered_response = [];
//	filtered_response.push( filtered_response_temp[0] );
//	for(var i=1, iEnd = filtered_response_temp.length; i<iEnd; i++) {
//		var prev_result = filtered_response_temp[i-1];
//		var result = filtered_response_temp[i];
//		if( result.lat != prev_result.lat || result.lon != prev_result.lon ) {
//			filtered_response.push( result );
//		}
//	}
//	filtered_response.sort( OSRM.Geocoder._compareResults );			// rank results again
	
	var filtered_response = response;
	
	// show first result
	var zoom = null;
	if( filtered_response[0].boundingbox != null )
		zoom = OSRM.G.map.getBoundsZoom( [ [filtered_response[0].boundingbox[0], filtered_response[0].boundingbox[2]], [filtered_response[0].boundingbox[1], filtered_response[0].boundingbox[3]]], true );
	OSRM.Geocoder._onclickResult(parameters.marker_id, filtered_response[0].lat, filtered_response[0].lon, zoom);
	if( OSRM.G.markers.route.length > 1 )		// if a route is displayed, we don't need to show other possible geocoding results
		return;	
	
	// show possible results for input
	var html = "";
	html += '<table class="results medium-font">';	
	for(var i=0; i < filtered_response.length; i++){
		var result = filtered_response[i];
		
		//odd or even ?
		var rowstyle='results-body-odd';
		if(i%2==0) { rowstyle='results-body-even'; }
 
		html += '<tr class="'+rowstyle+'">';
		if(!result.icon)
			result.icon = "http://nominatim.openstreetmap.org/images/mapicons/poi_point_of_interest.glow.12.png";
		html += '<td class="results-body-counter"><img src="'+ result.icon + '" alt=""/></td>';
		html += '<td class="results-body-items">';

		if(result.display_name){
			var zoom = "null";
			if( result.boundingbox != null )
				zoom = OSRM.G.map.getBoundsZoom( [ [result.boundingbox[0], result.boundingbox[2]], [result.boundingbox[1], result.boundingbox[3]]], true );
			
			html += '<div class="results-body-item" onclick="OSRM.Geocoder._onclickResult(\''+parameters.marker_id+'\', '+result.lat+', '+result.lon+', '+zoom+');">'+result.display_name;
			// debug output to show osm_type, class, type			
			// html += '<br/><span class="results-body-item-remark small-font">[osm_type: ' + result.osm_type + ', class: ' + result.class + ', type: ' + result.type + ']</span>';
			html += '</div>';
		}
		html += "</td></tr>";
	}
	html += '</table>';
		
	document.getElementById('information-box-header').innerHTML = 
		"<div class='header-title'>"+OSRM.loc("SEARCH_RESULTS")+"</div>" +
		"<div class='header-content'>("+OSRM.loc("FOUND_X_RESULTS").replace(/%i/,filtered_response.length)+")</div>";
		"<div class='header-content'>(found "+filtered_response.length+" results)"+"</div>";
	document.getElementById('information-box').className = 'information-box-with-normal-header';
	document.getElementById('information-box').innerHTML = html;
    Gis.EventBus.fire('route-changed');
},
_showResults_Empty: function(parameters) {
	document.getElementById('information-box-header').innerHTML =
		"<div class='header-title'>"+OSRM.loc("SEARCH_RESULTS")+"</div>" +
		"<div class='header-content'>("+OSRM.loc("FOUND_X_RESULTS").replace(/%i/,0)+")</div>";
	document.getElementById('information-box').className = 'information-box-with-normal-header';
	if(parameters.marker_id == OSRM.C.SOURCE_LABEL)
		document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+OSRM.loc("NO_RESULTS_FOUND_SOURCE")+": "+parameters.query +"</div>";
	else if(parameters.marker_id == OSRM.C.TARGET_LABEL)
		document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+OSRM.loc("NO_RESULTS_FOUND_TARGET")+": "+parameters.query +"</div>";
	else
		document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+OSRM.loc("NO_RESULTS_FOUND")+": "+parameters.query +"</div>";
    Gis.EventBus.fire('route-changed');
},
_showResults_Timeout: function() {
	document.getElementById('information-box-header').innerHTML =
		"<div class='header-title'>"+OSRM.loc("SEARCH_RESULTS")+"</div>" +
		"<div class='header-content'>("+OSRM.loc("FOUND_X_RESULTS").replace(/%i/,0)+")</div>";
	document.getElementById('information-box').className = 'information-box-with-normal-header';
	document.getElementById('information-box').innerHTML = "<div class='no-results big-font'>"+OSRM.loc("TIMED_OUT")+"</div>";
    Gis.EventBus.fire('route-changed');
},


//// filter search results [true: result will not be displayed]
//_filterResult: function(result) {
////	if( result.osm_type == "relation")
////		return true;
//	if( result.type == "aerial_views")
//		return true;	
//	return false;
//},
//
//
//// comparator for sorting results [higher weight: result will appear first]
//_compare_class_weights: {
//	boundary: 9000,	
//	place: 8000,
//	highway: 7000,
//}, 
//_compare_type_weights: {
//	country: 13,
//	state: 12,
//	county: 11,
//	city: 10, 
//	town: 9,
//	village: 8,
//	hamlet: 7,
//	suburb: 6,
//	locality: 5,
//	farm: 4
//},
//_compareResults: function(lhs, rhs) {
//	var class_values = OSRM.Geocoder._compare_class_weights;
//	var type_values = OSRM.Geocoder._compare_type_weights;
//	
//	var lhs_value = (-class_values[ lhs["class"] ] || 0) + (-type_values[ lhs.type ] || 0);
//	var rhs_value = (-class_values[ rhs["class"] ] || 0) + (-type_values[ rhs.type ] || 0);
//
//	return (lhs_value - rhs_value);
//},
//
//
//// comparator for sorting objects according to their locations
//_compareLocations: function(lhs, rhs) {
//	if( lhs.lat != rhs.lat )
//		return lhs.lat < rhs.lat;
//	else
//		return lhs.lon < rhs.lon;
//},


// [reverse geocoding]

//update geo coordinates in input boxes
updateLocation: function(marker_id) {
	var pr = OSRM.C.PRECISION;
	if (marker_id == OSRM.C.SOURCE_LABEL && OSRM.G.markers.hasSource()) {
		document.getElementById("gui-input-source").value = OSRM.G.markers.route[0].getLat().toFixed(pr) + ", " + OSRM.G.markers.route[0].getLng().toFixed(pr);
	} else if (marker_id == OSRM.C.TARGET_LABEL && OSRM.G.markers.hasTarget()) {
		document.getElementById("gui-input-target").value = OSRM.G.markers.route[OSRM.G.markers.route.length-1].getLat().toFixed(pr) + ", " + OSRM.G.markers.route[OSRM.G.markers.route.length-1].getLng().toFixed(pr);		
	}
},


// update address in input boxes
updateAddress: function(marker_id, do_fallback_to_lat_lng) {
	// build request for reverse geocoder
	var lat = null;
	var lng = null;
	var description = null;
	
	if(marker_id == OSRM.C.SOURCE_LABEL && OSRM.G.markers.hasSource()) {
		lat = OSRM.G.markers.route[0].getLat();
		lng = OSRM.G.markers.route[0].getLng();
		description = OSRM.G.markers.route[0].description;
	} else if(marker_id == OSRM.C.TARGET_LABEL && OSRM.G.markers.hasTarget() ) {
		lat = OSRM.G.markers.route[OSRM.G.markers.route.length-1].getLat();
		lng = OSRM.G.markers.route[OSRM.G.markers.route.length-1].getLng();
		description = OSRM.G.markers.route[OSRM.G.markers.route.length-1].description;
	} else
		return;

	// if a description is given show this and not the reverse geocoding information
	if( description != null ) {
		OSRM.Geocoder._showReverseResults( {address:{road:description} }, {marker_id:marker_id} );
		return;
	}
	var pr = OSRM.C.PRECISION;
	var call = Gis.config(Gis.GEO_REVERSE_SEARCH_URL, OSRM.DEFAULTS.HOST_REVERSE_GEOCODER_URL) + "?format=json&json_callback=%jsonp" + "&accept-language="+OSRM.Localization.current_language + "&lat=" + lat.toFixed(pr) + "&lon=" + lng.toFixed(pr);
	OSRM.JSONP.call( call, OSRM.Geocoder._showReverseResults, OSRM.Geocoder._showReverseResults_Timeout, OSRM.DEFAULTS.JSONP_TIMEOUT, "reverse_geocoder_"+marker_id, {marker_id:marker_id, do_fallback: do_fallback_to_lat_lng} );
},


// processing JSONP response of reverse geocoder
_showReverseResults: function(response, parameters) {
 	if(!response) {
 		OSRM.Geocoder._showReverseResults_Timeout(response, parameters);
		return;
	}
 	
	if(response.address == undefined) {
		OSRM.Geocoder._showReverseResults_Timeout(response, parameters);
		return;
	}

	// build reverse geocoding address
	var used_address_data = 0;
	var address = "";
	if( response.address.road) {
		address += response.address.road;
		used_address_data++;
	}
	if( response.address.city ) {
		if( used_address_data > 0 )
			address += ", ";
		address += response.address.city;
		used_address_data++;
	} else if( response.address.village ) {
		if( used_address_data > 0 )
			address += ", ";
		address += response.address.village;
		used_address_data++;
	}
	if( used_address_data < 2 && response.address.country ) {
		if( used_address_data > 0 )
			address += ", ";
		address += response.address.country;
		used_address_data++;
	}
	if( used_address_data == 0 ) {
		OSRM.Geocoder._showReverseResults_Timeout(response, parameters);
		return;
	}
		
	// add result to DOM
	if(parameters.marker_id == OSRM.C.SOURCE_LABEL && OSRM.G.markers.hasSource() )
		document.getElementById("gui-input-source").value = address;
	else if(parameters.marker_id == OSRM.C.TARGET_LABEL && OSRM.G.markers.hasTarget() )
		document.getElementById("gui-input-target").value = address;
},
_showReverseResults_Timeout: function(response, parameters) {
	if(!parameters.do_fallback)
		return;
		
	OSRM.Geocoder.updateLocation(parameters.marker_id);
},


// process geocoder response for initialization queries during URL parameter parsing
_showInitResults: function(response, parameters) {
	var data = OSRM.G.initial_positions;
	
	// process response
	data.done++;
	if(!response || response.length == 0)
		data.fail = true;
	else {
		data.positions[parameters.id] = new L.LatLng(response[0].lat, response[0].lon);
		if( data.zoom == null && response[0].boundingbox != null ) {
			data.zoom = OSRM.G.map.getBoundsZoom( [ [response[0].boundingbox[0], response[0].boundingbox[2]], [response[0].boundingbox[1], response[0].boundingbox[3]]], true );
		}
	}
	
	// all queries finished?
	if( data.done == data.positions.length ) {
		if( data.fail == true ) {
			OSRM.GUI.exclusiveNotify( OSRM.loc("NOTIFICATION_GEOCODERFAIL_HEADER"), OSRM.loc("NOTIFICATION_GEOCODERFAIL_BODY"), true );
			return;			
		} else {
			OSRM.GUI.exclusiveDenotify();
			OSRM.Geocoder[parameters.callback]();
		}
	}
},
_showInitResults_Destinations: function() {
	var data = OSRM.G.initial_positions;
	
	// setup markers
	var destinations = data.positions;
	var index = OSRM.G.markers.setTarget( destinations[destinations.length-1] );

	OSRM.G.markers.route[index].description = data.name;
	OSRM.Geocoder.updateAddress( OSRM.C.TARGET_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
	
	OSRM.G.markers.route[index].show();
	OSRM.G.markers.route[index].centerView( data.zoom );
	for(var i=0; i<destinations.length-1;i++)
		OSRM.G.markers.addInitialVia( destinations[i] );
	
	// finish
	OSRM.G.initial_position_override = true;
	return;
},
_showInitResults_Locations: function() {
	var data = OSRM.G.initial_positions;
	
	// draw via points
	var positions = data.positions;
	if( positions.length > 0 ) {
		OSRM.G.markers.setSource( positions[0] );
		OSRM.Geocoder.updateAddress( OSRM.C.SOURCE_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
	}
	if( positions.length > 1 ) {
		OSRM.G.markers.setTarget( positions[positions.length-1] );
		OSRM.Geocoder.updateAddress( OSRM.C.TARGET_LABEL, OSRM.C.DO_FALLBACK_TO_LAT_LNG );
	}
	for(var i=1; i<positions.length-1;i++)
		OSRM.G.markers.setVia( i-1, positions[i] );
	for(var i=0; i<OSRM.G.markers.route.length;i++)
		OSRM.G.markers.route[i].show();
	
	// center on route (support for old links) / move to given view (new behaviour)
	if( data.zoom == null || data.center == null ) {
		var bounds = new L.LatLngBounds( positions );
		OSRM.G.map.fitBoundsUI( bounds );
	} else {
		OSRM.G.map.setView(data.center, data.zoom);
	}
	
	// set active alternative (if via points are set or alternative does not exists, fallback to shortest route)
	OSRM.G.active_alternative = data.active_alternative || 0;
	
	// compute route
	OSRM.Routing.getRoute({keepAlternative:true});
	OSRM.G.initial_position_override = true;
	return;	
}

};

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM CSS manipulator
// [edit css styles]

OSRM.CSS = {
	getStylesheet: function(filename, the_document) {
		the_document = the_document || document;
		var stylesheets = the_document.styleSheets;
		for(var i=0, size=stylesheets.length; i<size; i++) {
			if(stylesheets[i].href && stylesheets[i].href.indexOf(filename) >= 0)
				return stylesheets[i];
		}
		return null;
	},
	
	insert: function(stylesheet, selector, rule) {
		if( stylesheet.addRule ){
			stylesheet.addRule(selector, rule);
		} else if( stylesheet.insertRule ){
            stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
		}
	}		
};
/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM JSONP call wrapper 
// [wrapper for JSONP calls with DOM cleaning, fencing, timout handling]

OSRM.JSONP = {
		
	// storage to keep track of unfinished JSONP calls
	fences: {},
	callbacks: {},
	timeouts: {},
	timers: {},
	
	
	// default callback routines
	late: function() {},	
	empty: function() {},
	
	
	// init JSONP call
	call: function(source, callback_function, timeout_function, timeout, id, parameters) {
		// only one active JSONP call per id
		if (OSRM.JSONP.fences[id] == true)
			return false;
		OSRM.JSONP.fences[id] = true;
		
		// wrap timeout function
		OSRM.JSONP.timeouts[id] = function(response) {
			try {
				timeout_function(response, parameters);
			} finally {
				OSRM.JSONP.callbacks[id] = OSRM.JSONP.late;				// clean functions
				OSRM.JSONP.timeouts[id] = OSRM.JSONP.empty;
				OSRM.JSONP.fences[id] = undefined;						// clean fence
			}
		};
		
		// wrap callback function
		OSRM.JSONP.callbacks[id] = function(response) {
			clearTimeout(OSRM.JSONP.timers[id]);						// clear timeout timer
			OSRM.JSONP.timers[id] = undefined;
			
			try {
				callback_function(response, parameters);				// actual wrapped callback 
			} finally {
				OSRM.JSONP.callbacks[id] = OSRM.JSONP.empty;			// clean functions
				OSRM.JSONP.timeouts[id] = OSRM.JSONP.late;
				OSRM.JSONP.fences[id] = undefined;						// clean fence
			}
		};
		
		// clean DOM
		var jsonp = document.getElementById('jsonp_'+id);
		if(jsonp)
			jsonp.parentNode.removeChild(jsonp);
		
		// add script to DOM
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.id = 'jsonp_'+id;
		script.src = source.replace(/%jsonp/,"OSRM.JSONP.callbacks."+id);
		document.head.appendChild(script);
		
		// start timeout timer
		OSRM.JSONP.timers[id] = setTimeout(OSRM.JSONP.timeouts[id], timeout);
		return true;
	},
	
	clear: function(id) {
		clearTimeout(OSRM.JSONP.timers[id]);					// clear timeout timer
		OSRM.JSONP.callbacks[id] = OSRM.JSONP.empty;			// clean functions
		OSRM.JSONP.timeouts[id] = OSRM.JSONP.empty;
		OSRM.JSONP.fences[id] = undefined;						// clean fence
		
		// clean DOM
		var jsonp = document.getElementById('jsonp_'+id);
		if(jsonp)
			jsonp.parentNode.removeChild(jsonp);		
	},
	
	// reset all data
	reset: function() {
		OSRM.JSONP.fences = {};
		OSRM.JSONP.callbacks = {};
		OSRM.JSONP.timeouts = {};
		OSRM.JSONP.timers = {};
	}
};

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM localization
// [basic localization options]


OSRM.Localization = {

// default directory for localization files
DIRECTORY: "localization/",

// currently active language and fallback language (used if a string is not available in the current language)
current_language: OSRM.DEFAULTS.LANGUAGE,
fallback_language: "ru",

// language that is currently being loaded on demand  
load_on_demand_language: null,

//initialize localization
init: function() {
	var supported_languages = OSRM.DEFAULTS.LANGUAGE_SUPPORTED;
	
	// check browser language
	if( OSRM.DEFAULTS.LANGUAGE_USE_BROWSER_SETTING == true ) {
		
			var language_label = (navigator.language || navigator.userLanguage || "").substring(0,2);		
			for(var i=0; i<supported_languages.length; ++i) {
				if( supported_languages[i].encoding == language_label )
					OSRM.Localization.current_language = language_label;
			}
	}
		
	// fill option list and find default entry
	var options = [];
	var options_2 = [];
	var selected = 0;	
	for(var i=0, size=supported_languages.length; i<size; i++) {
		options.push( {display:supported_languages[i].encoding, value:supported_languages[i].encoding} );
		options_2.push( {display:supported_languages[i].name, value:supported_languages[i].encoding} );
		if( supported_languages[i].encoding == OSRM.Localization.current_language )
			selected=i;
	}

	// load language
	OSRM.Localization.setLanguage( OSRM.Localization.fallback_language );	
	OSRM.Localization.setLanguage( OSRM.Localization.current_language );
},
setLanguageWrapper: function(language) {		// wrapping required to correctly prevent localization tooltip from showing
	OSRM.Localization.setLanguage(language);
},
setLanguage: function(language, loaded_on_demand) {
	// check if loaded-on-demand language is still wanted as current language
	if( loaded_on_demand ) {
		// fix for racing condition when fallback language gets loaded after current language
		var fb_localization = OSRM.Localization[OSRM.Localization.fallback_language];
		if( fb_localization == null || fb_localization.loading != null )	// fallback language still loading
			return;
		var od_localization = OSRM.Localization[OSRM.Localization.load_on_demand_language];
		if( od_localization != null && od_localization.loading == null )	// on demand language has loaded
			language = OSRM.Localization.load_on_demand_language;
		
		if( language != OSRM.Localization.load_on_demand_language )
			return;
	}
	

	if( OSRM.Localization[language] ) {
		if( OSRM.Localization[language].loading )	// check if localization is currently being loaded
			return;
		OSRM.Localization.current_language = language;
		OSRM.Localization.load_on_demand_language = null;
		// change gui language		
		OSRM.GUI.setLabels();
		// change notifications
//		OSRM.GUI.updateNotifications();
		// change abbreviations
		OSRM.Utils.updateAbbreviationCache();
		// change map language
		for(var i=0, size=OSRM.G.localizable_maps.length; i<size; i++) {
			OSRM.G.localizable_maps[i].options.culture = OSRM.loc("CULTURE");
		}
		// change map layer languages
		// requery data
		if( OSRM.G.markers == null )
			return;
		if( OSRM.G.markers.route.length > 1)
			OSRM.Routing.getRoute({keepAlternative:true});
		else if(OSRM.G.markers.route.length > 0 && document.getElementById('information-box').innerHTML != "" ) {
			OSRM.Geocoder.call( OSRM.C.SOURCE_LABEL, document.getElementById("gui-input-source").value );
			OSRM.Geocoder.call( OSRM.C.TARGET_LABEL, document.getElementById("gui-input-target").value );
		} else {
			OSRM.Geocoder.updateAddress(OSRM.C.SOURCE_LABEL, false);
			OSRM.Geocoder.updateAddress(OSRM.C.TARGET_LABEL, false);
			OSRM.GUI.clearResults();
		}
	} else if(OSRM.DEFAULTS.LANUGAGE_ONDEMAND_RELOADING==true) {
		var supported_languages = OSRM.DEFAULTS.LANGUAGE_SUPPORTED;
		for(var i=0, size=supported_languages.length; i<size; i++) {
			if( supported_languages[i].encoding == language) {
				OSRM.Localization.load_on_demand_language = language;
				OSRM.Localization[language] = {loading:true};	// add dummy localization until localization is loaded
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = OSRM.Localization.DIRECTORY+"OSRM.Locale."+language+".js";
				document.head.appendChild(script);
				break;
			}
		}		
	}
},
		
// if existing, return localized string -> English string -> input string
// [if fallback given and localized, English strings not existent, localize and return fallback string]
translate: function(text, fallback) {
	if( OSRM.Localization[OSRM.Localization.current_language] && OSRM.Localization[OSRM.Localization.current_language][text] )
		return OSRM.Localization[OSRM.Localization.current_language][text];
	else if( OSRM.Localization[OSRM.Localization.fallback_language] && OSRM.Localization[OSRM.Localization.fallback_language][text] )
		return OSRM.Localization[OSRM.Localization.fallback_language][text];
	else if( fallback )
		return OSRM.loc( fallback );
	else	
		return text;
}
};

// shorter call to translate function
OSRM.loc = OSRM.Localization.translate;

/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM localization
// [English language support]


OSRM.Localization["ru"] = {
// own language
"CULTURE": "ru-RU",
"LANGUAGE": "Русский",
// gui
"GUI_START": "Начало",
"GUI_END": "Конец",
"GUI_RESET": "Сбросить",
"GUI_ZOOM_ON_ROUTE": "Показать маршрут",
"GUI_ZOOM_ON_USER": "Показать пользователя",
"GUI_SEARCH": "Показать",
"GUI_REVERSE": "Обратно",
"GUI_START_TOOLTIP": "Укажите начальную точку",
"GUI_END_TOOLTIP": "Укажите пункт назначения",
"GUI_MAIN_WINDOW": "Главное окно",
"GUI_ZOOM_IN": "Увеличить",
"GUI_ZOOM_OUT": "Масштаб",
// config
"GUI_CONFIGURATION": "Настройки",
"GUI_LANGUAGE": "Язык",
"GUI_UNITS": "Единицы",
"GUI_KILOMETERS": "Километры",
"GUI_MILES": "Мили",
// abbreviations
"GUI_M": "м",
"GUI_KM": "км",
"GUI_MI": "миль",
"GUI_FT": "футов",
"GUI_H": "ч",
"GUI_MIN": "мин",
"GUI_S": "с",
// mapping
"GUI_MAPPING_TOOLS": "Настройки карты",
"GUI_HIGHLIGHT_UNNAMED_ROADS": "Выделить безымянные улицы",
"GUI_SHOW_PREVIOUS_ROUTES": "Отображать предыдущий маршрут",
"GUI_EXTERNAL_TOOLS": "Внешние инструменты:",
"OPEN_EDITOR": "Редактор",
"OPEN_OSMBUGS": "Заметки",
"OPEN_JOSM_FAILED": "Приблизьте карту, чтобы открыть редактор OSM.",
"OPEN_OSMBUGS_FAILED": "Приблизьте карту, чтобы оставить заметку.",
// geocoder
"SEARCH_RESULTS": "Результаты поиска",
"FOUND_X_RESULTS": "найдено %i результатов",
"TIMED_OUT": "Превышен интервал ожидания",
"NO_RESULTS_FOUND": "Ничего не найдено",
"NO_RESULTS_FOUND_SOURCE": "Начальная точка не найдена",
"NO_RESULTS_FOUND_TARGET": "Пункт назначения не найден",
// routing
"ROUTE_DESCRIPTION": "Описание маршрута",
"GET_LINK_TO_ROUTE": "Постоянная ссылка",
"ROUTE_LINK": "Ссылка на маршрут",
"GENERATE_LINK_TO_ROUTE": "создание ссылки",
"LINK_TO_ROUTE_TIMEOUT": "недоступно",
"GPX_FILE": "GPX Файл",
"DISTANCE": "Расстояние",
"DURATION": "Время",
"YOUR_ROUTE_IS_BEING_COMPUTED": "Вычисление маршрута",
"NO_ROUTE_FOUND": "Маршрут не найден",
// printing
"OVERVIEW_MAP": "Обзорная карта",
"NO_ROUTE_SELECTED": "Маршрут не выбран",
// routing engines
"ENGINE_0": "Автомобиль",
// directions
"N": "север",
"E": "восток",
"S": "юг",
"W": "запад",
"NE": "северо-восток",
"SE": "юго-восток",
"SW": "юго-запад",
"NW": "северо-запад",
// driving directions
// %s: road name
// %d: direction
// [*]: will only be printed when there actually is a road name
"DIRECTION_0":"Неизвестная инструкция[ по <b>%s</b>]",
"DIRECTION_1":"Продолжайте движение[ по <b>%s</b>]",
"DIRECTION_2":"Примите вправо[ на <b>%s</b>]",
"DIRECTION_3":"Поверните направо[ на <b>%s</b>]",
"DIRECTION_4":"Поверните резко направо[ на <b>%s</b>]",
"DIRECTION_5":"U-образный разворот[ на <b>%s</b>]",
"DIRECTION_6":"Поверните резко налево[ на <b>%s</b>]",
"DIRECTION_7":"Поверните налево[ на <b>%s</b>]",
"DIRECTION_8":"Примите влево[ на <b>%s</b>]",
"DIRECTION_10":"Направляйтесь на <b>%d</b>[ по <b>%s</b>]",
"DIRECTION_11-1":"На кольцевой дороге выполните 1-ый съезд[ на <b>%s</b>]",
"DIRECTION_11-2":"На кольцевой дороге выполните 2-ой съезд[ на <b>%s</b>]",
"DIRECTION_11-3":"На кольцевой дороге выполните 3-ий съезд[ на <b>%s</b>]",
"DIRECTION_11-4":"На кольцевой дороге выполните 4-ый съезд[ на <b>%s</b>]",
"DIRECTION_11-5":"На кольцевой дороге выполните 5-ый съезд[ на <b>%s</b>]",
"DIRECTION_11-6":"На кольцевой дороге выполните 6-ой съезд[ на <b>%s</b>]",
"DIRECTION_11-7":"На кольцевой дороге выполните 7-ой съезд[ на <b>%s</b>]",
"DIRECTION_11-8":"На кольцевой дороге выполните 8-ой съезд[ на <b>%s</b>]",
"DIRECTION_11-9":"На кольцевой дороге выполните 9-ый съезд[ на <b>%s</b>]",
"DIRECTION_11-x":"На кольцевой дороге выполните съезд[ на <b>%s</b>]",
"DIRECTION_15":"Вы прибыли в пункт назначения",
// notifications
"NOTIFICATION_MAINTENANCE_HEADER":	"Плановое техническое обслуживание",
"NOTIFICATION_MAINTENANCE_BODY":	"Сайт OSRM остановлен для технического обслуживания." + 
									"Пожалуйста, подождите пока не будут установлены необходимые обновления. " +
									"В ближайшее время сайт снова заработает." +
									"<br/><br/>" + 
									"Пока вы можете прогуляться по знакомым окрестностям..." + 
									"<br/><br/><br/>[OSRM]",
"NOTIFICATION_LOCALIZATION_HEADER":	"Знаете ли вы? Вы можете сменить отображаемый язык.",
"NOTIFICATION_LOCALIZATION_BODY":	"Используйте выпадающее меню в левом верхнем углу чтобы выбрать предпочитаемый вами язык. " +
									"<br/><br/>" +
									"Не отчаивайтесь, если вы не можете выбрать свой язык. " +
									"Если захотите, вы можете помочь нам добавив свой новый перевод! " +
									"Заходите <a href='https://github.com/DennisSchiefer/Project-OSRM-Web'>сюда</a> за дополнительной информацией.",
"NOTIFICATION_CLICKING_HEADER":		"Знаете ли вы? Вы можете щёлкать мышью на карте, чтобы устанавливать метки.",
"NOTIFICATION_CLICKING_BODY":		"Вы можете щёлкнуть на карте левой кнопкой мыши чтобы установить зелёную метку начала маршрута или красную метку конца маршрута, " +
									"если начало маршрута уже определено. " +
									"Адрес указанного вами места отобразится слева. " + 
									"<br/><br/>" +
									"Вы можете удалить метку ещё раз щёлкнув по ней левой кнопкой мыши.",
"NOTIFICATION_DRAGGING_HEADER":		"Знаете ли вы? Вы можете перемещать по карте любую метку маршрута.",
"NOTIFICATION_DRAGGING_BODY":		"Щёлкните по метке левой кнопкой мыши и удерживайте кнопку нажатой. " +
									"Затем двигайте метку по карте. Маршрут будет мгновенно обновляться. " +
									"<br/><br/>" +
									"Также вы можете добавлять к маршруту промежуточные метки вытягивая их из основного маршрута! "
};

// set GUI language on load
if( OSRM.DEFAULTS.LANUGAGE_ONDEMAND_RELOADING == true )
	OSRM.Localization.setLanguage("ru", true);


/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU AFFERO General Public License as published by
the Free Software Foundation; either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
or see http://www.gnu.org/licenses/agpl.txt.
*/

// OSRM utility functions
// [mixed functions]


OSRM.Utils = {
		
// [human readabilty sizes]
		
// abbreviations cache
seconds: 's',
minutes: 'min',
hours: 'h',
miles: 'mi',
feet: 'ft',
kilometers: 'km',
meters: 'm',

// update abbreviation cache
updateAbbreviationCache: function() {
	OSRM.Utils.seconds = OSRM.loc("GUI_S");
	OSRM.Utils.minutes = OSRM.loc("GUI_MIN");
	OSRM.Utils.hours = OSRM.loc("GUI_H");
	OSRM.Utils.miles = OSRM.loc("GUI_MI");
	OSRM.Utils.feet = OSRM.loc("GUI_FT");
	OSRM.Utils.kilometers = OSRM.loc("GUI_KM");
	OSRM.Utils.meters = OSRM.loc("GUI_M");
},

// human readable time
toHumanTime: function(seconds){
   seconds = parseInt(seconds);
   minutes = parseInt(seconds/60);
   seconds = seconds%60;
   hours = parseInt(minutes/60);
   minutes = minutes%60;
   if(hours==0 && minutes==0){ return seconds + '&nbsp;' + 's'; }
   else if(hours==0){ return minutes + '&nbsp;' + 'min'; }
   else if(hours>0){ return hours + '&nbsp;' + 'h' + '&nbsp;' + minutes + '&nbsp;' + 'min';}
   else {return "N/A";}
},
//human readable distance
toHumanDistanceMeters: function(meters){
	var distance = parseInt(meters);
	
	distance = distance / 1000;
	if(distance >= 100){ return (distance).toFixed(0)+'&nbsp;' + OSRM.Utils.kilometers; }
	else if(distance >= 10){ return (distance).toFixed(1)+'&nbsp;' + OSRM.Utils.kilometers; }
	else if(distance >= 0.1){ return (distance).toFixed(2)+'&nbsp;' + OSRM.Utils.kilometers; }
	else if(distance >= 0){ return (distance*1000).toFixed(0)+'&nbsp;' + OSRM.Utils.meters; }
	else {return "N/A";}
},
toHumanDistanceMiles: function(meters){
	var distance = parseInt(meters);
	
	distance = distance / 1609.344;
	if(distance >= 100){ return (distance).toFixed(0)+'&nbsp;' + OSRM.Utils.miles; }
	else if(distance >= 10){ return (distance).toFixed(1)+'&nbsp;' + OSRM.Utils.miles; }
	else if(distance >= 0.1){ return (distance).toFixed(2)+'&nbsp;' + OSRM.Utils.miles; }
	else if(distance >= 0){ return (distance*5280).toFixed(0)+'&nbsp;' + OSRM.Utils.feet; }
	else {return "N/A";}
},
toHumanDistance: null,


// [verification routines]

// verify angles
isLatitude: function(value) {
	if( value >=-90 && value <=90)
		return true;
	else
		return false;
},
isLongitude: function(value) {
	if( value >=-180 && value <=180)
		return true;
	else
		return false;
},
isNumber: function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
},


//[other routines]

//hashing as in JAVA (thanks to lordvlad @ stackoverflow)
getHash: function(s) {
	return s.split("").reduce( function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;}, 0);              
}

};