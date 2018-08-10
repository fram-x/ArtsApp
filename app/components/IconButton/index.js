import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';

import styles  from './styles.js';

type Props = {
  source: ImageSourcePropType,
  label: String,
  onPress: Function,
};

class IconButton extends React.Component<Props> {

  render() {
    const { source, label, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Image source={source} style={styles.image}/>
        {label && <Text>{label}</Text>}
      </TouchableOpacity>
    );
  }
}

export default IconButton;
