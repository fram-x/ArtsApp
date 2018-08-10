import React from 'react';
import { SafeAreaView } from 'react-native';

import { Actions } from 'react-native-router-flux';

import KeyHeader from '../../components/KeyHeader';
import TraitPanel from '../../components/TraitPanel';
import TraitList from '../../components/TraitList';
import SpeciesPanel from '../../components/SpeciesPanel';
import TraitDialog from '../../components/TraitDialog';

import styles  from './styles.js';

class Key2 extends React.Component {

  onClose = () => {
    Actions.pop();
  }

  render() {

    return (
      <SafeAreaView style={styles.container}>
        <KeyHeader
          title="Nøkler"
          closeTitle="Lukk"
          onClose={this.onClose}
        />
        <TraitPanel />
        <TraitList />
        <SpeciesPanel />
        <TraitDialog />
      </SafeAreaView>
    );

  }
}

export default Key2;
