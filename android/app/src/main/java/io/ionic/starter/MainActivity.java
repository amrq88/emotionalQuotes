package io.ionic.starter;

import com.getcapacitor.BridgeActivity;

import android.os.Bundle;
import com.ahm.capacitor.camera.preview.CameraPreview;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
@Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      add(CameraPreview.class);
    }});
  }
}
