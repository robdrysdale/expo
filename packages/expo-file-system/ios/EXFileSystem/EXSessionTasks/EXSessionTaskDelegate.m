// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXSessionTaskDelegate.h"

@implementation EXSessionTaskDelegate

- (instancetype)initWithResolve:(UMPromiseResolveBlock)resolve withReject:(UMPromiseRejectBlock) reject withOnFinish:(EXTaskCompleted)onTaskCompleted;
{
  if (self = [super init]) {
    self.resolve = resolve;
    self.reject = reject;
    self.onTaskCompleted = onTaskCompleted;
  }
  
  return self;
}

@end
