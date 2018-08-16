import React from 'react';
import { Animated, ScrollView, TouchableOpacity, View, Text } from 'react-native';

import TraitListElement from '../TraitListElement';
import TraitPanel from '../TraitPanel';

import styles  from './styles.js';

type Props = {
  traits: Array,
  HeaderComponent: Component,
  activeTraits: Array,
  activeValues: Array,
  onSelect: Function,
}

type State = {
  clampedScroll: Object,
}

class TraitList extends React.Component<Props, State> {

  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  constructor(props) {
    super(props);

    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        60,
      ),
    };
  }

  componentDidMount() {
    this.state.scrollAnim.addListener(({ value }) => {
      // This is the same calculations that diffClamp does.
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        60,
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    // Don't forget to remove the listeners!
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }

  onMomentumScrollEnd = () => {
    console.log(this._scrollValue);
    const toValue = this._scrollValue > 60 &&
      this._clampedScrollValue > (60) / 2
      ? this._offsetValue + 60
      : this._offsetValue - 60;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this.onMomentumScrollEnd, 50);
  };

  onMomentumScrollBegin = () => {
    if(this._scrollEndTimer) {
      clearTimeout(this._scrollEndTimer);
    }
  };

  onPress = (item) => {
    const { onSelect } = this.props;
    onSelect && onSelect(item);
  }

  renderItem = (item) => {
    const { activeTraits, activeValues } = this.props;
    const isTraitActive = activeTraits.indexOf(item) > -1;

    // Find number of values that are active
    let activeValueCount = item.values.length;
    if(isTraitActive) {
      if(activeValues.length > 0) {
        // Then we know something is filtered
        activeValueCount = item.values.reduce((ag, value) =>
          (activeValues.indexOf(value.value_id) > -1 ? 1 : 0) + ag, 0);
      }
    }
    else {
      activeValueCount = 0;
    }

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => this.onPress(item)}
      >
        <TraitListElement
          title={item.traitText}
          total={item.values.length}
          included={activeValueCount}
          activeValues={activeValues}
          isActive={isTraitActive}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { traits, unusedTraits, chosenValues, onSelect, valueImages, header, emptyHeader, emptyDescription } = this.props;
    const traitPairs = this.reshape(unusedTraits, 2);

    return (
      <View style={styles.container}>
        <TraitPanel
          traits={traits}
          chosenValues={chosenValues}
          onSelect={onSelect}
          valueImages={valueImages}
          header='Valgte egenskaper:'
          emptyHeader='Egenskaper ved arter'
          emptyDescription='Du har ikke valgt noen egenskaper enda.'
          heightAnimation={this.state.clampedScroll}
          ref={(ref) => this._header = ref}
        />
        <ScrollView
          scrollEventThrottle={16}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
            { useAnimatedDriver: true }
          )}
        >
          {traitPairs.map( traitPair => (
            <View style={styles.rowWrapper} key={traitPair[0].trait_id}>
              {this.renderItem(traitPair[0])}
              {traitPair.length == 2 && this.renderItem(traitPair[1])}
            </View>
          ))}
          <View style={styles.footer}/>
        </ScrollView>
      </View>
    );
  }

  reshape = (arr, cols) => {
    var copy = arr.slice(0); // Copy all elements.
    const retVal = [];
    for (let r = 0; r < arr.length; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (i < copy.length) {
          row.push(copy[i]);
        }
      }
      retVal.push(row);
    }
    return retVal.filter(a => a.length > 0);
  };
}

export default TraitList;
