import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import { Container, StyleProvider, Header, Footer, Subtitle,
  FooterTab, Thumbnail, Title, Content, Button, Icon, ListItem,
  Left, Body, Right} from 'native-base';

import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';

import getTheme from '../../native-base-theme/components';
import common from '../../native-base-theme/variables/commonColor';
import androidTablet from '../../native-base-theme/variables/androidTablet';

import KeyHeader from '../../components/KeyHeader';
import TraitList from '../../components/TraitList';
import SpeciesPanel from '../../components/SpeciesPanel';
import TraitDialog from '../../components/TraitDialog';

import * as KeyAction from '../../actions/KeyAction';

import styles  from './styles.js';

type Props = {
  title: String,
}

type State = {
  isSpeciesPanelToggled: Boolean,
  isTraitDialogVisible: Boolean,
  selectedTrait: Object,
}

class Key2 extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isSpeciesPanelToggled: true,
      isTraitDialogVisible: false,
      selectedTrait: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const prevValues = this.props.chosenValues;
    const nextValues = nextProps.chosenValues;
    const { isSpeciesPanelToggled } = this.state;

    if(prevValues.length === 0 && nextValues.length > 0 && isSpeciesPanelToggled) {
      this.toggleSpeciesPanel();
    }
  }

  setStateAnimated(callback: (state: State) => void) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(callback);
  }

  onClose = () => {
    Actions.pop();
  }

  onKeyInfo = () => {
    Actions.Info();
  }

  toggleSpeciesPanel = () => {
    this.setStateAnimated((prevState) => ({
      ...prevState,
      isSpeciesPanelToggled: !prevState.isSpeciesPanelToggled
    }));
  }

  onSpeciesSelected = (species) => {
    Actions.Species({nerby: 0, selectedSpecies: species});
  }

  onValueSelected = (value) => {
    const { actions, keyId } = this.props;

    // Update state
    actions.selectTraitValue(keyId, value);

    // Hide dialog (not in state)
    this.onTraitSelected(undefined);
  }

  onValueInfo = (value) => {
    const { valueImages } = this.props;
    let images = valueImages.get(value.value_id);
    if(!images) images = [];
    Actions.ValueInfo({valueInfo: value.valueInfo, title: value.valueText, images});
  }

  onTraitSelected = (trait) => {
    this.setStateAnimated((prevState) => ({
      ...prevState,
      isTraitDialogVisible: trait !== undefined,
      selectedTrait: trait,
    }));
  }

  render() {
    const { title, traits, species, speciesImages, valueImages,
      chosenValues, totalSpecies, foundSpecies, chosenTraits,
      activeTraits, activeValues } = this.props;

    const { isSpeciesPanelToggled, isTraitDialogVisible, selectedTrait } = this.state;

    // Find selected value in selected trait (if dialog is visible)
    const selectedValue = selectedTrait ?
      selectedTrait.values.find(v => chosenValues.indexOf(v.value_id) > -1) : null;

    // Find used traits
    const unusedTraits = traits
      .filter(trait => chosenTraits.indexOf(trait.trait_id) === -1);

    // Find unused traits
    const usedTraits = traits.filter(trait => chosenTraits.indexOf(trait.trait_id) !== -1);

    return (
      <StyleProvider style={this.props.deviceTypeAndroidTablet ? getTheme(androidTablet) : getTheme(common)}>
        <View style={styles.container}>
          <KeyHeader
            title={title}
            closeTitle="Lukk"
            onClose={this.onClose}
            onInfo={this.onKeyInfo}
          />
          <View style={styles.container} >
            <TraitList
              unusedTraits={unusedTraits}
              activeTraits={activeTraits}
              activeValues={activeValues}
              onSelect={this.onTraitSelected}
              traits={usedTraits}
              chosenValues={chosenValues}
              onSelect={this.onTraitSelected}
              valueImages={valueImages}
              header='Valgte egenskaper:'
              emptyHeader='Egenskaper ved arter'
              emptyDescription='Du har ikke valgt noen egenskaper enda.'
            />
            <SpeciesPanel
              species={species}
              speciesImages={speciesImages}
              isCollapsed={isSpeciesPanelToggled}
              onToggleClick={this.toggleSpeciesPanel}
              onSpeciesClick={this.onSpeciesSelected}
              totalSpecies={totalSpecies}
              foundSpecies={foundSpecies}
              emptyDescription='Ingen arter funnet med valgte egenskaper'
            />
            <TraitDialog
              isVisible={isTraitDialogVisible}
              onCancelDialog={this.onTraitSelected}
              onValueSelected={this.onValueSelected}
              title={selectedTrait ? selectedTrait.traitText : ''}
              traitValues={selectedTrait ? selectedTrait.values : []}
              selectedValue={selectedValue}
              valueImages={valueImages}
              activeValues={activeValues}
              onInfo={this.onValueInfo}
            />
          </View>
        </View>
      </StyleProvider>
    );

  }
}

function mapStateToProps({ key }) {
  const isUnfiltered = key.speciesLeft.length === 0 && key.chosenValues.length === 0;
  return ({
    keyId: key.chosenKey,
    species: isUnfiltered ? key.fullSpList : key.speciesLeft,
    totalSpecies: key.fullSpList.length,
    foundSpecies: key.speciesLeft.length,
    title: key.chosenKeyTitle,
    traits: key.traitValueCombo,
    speciesImages: key.spesiecImageList,
    valueImages: key.valueImages,
    chosenValues: key.chosenValues,
    chosenTraits: key.chosenTraits,
    activeTraits: isUnfiltered ? key.traitValueCombo : key.relevant,
    activeValues: key.spValues,
  });
};

function mapDispatchToProps(dispatch) {
  return {
	  actions: bindActionCreators({ ...KeyAction}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Key2);
