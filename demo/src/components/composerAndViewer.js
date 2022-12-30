import React from 'react';
import { Kekule } from 'kekule';
import 'kekule/theme';
import { KekuleReact, Components } from 'kekule-react';
import './composerAndViewer.css';

let Viewer = Components.Viewer;
let Composer = Components.Composer;

class ComposerAndViewer extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			composerPredefinedSetting: 'molOnly',
			viewerPredefinedSetting: 'basic',
			chemObj: null
		};
		this.composer = React.createRef();
		this.viewer = React.createRef();

		this.onPredefineSettingChange = this.onPredefineSettingChange.bind(this);
		this.onComposerUserModificationDone = this.onComposerUserModificationDone.bind(this);
	}
	render()
	{
		return (<div className="ComposerAndViewerDemo">
			<div className="ControlPanel">
				<label> Composer Predefined Setting:
						<select value={this.state.composerPredefinedSetting} onChange={this.onPredefineSettingChange}>
							<option value="fullFunc">fullFunc</option>
							<option value="molOnly">molOnly</option>
							<option value="compact">compact</option>
						</select>
				</label>
			</div>
			<div className="ComposerViewerPair">
				<Composer className="SubWidget" ref={this.composer} predefinedSetting={this.state.composerPredefinedSetting} onUserModificationDone={this.onComposerUserModificationDone}></Composer>
				<Viewer className="SubWidget" ref={this.viewer} predefinedSetting={this.state.viewerPredefinedSetting} chemObj={this.state.chemObj}></Viewer>
			</div>
		</div>);
	}

	onPredefineSettingChange(e)
	{
		this.setState({'composerPredefinedSetting': e.target.value});
	}

	onComposerUserModificationDone(e)
	{
		this.setState({chemObj: this.composer.current.getWidget().getChemObj()});
		this.viewer.current.getWidget().requestRepaint();
	}
}

export default ComposerAndViewer;