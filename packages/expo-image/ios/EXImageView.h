// Copyright 2020-present 650 Industries. All rights reserved.

#import <SDWebImage/SDWebImage.h>
#import <React/RCTResizeMode.h>

@interface EXImageView : SDAnimatedImageView

- (void)setSource:(NSDictionary *)sourceMap;
- (void)setResizeMode:(RCTResizeMode)resizeMode;

@end
