// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXSessionDownloadTaskDelegate.h"

@interface EXSessionDownloadTaskDelegate ()

@property (strong, nonatomic) NSURL *serverUrl;
@property (strong, nonatomic) NSURL *fileUrl;
@property (nonatomic) BOOL md5Option;

@end

@implementation EXSessionDownloadTaskDelegate

- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite {

}
  
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location {
  NSError *error;
  [[NSFileManager defaultManager] moveItemAtURL:location toURL:self.fileUrl error:&error];
  if (error) {
    self.reject(@"E_UNABLE_TO_SAVE",
          [NSString stringWithFormat:@"Unable to save file to local URI. '%@'", error.description],
          error);
    return;
  }
}

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  if([error description] != nil) {
    //"cancelled" description when paused.  Don't throw.
    if ([error.localizedDescription isEqualToString:@"cancelled"]) {
      self.onTaskCompleted(self);
      self.resolve([NSNull null]);
    } else {
      self.reject(@"E_UNABLE_TO_DOWNLOAD",
             [NSString stringWithFormat:@"Unable to download from: %@. '%@", self.serverUrl.absoluteString, error.description],
             error);
    }
  }
}



@end
