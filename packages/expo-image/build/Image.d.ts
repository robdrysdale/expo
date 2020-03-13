import React from 'react';
import { AccessibilityProps, ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
export interface ImageProps extends AccessibilityProps {
    source?: ImageSourcePropType | null;
    style?: StyleProp<ImageStyle>;
    resizeMode?: ImageResizeMode;
}
export default class Image extends React.Component<ImageProps> {
    render(): JSX.Element;
}
