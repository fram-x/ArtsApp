import React from 'react';
import { Animated, TouchableOpacity, View, Image, Text } from 'react-native';

import styles  from './styles.js';

import { mapToImageSource } from '../../utilities/image';

type Props = {
  trait: Object,
  selectedValue: Object,
  heightAnimation: Animated.AnimatedValue,
  imagePath: String,
  onPress: Function,
};

class TraitPanelElement extends React.Component<Props> {

  render() {
    const { trait, imagePath, selectedValue, onPress, heightAnimation } = this.props;
    const source = mapToImageSource(imagePath);

    const inputRange = [0, 60];
    const imageSizeInterpolation = heightAnimation.interpolate({
      inputRange,
      outputRange: [57, 0],
      extrapolate: 'clamp',
    });

    const headerInterpolation = heightAnimation.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 0],
      extrapolate: 'clamp',
    });

    const opacityInterpolation = heightAnimation.interpolate({
      inputRange: [0, 30, 60],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    const headerStyle = { marginTop: headerInterpolation, opacity: opacityInterpolation };

    const smallImageContainerSizeInterpolation = heightAnimation.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 14],
      extrapolate: 'clamp',
    });

    const smallImageContainerSize = {
      height: smallImageContainerSizeInterpolation,
      width: smallImageContainerSizeInterpolation,
      borderRadius: smallImageContainerSizeInterpolation,
    };

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
          <View style={styles.contentContainer}>
            <Animated.View style={[styles.imageContainer, headerStyle]}>
              {source && source.uri &&
                <Animated.Image
                  collapsable={false}
                  source={source}
                  style={styles.image}/>
              }
            </Animated.View>
            <View style={styles.itemContainer}>
          <Animated.View style={[styles.smallImageContainer, smallImageContainerSize]}/>
          <View style={styles.textContainer}>
            <Text
              style={styles.text}
              numberOfLines={1}
              ellipsizeMode='tail'
            >{trait.traitText}
            </Text>
            <Text
              style={styles.value}
              numberOfLines={1}
              ellipsizeMode='tail'
            >{selectedValue && selectedValue.valueText}
            </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

}

export default TraitPanelElement;
