((function(factory, ctx, undefined){
	if ((typeof module) !== 'undefined' && module.exports) {
		var $ = require('jquery');
		var _  = require('underscore');
		var sfmUtil = require('sfmUtil');
		require('openLayers2');
        module.exports = factory($, _, sfmUtil);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmUtil', 'openLayers2'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.OlNavigation = factory(ctx.$, ctx._, ctx.SFM.sfmUtil);
    }
})(function($, _, sfmUtil){
	var VERSION = '0.0.1';

	var OlNavigation = OpenLayers.Class(OpenLayers.Control.Navigation, {

        /**
         * Property: zoomOutBox
         * {<OpenLayers.Control.ZoomBox>}
         */
        zoomOutBox: null,

        /**
         * APIProperty: zoomOutBoxEnabled
         * {Boolean} Whether the user can draw a box to zoom out
         */
        zoomOutBoxEnabled: true,

        /**
         * APIProperty: zoomOutBoxKeyMask
         * {Integer} <OpenLayers.Handler> key code of the key, which has to be
         *    pressed, while drawing the zoom box with the mouse on the screen.
         *    You should probably set handleRightClicks to true if you use this
         *    with MOD_CTRL, to disable the context menu for machines which use
         *    CTRL-Click as a right click.
         * Default: <OpenLayers.Handler.MOD_ALT>
         */
        zoomOutBoxKeyMask: OpenLayers.Handler.MOD_CTRL,

        initialize: function(options) {
            OpenLayers.Control.Navigation.prototype.initialize.apply(this, arguments);
        },

        /**
         * Method: destroy
         * The destroy method is used to perform any clean up before the control
         * is dereferenced.  Typically this is where event listeners are removed
         * to prevent memory leaks.
         */
        destroy: function() {
            this.deactivate();

            if (this.zoomOutBox) {
                this.zoomOutBox.destroy();
            }
            this.zoomOutBox = null;

            OpenLayers.Control.Navigation.prototype.destroy.apply(this, arguments);
        },

        /**
         * Method: activate
         */
        activate: function() {
            this.dragPan.activate();
            if (this.zoomWheelEnabled) {
                this.handlers.wheel.activate();
            }
            this.handlers.click.activate();
            if (this.zoomBoxEnabled) {
                this.zoomBox.activate();
            }
            if (this.zoomOutBoxEnabled) {
                this.zoomOutBox.activate();
            }
            if (this.pinchZoom) {
                this.pinchZoom.activate();
            }
            return OpenLayers.Control.prototype.activate.apply(this, arguments);
        },

        /**
         * Method: deactivate
         */
        deactivate: function() {
            if (this.pinchZoom) {
                this.pinchZoom.deactivate();
            }
            this.zoomBox.deactivate();
            if (this.zoomOutBoxEnabled && this.zoomOutBox) {
                this.zoomOutBox.deactivate();
            }
            this.dragPan.deactivate();
            this.handlers.click.deactivate();
            this.handlers.wheel.deactivate();
            return OpenLayers.Control.prototype.deactivate.apply(this,arguments);
        },

        /**
         * Method: draw
         */
        draw: function() {
            OpenLayers.Control.Navigation.prototype.draw.apply(this, arguments);
            this.zoomOutBox = new OpenLayers.Control.ZoomBox({ map: this.map, keyMask: this.zoomOutBoxKeyMask, out: true });
            this.zoomOutBox.draw();
        },

        /**
         * Method: disableZoomOutBox
         */
        disableZoomOutBox: function() {
            this.zoomOutBoxEnabled = false;
            this.zoomOutBox.deactivate();
        },

        /**
         * Method: enableZoomOutBox
         */
        enableZoomOutBox: function() {
            this.zoomOutBoxEnabled = true;
            if (this.active) {
                this.zoomOutBox.activate();
            }
        },

        CLASS_NAME: "OlNavigation",
        version: VERSION
    });
    return OlNavigation;
}, window));
