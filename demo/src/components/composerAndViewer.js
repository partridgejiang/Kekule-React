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
			chemObj: null,
			selectedObjs: undefined
		};
		this.composer = React.createRef();
		this.viewer = React.createRef();

		this.onPredefineSettingChange = this.onPredefineSettingChange.bind(this);
		this.onComposerUserModificationDone = this.onComposerUserModificationDone.bind(this);
		this.onComposerSelectionChange = this.onComposerSelectionChange.bind(this);
	}
	render()
	{
		let selectionInfoElem;
		if (this.state.selectedObjs && this.state.selectedObjs.length)
		{
			let selDetails = this.getComposerSelectedAtomsAndBonds(this.state.selectedObjs);
			selectionInfoElem = <span>You have selected { this.state.selectedObjs.length } object(s), including {selDetails.atoms.length} atom(s) and {selDetails.bonds.length} bond(s).</span>
		}
		else
			selectionInfoElem = <span>Please edit and select objects in the composer to see the changes.</span>;

		return (<div className="ComposerAndViewerDemo">
			<div className="InfoPanel">
				<label>
					{ selectionInfoElem }
				</label>
			</div>
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
				<Composer className="SubWidget" ref={this.composer} predefinedSetting={this.state.composerPredefinedSetting}
				          onUserModificationDone={this.onComposerUserModificationDone} onSelectionChange={this.onComposerSelectionChange}></Composer>
				<Viewer className="SubWidget" ref={this.viewer} predefinedSetting={this.state.viewerPredefinedSetting} chemObj={this.state.chemObj}></Viewer>
			</div>
		</div>);
	}

	getComposerSelectedAtomsAndBonds(selection)
	{
		let result = {atoms: [], bonds: []};
		(selection || []).forEach(obj => {
			if (obj instanceof Kekule.Atom)
				result.atoms.push(obj);
			else if (obj instanceof Kekule.Bond)
				result.bonds.push(obj);
		});
		return result;
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
	onComposerSelectionChange(e)
	{
		this.setState({selectedObjs: this.composer.current.getWidget().getSelection()});
	}
}

export default ComposerAndViewer;