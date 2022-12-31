# Kekule-React

[React](https://reactjs.org/) component wrapper for [Kekule.js](https://github.com/partridgejiang/Kekule.js) widgets.

## Usage

Use the following codes to wrap a Kekule.js widget class to React component:

```javascript
// composer.js
import { Kekule } from 'kekule';
import { KekuleReact } from 'kekule-react';
import 'kekule/theme';

let Composer = KekuleReact.Utils.wrapWidget(Kekule.Editor.Composer, 
    {
      // reactComponent.props.on[EventName] will be called when Kekule events being invoked in widget 	
      exposeWidgetEvents: true,	       
      // each of widget's property will map to a React component's property. E.g., setting reactComponent.props.chemObj will modify widget.chemObj
      exposeWidgetPropertiesToReactProps: true,
      // explicitly set property names exposed to React
      //exposedProperties: []
      // property names hide from React
      ignoredProperties: ['editorNexus', 'actionMap']
    });

export default Composer;

```

Then the wrapped component can be utilized in React application:

```javascript
// myApp.js
class MyApp extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			composerPredefinedSetting: 'molOnly',	          
			chemObj: null
		};
		this.composer = React.createRef();			

		this.onComposerUserModificationDone = this.onComposerUserModificationDone.bind(this);
	}
	render()
	{
		return (<div>
			<Composer predefinedSetting={this.state.composerPredefinedSetting} onUserModificationDone={this.onComposerUserModificationDone}></Composer>	          
		</div>);
	}

	onComposerUserModificationDone(e)
	{
		this.setState({chemObj: this.composer.current.getWidget().getChemObj()});			
	}
}

export default MyApp;
```

Some common-used Kekule widgets has already been wrapped with default options
(```{exposeWidgetEvents: true, 'exposeWidgetPropertiesToReactProps': true}```),
you can use them directly:

```javascript
import { Kekule } from 'kekule';
import { KekuleReact, Components } from 'kekule-react';
import 'kekule/theme';

class App extends React.Component {		
	render()
	{
		return (<div>
                    <Components.PeriodicTable />
                    <Components.Viewer />
                    <Components.SpectrumInspector />
                    <Components.ChemObjInserter />
                    <Components.SpectrumObjInserter />
                    <Components.Composer></Components.Composer>
		</div>);
	}
}
```

Several util methods are also wrapped in the React component to access the widget:

* ``reactComponent.getWidgetPropValue(kekulePropName)``: returns the property value of the wrapped Kekule widget;
* ``reactComponent.setWidgetPropValue(kekulePropName, value)``: sets the property value of the wrapped Kekule widget;
* ``reactComponent.getWidget()``: returns the wrapped Kekule widget instance itself.

Inside the wrapped Kekule widget, method ``kekuleWidget.getReactComponent()`` can be used to retrieve the wrapper React component.
E.g.:

```javascript
console.log(reactComponent.getWidget().getReactComponent() === reactComponent);  // true
console.log(reactComponent.getWidgetPropValue('enabled') === reactComponent.getWidget().enabled);  // true
```

You may also check the simple demo at the ``/demo``  directory of this repository to learn more.