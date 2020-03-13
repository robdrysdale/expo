package expo.modules.image;

import android.widget.ImageView;
import android.widget.ImageView.ScaleType;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;

import java.util.HashMap;
import java.util.Map;

public class ExpoImageTypes {

  private static final Map<String, ImageView.ScaleType> RESIZE_MODE =
    new HashMap<String, ImageView.ScaleType>() {{
      put("contain", ScaleType.FIT_CENTER);
      put("cover", ScaleType.CENTER_CROP);
      put("stretch", ScaleType.FIT_XY);
      put("center", ScaleType.CENTER);
    }};

  public static ScaleType getScaleType(String resizeMode) {
    ImageView.ScaleType value = RESIZE_MODE.get(resizeMode);
    if (value == null)
      throw new JSApplicationIllegalArgumentException("ExpoImage, invalid resizeMode: " + resizeMode);
    return value;
  }
}
