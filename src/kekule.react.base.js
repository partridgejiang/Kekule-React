let $root;
if (typeof(window) === 'object' && window && window.document)
	$root = window;
else if (typeof(global) === 'object')  // node env
	$root = global;
else if (typeof(self) === 'object')
	$root = self;

let Kekule = $root.Kekule;
let ClassEx = Kekule.ClassEx;

/**
 * Namespace of Kekule-React.
 * @namespace
 */
Kekule.React = {};

let KekuleReact = Kekule.React;

KekuleReact.VERSION = '0.1.0';

export { ClassEx, Kekule, KekuleReact };