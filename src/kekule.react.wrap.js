import React from 'react';
import { ClassEx, Kekule, KekuleReact } from './kekule.react.base.js';
import './kekule.react.css';

Kekule.globalOptions.add('React.widgetWrapper', {
	// exposeWidgetPropertiesToVueComputes: true, // there are problems to expose widget property to vue component currently, may be fixed in the future
	exposeWidgetPropertiesToReactProps: true,
	exposeWidgetEvents: true,
	// widget properties may conflict with element, should not be exposed in wrapping
	ignoredProperties: ['id', 'draggable', 'droppable', 'innerHTML', 'style', 'offsetParent', 'offsetLeft', 'offsetTop', 'offsetWidth', 'offsetHeight']
	//reactPropNamePrefix: 'default'
});

ClassEx.extendMethod(Kekule.Widget.BaseWidget, 'dispatchEvent', function($origin, eventName, event){
	let result = $origin(eventName, event);

	let reactComp = this._reactComponent;
	if (reactComp)
	{
		if (reactComp._getWidgetWrapOptions().exposeWidgetEvents)
		{
			if (!event.reactComponent)
				event.reactComponent = reactComp;
			let reactEventHandlerName = KekuleReact.Utils._getReactEventNameForKekuleEvent(eventName);
			let reactEventHandler = reactComp.props[reactEventHandlerName];
			if (reactEventHandler && (typeof(reactEventHandler) === 'function'))
				reactEventHandler.apply(reactComp, [event]);
		}
	}
	return result;
});

/**
 * Util functions of Kekule-React.
 * @class
 */
KekuleReact.Utils = {
	/*
	_kekulePropNameToReact: function(propName, reactPropNamePrefix)
	{
		return reactPropNamePrefix + propName.charAt(0).toUpperCase() + propName.substr(1);
	},
	_reactPropNameToKekule: function(propName, reactPropNamePrefix)
	{
		let prefixLength = reactPropNamePrefix.length;
		return propName.substring(prefixLength, prefixLength + 1).toLowerCase() + propName.substring(prefixLength + 1);
	},
	*/
	_getReactEventNameForKekuleEvent(eventName)
	{
		return 'on' + eventName.charAt(0).toUpperCase() + eventName.substring(1);
	},
	wrapWidget: function(widgetClass, options)
	{
		let globalOptions = Kekule.globalOptions.React.widgetWrapper;
		let ops = Object.extend({}, globalOptions);
		ops = Object.extend(ops, options);

		let reactComponent = class extends KekuleReactComponentBase {};
		// Object.setPrototypeOf(reactComponent.prototype, KekuleReactComponentBase.prototype);
		// Object.setPrototypeOf(reactComponent, KekuleReactComponentBase);
		//let reactComponent = function constructor() { super(); };
		// reactComponent.prototype = Object.create(KekuleReactComponentBase.prototype);
		// reactComponent.prototype.constructor = reactComponent;
		reactComponent.prototype.__widgetClass__ = widgetClass;
		reactComponent.prototype.__widgetWrapOptions__ = ops;

		return reactComponent;
	}
}

class KekuleReactComponentBase extends React.Component {
	constructor(props)
	{
		//this.setCompElemRef = elem => { this._componentElement = elem; console.log('set comp element', elem) };
		super(props);
		//this.componentElement = React.createDef();
	}

	_getWidgetWrapOptions()
	{
		return this.__widgetWrapOptions__ || {};
	}
	_getWidgetClass()
	{
		return this.__widgetClass__;
	}
	_createWidget()
	{
		let elem = this._componentElement;
		let widgetClass = this._getWidgetClass();
		let widget = new widgetClass(elem.ownerDocument);
		widget._reactComponent = this;
		widget.appendToElem(elem);
		this.widget = widget;
		this._updateWidgetByProps(this.props, {});
	}
	_updateWidgetByProps(props, prevProps)
	{
		let wrapOptions = this._getWidgetWrapOptions();
		if (wrapOptions.exposeWidgetPropertiesToReactProps)
		{
			for (let key in props)
			{
				if (wrapOptions.exposedProperties && wrapOptions.exposedProperties.indexOf(key) < 0)
					continue;
				if (wrapOptions.ignoredProperties && wrapOptions.ignoredProperties.indexOf(key) >= 0)
					continue;
				if (!prevProps || props[key] !== prevProps[key])
				{
					if (this.widget.hasProperty(key))
						this.widget.setPropValue(key, props[key]);
				}
			}
		}
	}

	getWidget()
	{
		return this.widget;
	}
	getWidgetPropValue(propName)
	{
		return this.widget.getPropValue();
	}
	setWidgetPropValue(propName, value)
	{
		this.widget.setPropValue(propName, value);
		return this;
	}

	componentDidMount()
	{
		// create the widget instance
		this._createWidget();
	}
	componentWillUnmount()
	{
		// finalize widget before unmount
		this.widget.finalize();
	}
	componentDidUpdate(prevProps, prevState, snapshot)
	{
		// update widget according to current props
		this._updateWidgetByProps(this.props, prevProps);
	}

	render()
	{
		let elemOps = {
			'ref': elem => { this._componentElement = elem; },
			'className': this.props.className || 'Kekule-React-Component-Wrapper',
			'kekule-react-wrapper': 'true'
		};
		if (this.props.id)
			elemOps.id = this.props.id;
		// use special attr to mark the wrapper element (the class name will not be added up like in vue) tp make CSS write easier
		return React.createElement('div', elemOps);
	}
}