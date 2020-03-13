import React from 'react';
import { Image, requireNativeComponent, StyleSheet } from 'react-native';

import { ImageProps } from './Image';

const NativeExpoImage = requireNativeComponent('ExpoImage');

export default function ExpoImage({ source, style, ...props }: ImageProps) {
  const resolvedSource = Image.resolveAssetSource(source ?? {});
  let resolvedStyle = style;

  if (!Array.isArray(resolvedSource)) {
    const { width, height } = resolvedSource;
    resolvedStyle = StyleSheet.flatten([{ width, height }, style]);
  }

  return <NativeExpoImage {...props} source={resolvedSource} style={resolvedStyle} />;
}
