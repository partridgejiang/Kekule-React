import { Kekule, KekuleReact } from './kekule.react.base.js';
import './kekule.react.wrap.js';

let wrapWidgetConfigs = [
	{	'widgetClassName': 'Kekule.ChemWidget.PeriodicTable' },
	{ 'widgetClassName': 'Kekule.ChemWidget.Viewer'	},
	{	'widgetClassName': 'Kekule.ChemWidget.SpectrumInspector' },
	{	'widgetClassName': 'Kekule.ChemWidget.ChemObjInserter' },
	{ 'widgetClassName': 'Kekule.ChemWidget.SpectrumObjInserter' },
	{	'widgetClassName': 'Kekule.Editor.Composer'	}
];

function wrapWidgets()
{
	if (KekuleReact.Utils)
	{
		let compNamespace = KekuleReact;
		for (let i = 0, l = wrapWidgetConfigs.length; i < l; ++i)
		{
			var config = wrapWidgetConfigs[i];
			var widgetClass = Object.getCascadeFieldValue(config.widgetClassName, Kekule.$jsRoot);
			if (widgetClass)  // do wrap
			{
				var widgetShortName = Kekule.ClassUtils.getLastClassName(config.widgetClassName);
				var wrapper = KekuleReact.Utils.wrapWidget(widgetClass, config.options);
				compNamespace[widgetShortName] = wrapper;  // add to namespace
			}
		}
		return compNamespace;
	}
	else
	{
		return {};
	}
}

export default wrapWidgets();