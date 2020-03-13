import { ImageTestGroup, ImageTestPropsFnInput } from '../types';
import images from './images';

const imageTests: ImageTestGroup = {
  name: 'Sources',
  tests: [
    {
      name: `require(1.jpg)`,
      props: {
        source: images.require_jpg1,
      },
    },
    {
      name: `require(2.jpg)`,
      props: {
        source: images.require_jpg2,
      },
    },
    {
      name: `require(.png)`,
      props: {
        source: images.require_png,
      },
    },
    {
      name: `uri:.png`,
      props: {
        source: images.uri_png,
      },
    },
    {
      name: `uri:.jpg`,
      props: {
        source: images.uri_jpg,
      },
    },
    {
      name: `uri:.gif`,
      props: {
        source: images.uri_gif,
      },
    },
    {
      name: `uri:.ico`,
      props: {
        source: images.uri_ico,
      },
    },
  ],
};

export default imageTests;
