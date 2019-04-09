/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* webpack entry file to build a standalone browser script. */
	window.BootstrapMenu = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var classNames = __webpack_require__(2);
	var $ = __webpack_require__(3);
	__webpack_require__(4);

	// modular lodash requires
	var _ = function() {
	  throw new Error('Custom lodash build for BootstrapMenu. lodash chaining is not included');
	};

	_.noop = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash/utility/noop\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	_.each = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash/collection/each\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	_.contains = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash/collection/contains\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	_.extend = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash/object/extend\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	_.uniqueId = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash/utility/uniqueId\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	_.isFunction = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"lodash/lang/isFunction\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));


	var defaultOptions = {
	    /* container of the context menu, where it will be created and where
	     * event listeners will be installed. */
	    container: 'body',

	    /* user-defined function to obtain specific data about the currently
	     * opened element, to pass it to the rest of user-defined functions
	     * of an action. */
	    fetchElementData: _.noop,

	    /* what the source of the context menu should be when opened.
	     * Valid values are 'mouse' and 'element'. */
	    menuSource: 'mouse',

	    /* how to calculate the position of the context menu based on its source.
	     * Valid values are 'aboveLeft', 'aboveRight', 'belowLeft', and 'belowRight'. */
	    menuPosition: 'belowLeft',

	    /* the event to listen to open the menu.
	     * Valid values are 'click', 'right-click', 'hover' */
	    menuEvent: 'right-click', // TODO rename to menuAction in next mayor version

	    /* group actions to render them next to each other, with a separator
	     * between each group. */
	    actionsGroups: [],

	    /* message to show when there are no actions to show in a menu
	     * (isShown() returned false on all actions) */
	    noActionsMessage: 'No available actions',

	    /* In some weird cases, another plugin may be installing 'click' listeners
	     * in the anchors used for each action of the context menu, and stopping
	     * the event bubbling before it reachs this plugin's listener.
	     *
	     * For those cases, _actionSelectEvent can be used to change the event we
	     * listen to, for example to 'mousedown'.
	     *
	     * Unless the context menu is not working due to this and a workaround is
	     * needed, this option can be safely ignored.
	     */
	    _actionSelectEvent: 'click'
	};

	function renderMenu(_this) {
	    var $menu = $('<div class="dropdown bootstrapMenu" style="z-index:10000;position:absolute;" />');

	    var $ul = $('<ul class="dropdown-menu" style="position:static;display:block;font-size:0.9em;" />');

	    // group all actions following the actionsGroups option, to
	    // add a separator between each of them.
	    var groups = [];

	    // default group where all ungrouped actions will go
	    groups[0] = [];

	    // add the rest of groups
	    _.each(_this.options.actionsGroups, function(groupArr, ind) {
	        groups[ind+1] = [];
	    });

	    // find out if any of the actions has an icon
	    var actionsHaveIcon = false;

	    // add each action to the group it belongs to, or the default group
	    _.each(_this.options.actions, function(action, actionId) {
	        var addedToGroup = false;

	        _.each(_this.options.actionsGroups, function(groupArr, ind) {
	            if (_.contains(groupArr, actionId)) {
	                groups[ind+1].push(actionId);
	                addedToGroup = true;
	            }
	        });

	        if (addedToGroup === false) {
	            groups[0].push(actionId);
	        }

	        if (typeof action.iconClass !== 'undefined') {
	            actionsHaveIcon = true;
	        }
	    });

	    var isFirstNonEmptyGroup = true;

	    _.each(groups, function(actionsIds) {
	        if (actionsIds.length == 0)
	            return;

	        if (isFirstNonEmptyGroup === false) {
	            $ul.append('<li class="divider"></li>');
	        }
	        isFirstNonEmptyGroup = false;

	        _.each(actionsIds, function(actionId) {
	            var action = _this.options.actions[actionId];

	            /* At least an action has an icon. Add the icon of the current action,
	             * or room to align it with the actions which do have one. */
	            if (actionsHaveIcon === true) {
	                $ul.append(
	                    '<li role="presentation" data-action="'+actionId+'">' +
	                    '<a href="#" role="menuitem">' +
	                    '<i class="fa fa-fw fa-lg ' + (action.iconClass || '') + '"></i> ' +
	                    '<span class="actionName"></span>' +
	                    '</a>' +
	                    '</li>'
	                );
	            }
	            // neither of the actions have an icon.
	            else {
	                $ul.append(
	                    '<li role="presentation" data-action="'+actionId+'">' +
	                    '<a href="#" role="menuitem"><span class="actionName"></span></a>' +
	                    '</li>'
	                );
	            }
	        });

	        $ul.append(
	            '<li role="presentation" class="noActionsMessage disabled">' +
	            '<a href="#" role="menuitem">' +
	            '<span>' + _this.options.noActionsMessage + '</span>' +
	            '</a>' +
	            '</li>'
	        );
	    });

	    return $menu.append($ul);
	}

	function setupOpenEventListeners(_this) {
	    var openEventName = null;

	    switch (_this.options.menuEvent) {
	        case 'click':
	            openEventName = 'click';
	            break;
	        case 'right-click':
	            openEventName = 'contextmenu';
	            break;
	        case 'hover':
	            openEventName = 'mouseenter';
	            break;
	        default:
	            throw new Error("Unknown BootstrapMenu 'menuEvent' option");
	    }

	    // install the handler for every future elements where
	    // the context menu will open
	    _this.$container.on(openEventName + _this.namespace, _this.selector, function(evt) {
	        var $openTarget = $(this);

	        _this.open($openTarget, evt);

	        // cancel event propagation, to avoid it bubbling up to this.$container
	        // and closing the context menu as if the user clicked outside the menu.
	        return false;
	    });
	}

	function clearOpenEventListeners(_this) {
	    _this.$container.off(_this.namespace);
	}

	function setupActionsEventListeners(_this) {
	    var actionSelectEvent = _this.options._actionSelectEvent + _this.namespace;

	    // handler to run when an option is selected
	    _this.$menu.on(actionSelectEvent, function(evt) {
	        evt.preventDefault();
	        evt.stopPropagation();

	        var $target = $(evt.target);
	        var $action = $target.closest('[data-action]');

	        // check if the clicked element is an action, and its enabled.
	        // if not don't do anything
	        if (!$action || !$action.length || $action.is('.disabled')) {
	            return;
	        }

	        var actionId = $action.data('action');
	        var targetData = _this.options.fetchElementData(_this.$openTarget);

	        /* call the user click handler. It receives the optional user-defined data,
	         * or undefined. */
	        _this.options.actions[actionId].onClick(targetData);

	        // close the menu
	        _this.close();
	    });
	}

	function clearActionsEventListeners(_this) {
	    _this.$menu.off(_this.namespace);
	}

	function setupCloseEventListeners(_this) {
	    switch (_this.options.menuEvent) {
	        case 'click':
	            break;
	        case 'right-click':
	            break;
	        case 'hover':
	            // close the menu when the mouse is moved outside both
	            // the element where the context menu was opened, and
	            // the context menu itself.
	            var $elemsToCheck = _this.$openTarget.add(_this.$menu);

	            $elemsToCheck.on('mouseleave' + _this.closeNamespace, function(evt) {
	                var destElement = evt.toElement || evt.relatedTarget;
	                if (!_this.$openTarget.is(destElement) && !_this.$menu.is(destElement)) {
	                    $elemsToCheck.off(_this.closeNamespace);
	                    _this.close();
	                }
	            });
	            break;
	        default:
	            throw new Error("Unknown BootstrapMenu 'menuEvent' option");
	    }

	    // it the user clicks outside the context menu, close it.
	    _this.$container.on('click' + _this.closeNamespace, function() {
	        _this.close();
	    });
	}

	function clearCloseEventListeners(_this) {
	    _this.$container.off(_this.closeNamespace);
	}

	var BootstrapMenu = function(selector, options) {
	    this.selector = selector;
	    this.options = _.extend({}, defaultOptions, options);

	    // namespaces to use when registering event listeners
	    this.namespace = _.uniqueId('.BootstrapMenu_');
	    this.closeNamespace = _.uniqueId('.BootstrapMenuClose_');

	    this.init();
	};

	var existingInstances = [];

	BootstrapMenu.prototype.init = function() {
	    this.$container = $(this.options.container);

	    // jQuery object of the rendered context menu. Not part of the DOM yet.
	    this.$menu = renderMenu(this);
	    this.$menuList = this.$menu.children();

	    /* append the context menu to <body> to be able to use "position: absolute"
	     * absolute to the whole window. */
	    this.$menu.hide().appendTo(this.$container);

	    /* the element in which the context menu was opened. Updated every time
	     * the menu is opened. */
	    this.$openTarget = null;

	    /* event that triggered the context menu to open. Updated every time
	     * the menu is opened. */
	    this.openEvent = null;

	    setupOpenEventListeners(this);

	    setupActionsEventListeners(this);

	    // keep track of all the existing context menu instances in the page
	    existingInstances.push(this);
	};

	BootstrapMenu.prototype.updatePosition = function() {
	    var menuLocation = null; // my
	    var relativeToElem = null; // of
	    var relativeToLocation = null; // at

	    switch (this.options.menuSource) {
	        case 'element':
	            relativeToElem = this.$openTarget;
	            break;
	        case 'mouse':
	            relativeToElem = this.openEvent;
	            break;
	        default:
	            throw new Error("Unknown BootstrapMenu 'menuSource' option");
	    }

	    switch (this.options.menuPosition) {
	        case 'belowRight':
	            menuLocation = 'right top';
	            relativeToLocation = 'right bottom';
	            break;
	        case 'belowLeft':
	            menuLocation = 'left top';
	            relativeToLocation = 'left bottom';
	            break;
	        case 'aboveRight':
	            menuLocation = 'right bottom';
	            relativeToLocation = 'right top';
	            break;
	        case 'aboveLeft':
	            menuLocation = 'left bottom';
	            relativeToLocation = 'left top';
	            break;
	        default:
	            throw new Error("Unknown BootstrapMenu 'menuPosition' option");
	    }

	    // update the menu's height and width manually
	    this.$menu.css({ display: 'block' });

	    // once the menu is not hidden anymore, we can obtain its content's height and width,
	    // to manually update it in the menu
	    this.$menu.css({
	        height: this.$menuList.height(),
	        width: this.$menuList.width()
	    });

	    this.$menu.position({ my: menuLocation, at: relativeToLocation, of: relativeToElem });
	};

	// open the context menu
	BootstrapMenu.prototype.open = function($openTarget, event) {
	    var _this = this;

	    // first close all open instances of opened context menus in the page
	    BootstrapMenu.closeAll();

	    this.$openTarget = $openTarget;

	    this.openEvent = event;

	    var targetData = _this.options.fetchElementData(_this.$openTarget);

	    var $actions = this.$menu.find('[data-action]'),
	        $noActionsMsg = this.$menu.find('.noActionsMessage');

	    // clear previously hidden actions, and hide by default the 'No actions' message
	    $actions.show();
	    $noActionsMsg.hide();

	    var numShown = 0;

	    /* go through all actions to update the text to show, which ones to show
	     * enabled/disabled and which ones to hide. */
	    $actions.each(function() {
	        var $action = $(this);

	        var actionId = $action.data('action');
	        var action = _this.options.actions[actionId];

	        var classes = action.classNames || null;

	        if (classes && _.isFunction(classes))
	            classes = classes(targetData);

	        $action.attr('class', classNames(classes || ''));

	        if (action.isShown && action.isShown(targetData) === false) {
	            $action.hide();
	            return;
	        } else {
	            numShown++;
	        }

	        // the name provided for an action may be dynamic, provided as a function
	        $action.find('.actionName').html(
	            _.isFunction(action.name) && action.name(targetData) || action.name
	        );

	        if (action.isEnabled && action.isEnabled(targetData) === false) {
	            $action.addClass('disabled');
	        }
	    });

	    if (numShown === 0) {
	        $noActionsMsg.show();
	    }

	    // once it is known which actions are or arent being shown
	    // (so we know the final height of the context menu),
	    // calculate its position
	    this.updatePosition();

	    this.$menu.show();

	    setupCloseEventListeners(this);
	};

	// close the context menu
	BootstrapMenu.prototype.close = function() {
	    // hide the menu
	    this.$menu.hide();

	    clearCloseEventListeners(this);
	};

	BootstrapMenu.prototype.destroy = function() {
	    this.close();
	    clearOpenEventListeners(this);
	    clearActionsEventListeners(this);
	};

	// close all instances of context menus
	BootstrapMenu.closeAll = function() {
	    _.each(existingInstances, function(contextMenu) {
	        contextMenu.close();
	    });
	};

	module.exports = BootstrapMenu;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2017 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg) && arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = jQuery;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery UI Position 1.12.1
	 * http://jqueryui.com
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 *
	 * http://api.jqueryui.com/position/
	 */

	//>>label: Position
	//>>group: Core
	//>>description: Positions elements relative to other elements.
	//>>docs: http://api.jqueryui.com/position/
	//>>demos: http://jqueryui.com/position/

	( function( factory ) {
		if ( true ) {

			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(3), __webpack_require__(5) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {

			// Browser globals
			factory( jQuery );
		}
	}( function( $ ) {
	( function() {
	var cachedScrollbarWidth,
		max = Math.max,
		abs = Math.abs,
		rhorizontal = /left|center|right/,
		rvertical = /top|center|bottom/,
		roffset = /[\+\-]\d+(\.[\d]+)?%?/,
		rposition = /^\w+/,
		rpercent = /%$/,
		_position = $.fn.position;

	function getOffsets( offsets, width, height ) {
		return [
			parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
			parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
		];
	}

	function parseCss( element, property ) {
		return parseInt( $.css( element, property ), 10 ) || 0;
	}

	function getDimensions( elem ) {
		var raw = elem[ 0 ];
		if ( raw.nodeType === 9 ) {
			return {
				width: elem.width(),
				height: elem.height(),
				offset: { top: 0, left: 0 }
			};
		}
		if ( $.isWindow( raw ) ) {
			return {
				width: elem.width(),
				height: elem.height(),
				offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
			};
		}
		if ( raw.preventDefault ) {
			return {
				width: 0,
				height: 0,
				offset: { top: raw.pageY, left: raw.pageX }
			};
		}
		return {
			width: elem.outerWidth(),
			height: elem.outerHeight(),
			offset: elem.offset()
		};
	}

	$.position = {
		scrollbarWidth: function() {
			if ( cachedScrollbarWidth !== undefined ) {
				return cachedScrollbarWidth;
			}
			var w1, w2,
				div = $( "<div " +
					"style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
					"<div style='height:100px;width:auto;'></div></div>" ),
				innerDiv = div.children()[ 0 ];

			$( "body" ).append( div );
			w1 = innerDiv.offsetWidth;
			div.css( "overflow", "scroll" );

			w2 = innerDiv.offsetWidth;

			if ( w1 === w2 ) {
				w2 = div[ 0 ].clientWidth;
			}

			div.remove();

			return ( cachedScrollbarWidth = w1 - w2 );
		},
		getScrollInfo: function( within ) {
			var overflowX = within.isWindow || within.isDocument ? "" :
					within.element.css( "overflow-x" ),
				overflowY = within.isWindow || within.isDocument ? "" :
					within.element.css( "overflow-y" ),
				hasOverflowX = overflowX === "scroll" ||
					( overflowX === "auto" && within.width < within.element[ 0 ].scrollWidth ),
				hasOverflowY = overflowY === "scroll" ||
					( overflowY === "auto" && within.height < within.element[ 0 ].scrollHeight );
			return {
				width: hasOverflowY ? $.position.scrollbarWidth() : 0,
				height: hasOverflowX ? $.position.scrollbarWidth() : 0
			};
		},
		getWithinInfo: function( element ) {
			var withinElement = $( element || window ),
				isWindow = $.isWindow( withinElement[ 0 ] ),
				isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9,
				hasOffset = !isWindow && !isDocument;
			return {
				element: withinElement,
				isWindow: isWindow,
				isDocument: isDocument,
				offset: hasOffset ? $( element ).offset() : { left: 0, top: 0 },
				scrollLeft: withinElement.scrollLeft(),
				scrollTop: withinElement.scrollTop(),
				width: withinElement.outerWidth(),
				height: withinElement.outerHeight()
			};
		}
	};

	$.fn.position = function( options ) {
		if ( !options || !options.of ) {
			return _position.apply( this, arguments );
		}

		// Make a copy, we don't want to modify arguments
		options = $.extend( {}, options );

		var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
			target = $( options.of ),
			within = $.position.getWithinInfo( options.within ),
			scrollInfo = $.position.getScrollInfo( within ),
			collision = ( options.collision || "flip" ).split( " " ),
			offsets = {};

		dimensions = getDimensions( target );
		if ( target[ 0 ].preventDefault ) {

			// Force left top to allow flipping
			options.at = "left top";
		}
		targetWidth = dimensions.width;
		targetHeight = dimensions.height;
		targetOffset = dimensions.offset;

		// Clone to reuse original targetOffset later
		basePosition = $.extend( {}, targetOffset );

		// Force my and at to have valid horizontal and vertical positions
		// if a value is missing or invalid, it will be converted to center
		$.each( [ "my", "at" ], function() {
			var pos = ( options[ this ] || "" ).split( " " ),
				horizontalOffset,
				verticalOffset;

			if ( pos.length === 1 ) {
				pos = rhorizontal.test( pos[ 0 ] ) ?
					pos.concat( [ "center" ] ) :
					rvertical.test( pos[ 0 ] ) ?
						[ "center" ].concat( pos ) :
						[ "center", "center" ];
			}
			pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
			pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

			// Calculate offsets
			horizontalOffset = roffset.exec( pos[ 0 ] );
			verticalOffset = roffset.exec( pos[ 1 ] );
			offsets[ this ] = [
				horizontalOffset ? horizontalOffset[ 0 ] : 0,
				verticalOffset ? verticalOffset[ 0 ] : 0
			];

			// Reduce to just the positions without the offsets
			options[ this ] = [
				rposition.exec( pos[ 0 ] )[ 0 ],
				rposition.exec( pos[ 1 ] )[ 0 ]
			];
		} );

		// Normalize collision option
		if ( collision.length === 1 ) {
			collision[ 1 ] = collision[ 0 ];
		}

		if ( options.at[ 0 ] === "right" ) {
			basePosition.left += targetWidth;
		} else if ( options.at[ 0 ] === "center" ) {
			basePosition.left += targetWidth / 2;
		}

		if ( options.at[ 1 ] === "bottom" ) {
			basePosition.top += targetHeight;
		} else if ( options.at[ 1 ] === "center" ) {
			basePosition.top += targetHeight / 2;
		}

		atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
		basePosition.left += atOffset[ 0 ];
		basePosition.top += atOffset[ 1 ];

		return this.each( function() {
			var collisionPosition, using,
				elem = $( this ),
				elemWidth = elem.outerWidth(),
				elemHeight = elem.outerHeight(),
				marginLeft = parseCss( this, "marginLeft" ),
				marginTop = parseCss( this, "marginTop" ),
				collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) +
					scrollInfo.width,
				collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) +
					scrollInfo.height,
				position = $.extend( {}, basePosition ),
				myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

			if ( options.my[ 0 ] === "right" ) {
				position.left -= elemWidth;
			} else if ( options.my[ 0 ] === "center" ) {
				position.left -= elemWidth / 2;
			}

			if ( options.my[ 1 ] === "bottom" ) {
				position.top -= elemHeight;
			} else if ( options.my[ 1 ] === "center" ) {
				position.top -= elemHeight / 2;
			}

			position.left += myOffset[ 0 ];
			position.top += myOffset[ 1 ];

			collisionPosition = {
				marginLeft: marginLeft,
				marginTop: marginTop
			};

			$.each( [ "left", "top" ], function( i, dir ) {
				if ( $.ui.position[ collision[ i ] ] ) {
					$.ui.position[ collision[ i ] ][ dir ]( position, {
						targetWidth: targetWidth,
						targetHeight: targetHeight,
						elemWidth: elemWidth,
						elemHeight: elemHeight,
						collisionPosition: collisionPosition,
						collisionWidth: collisionWidth,
						collisionHeight: collisionHeight,
						offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
						my: options.my,
						at: options.at,
						within: within,
						elem: elem
					} );
				}
			} );

			if ( options.using ) {

				// Adds feedback as second argument to using callback, if present
				using = function( props ) {
					var left = targetOffset.left - position.left,
						right = left + targetWidth - elemWidth,
						top = targetOffset.top - position.top,
						bottom = top + targetHeight - elemHeight,
						feedback = {
							target: {
								element: target,
								left: targetOffset.left,
								top: targetOffset.top,
								width: targetWidth,
								height: targetHeight
							},
							element: {
								element: elem,
								left: position.left,
								top: position.top,
								width: elemWidth,
								height: elemHeight
							},
							horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
							vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
						};
					if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
						feedback.horizontal = "center";
					}
					if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
						feedback.vertical = "middle";
					}
					if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
						feedback.important = "horizontal";
					} else {
						feedback.important = "vertical";
					}
					options.using.call( this, props, feedback );
				};
			}

			elem.offset( $.extend( position, { using: using } ) );
		} );
	};

	$.ui.position = {
		fit: {
			left: function( position, data ) {
				var within = data.within,
					withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
					outerWidth = within.width,
					collisionPosLeft = position.left - data.collisionPosition.marginLeft,
					overLeft = withinOffset - collisionPosLeft,
					overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
					newOverRight;

				// Element is wider than within
				if ( data.collisionWidth > outerWidth ) {

					// Element is initially over the left side of within
					if ( overLeft > 0 && overRight <= 0 ) {
						newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
							withinOffset;
						position.left += overLeft - newOverRight;

					// Element is initially over right side of within
					} else if ( overRight > 0 && overLeft <= 0 ) {
						position.left = withinOffset;

					// Element is initially over both left and right sides of within
					} else {
						if ( overLeft > overRight ) {
							position.left = withinOffset + outerWidth - data.collisionWidth;
						} else {
							position.left = withinOffset;
						}
					}

				// Too far left -> align with left edge
				} else if ( overLeft > 0 ) {
					position.left += overLeft;

				// Too far right -> align with right edge
				} else if ( overRight > 0 ) {
					position.left -= overRight;

				// Adjust based on position and margin
				} else {
					position.left = max( position.left - collisionPosLeft, position.left );
				}
			},
			top: function( position, data ) {
				var within = data.within,
					withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
					outerHeight = data.within.height,
					collisionPosTop = position.top - data.collisionPosition.marginTop,
					overTop = withinOffset - collisionPosTop,
					overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
					newOverBottom;

				// Element is taller than within
				if ( data.collisionHeight > outerHeight ) {

					// Element is initially over the top of within
					if ( overTop > 0 && overBottom <= 0 ) {
						newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
							withinOffset;
						position.top += overTop - newOverBottom;

					// Element is initially over bottom of within
					} else if ( overBottom > 0 && overTop <= 0 ) {
						position.top = withinOffset;

					// Element is initially over both top and bottom of within
					} else {
						if ( overTop > overBottom ) {
							position.top = withinOffset + outerHeight - data.collisionHeight;
						} else {
							position.top = withinOffset;
						}
					}

				// Too far up -> align with top
				} else if ( overTop > 0 ) {
					position.top += overTop;

				// Too far down -> align with bottom edge
				} else if ( overBottom > 0 ) {
					position.top -= overBottom;

				// Adjust based on position and margin
				} else {
					position.top = max( position.top - collisionPosTop, position.top );
				}
			}
		},
		flip: {
			left: function( position, data ) {
				var within = data.within,
					withinOffset = within.offset.left + within.scrollLeft,
					outerWidth = within.width,
					offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
					collisionPosLeft = position.left - data.collisionPosition.marginLeft,
					overLeft = collisionPosLeft - offsetLeft,
					overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
					myOffset = data.my[ 0 ] === "left" ?
						-data.elemWidth :
						data.my[ 0 ] === "right" ?
							data.elemWidth :
							0,
					atOffset = data.at[ 0 ] === "left" ?
						data.targetWidth :
						data.at[ 0 ] === "right" ?
							-data.targetWidth :
							0,
					offset = -2 * data.offset[ 0 ],
					newOverRight,
					newOverLeft;

				if ( overLeft < 0 ) {
					newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
						outerWidth - withinOffset;
					if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
						position.left += myOffset + atOffset + offset;
					}
				} else if ( overRight > 0 ) {
					newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
						atOffset + offset - offsetLeft;
					if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
						position.left += myOffset + atOffset + offset;
					}
				}
			},
			top: function( position, data ) {
				var within = data.within,
					withinOffset = within.offset.top + within.scrollTop,
					outerHeight = within.height,
					offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
					collisionPosTop = position.top - data.collisionPosition.marginTop,
					overTop = collisionPosTop - offsetTop,
					overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
					top = data.my[ 1 ] === "top",
					myOffset = top ?
						-data.elemHeight :
						data.my[ 1 ] === "bottom" ?
							data.elemHeight :
							0,
					atOffset = data.at[ 1 ] === "top" ?
						data.targetHeight :
						data.at[ 1 ] === "bottom" ?
							-data.targetHeight :
							0,
					offset = -2 * data.offset[ 1 ],
					newOverTop,
					newOverBottom;
				if ( overTop < 0 ) {
					newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
						outerHeight - withinOffset;
					if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
						position.top += myOffset + atOffset + offset;
					}
				} else if ( overBottom > 0 ) {
					newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
						offset - offsetTop;
					if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
						position.top += myOffset + atOffset + offset;
					}
				}
			}
		},
		flipfit: {
			left: function() {
				$.ui.position.flip.left.apply( this, arguments );
				$.ui.position.fit.left.apply( this, arguments );
			},
			top: function() {
				$.ui.position.flip.top.apply( this, arguments );
				$.ui.position.fit.top.apply( this, arguments );
			}
		}
	};

	} )();

	return $.ui.position;

	} ) );


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;( function( factory ) {
		if ( true ) {

			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(3) ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {

			// Browser globals
			factory( jQuery );
		}
	} ( function( $ ) {

	$.ui = $.ui || {};

	return $.ui.version = "1.12.1";

	} ) );


/***/ })
/******/ ]);