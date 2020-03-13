import React from 'react';
import {
  AccessibilityProps,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';

import ExpoImage from './ExpoImage';

export interface ImageProps extends AccessibilityProps {
  // On one hand we want to pass resolved source to native module.
  // On the other hand, react-native-web doesn't expose a resolveAssetSource
  // function, so we can't use it there. So we pass the unresolved source
  // to "native components" and they decide whether to resolve the value
  // or not.
  source?: ImageSourcePropType | null;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
}

export default class Image extends React.Component<ImageProps> {
  render() {
    const { style, resizeMode: resizeModeProp, ...restProps } = this.props;

    const { resizeMode: resizeModeStyle, ...restStyle } = StyleSheet.flatten([style]) || {};
    const resizeMode = resizeModeProp || resizeModeStyle || 'cover';

    return <ExpoImage {...restProps} style={restStyle} resizeMode={resizeMode} />;
  }
}
