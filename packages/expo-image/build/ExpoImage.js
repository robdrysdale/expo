import React from 'react';
import { Image, requireNativeComponent, StyleSheet } from 'react-native';
const NativeExpoImage = requireNativeComponent('ExpoImage');
export default function ExpoImage({ source, style, ...props }) {
    const resolvedSource = Image.resolveAssetSource(source ?? {});
    let resolvedStyle = style;
    if (!Array.isArray(resolvedSource)) {
        const { width, height } = resolvedSource;
        resolvedStyle = StyleSheet.flatten([{ width, height }, style]);
    }
    return <NativeExpoImage {...props} source={resolvedSource} style={resolvedStyle}/>;
}
//# sourceMappingURL=ExpoImage.js.map