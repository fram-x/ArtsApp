import React from 'react';
import { Animated, View, Text } from 'react-native';

import HorizontalList from '../HorizontalList';
import TraitPanelElement from '../TraitPanelElement';

import styles  from './styles.js';

type Props = {
  traits: Array,
  traitImages: Map,
  chosenValues: Array,
  valueImages: Map,
  onSelect: Function,
  header: String,
  emptyHeader: String,
  emptyDescription: String,
  heightAnimation: Animated.AnimatedValue,
}

class TraitPanel extends React.Component<Props> {

  handleTraitSelected = (trait) => {
    const { onSelect } = this.props;
    onSelect && onSelect(trait);
  }

  renderItem = (item) => {
    const { valueImages, chosenValues, heightAnimation } = this.props;

    const selectedValue = item.values.find(val => chosenValues.indexOf(val.value_id) > -1);

    const imagePaths = valueImages.get(selectedValue.value_id);
    let imagePath = null;
    if (imagePaths) imagePath = imagePaths[0];

    return (
      <TraitPanelElement
        trait={item}
        heightAnimation={heightAnimation}
        selectedValue={selectedValue}
        imagePath={imagePath}
        onPress={() => this.handleTraitSelected(item)}
      />
    );
  }

  render() {
    const { traits, header, emptyHeader, emptyDescription, heightAnimation } = this.props;

    const heightInterpolation = heightAnimation.interpolate({
      inputRange: [0, 60],
      outputRange: [140, 60],
      extrapolate: 'clamp'
    });

    const headerInterpolation = heightAnimation.interpolate({
      inputRange: [0, 60],
      outputRange: [0, -90],
      extrapolate: 'clamp',
    });

    const opacityInterpolation = heightAnimation.interpolate({
      inputRange: [0, 60],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const heightStyle = { height: heightInterpolation };
    const headerStyle = { marginTop: headerInterpolation, opacity: opacityInterpolation };

    return (
      <Animated.View style={[styles.container, heightStyle]}>
        {traits.length === 0 &&
        <View style={styles.emptyContainer}>
          <Text style={styles.header}>{emptyHeader}</Text>
          <Text style={styles.description}>{emptyDescription}</Text>
        </View>
        }
        {traits.length > 0 && header &&
        <Animated.View style={[styles.headerContainer, headerStyle]}>
          <Text style={styles.label}>{header}</Text>
        </Animated.View>
        }
        {traits.length > 0 &&
          <HorizontalList
            data={traits}
            keyExtractor={(item) => item.trait_id}
            renderItem={({item}) => this.renderItem(item)}
          />
        }
      </Animated.View>
    );
  }

}

export default TraitPanel;
