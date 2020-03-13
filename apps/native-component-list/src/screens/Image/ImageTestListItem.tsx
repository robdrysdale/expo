import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  Image as ExpoImage,
  TouchableOpacity,
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

//import ExpoImage from 'expo-image';
import { Colors } from '../../constants';
import ImageTestView from './ImageTestView';
import { resolveProps } from './resolveProps';
import { ImageTest } from './types';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

type PropsType = NavigationScreenProps & {
  test: ImageTest;
  tests: ImageTest[];
  animValue?: Animated.Value;
};

export default class ImageTestListItem extends React.Component<PropsType> {
  onPress = () => {
    const { test, tests, navigation } = this.props;
    navigation.push('ImageTest', {
      test,
      tests,
    });
  };

  render() {
    const { test, animValue } = this.props;
    const imageProps = resolveProps(test.props, animValue);
    return (
      <TouchableOpacity style={styles.container} activeOpacity={0.5} onPress={this.onPress}>
        <View style={styles.header}>
          <Text style={styles.title}>{test.name}</Text>
        </View>
        <View style={styles.content}>
          <ImageTestView
            style={styles.image}
            imageProps={imageProps}
            ImageComponent={AnimatedExpoImage}
          />
          <View style={styles.spacer} />
          <ImageTestView
            style={styles.image}
            imageProps={imageProps}
            ImageComponent={Animated.Image}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    color: Colors.disabled,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  spacer: {
    width: 10,
  },
  image: {
    width: (Dimensions.get('window').width - 30) / 2,
    height: 160 - 10 - 32,
  },
});
