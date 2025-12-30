package com.ai.emotion;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class EmotionController {
  @PostMapping("/adapt")
  public EmotionResponse adapt(@RequestBody EmotionRequest req) {
    EmotionResponse res = new EmotionResponse();
    switch(req.emotion) {
      case "stressed": res.theme="calm"; res.message="Relax UI Enabled"; break;
      case "bored": res.theme="energetic"; res.message="Fun UI Enabled"; break;
      case "confused": res.theme="help"; res.message="Help UI Enabled"; break;
      default: res.theme="normal"; res.message="Normal UI";
    }
    return res;
  }
}
