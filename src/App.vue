<template>
  <div id="app" class="mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout-icon">
        <img class="logo" src="assets/icon.png" />
      </div>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">Video Intelligence</span>
      </div>
    </header>

    <div id="video-conatiner">
      <canvas id="my_canvas" width="800" height="500"></canvas>
      <!-- autoplay -->
      <video controls ref="video" @canplay="handleVideoCanPlay"></video>
    </div>

    <div id="upload-data">
      <h5>Select one of the followings videos</h5>

      <ul>
        <li>
          <a
            onclick='load("Machine%20Learning%20Solving%20Problems%20Big%2C%20Small%2C%20and%20Prickly.mp4")'
            >Machine%20Learning%20Solving%20Problems%20Big%2C%20Small%2C%20and%20Prickly.mp4</a
          >
        </li>
      </ul>
    </div>

    <div v-if="data_misaligned" class="data-warning">
      It looks like the json data dosn't align with the video file, are you sure
      you have all of the right files uploaded?
    </div>

    <annotations-nav
      v-bind:title_ids_dict="title_ids_dict"
      v-bind:detected_features="detected_features"
      v-bind:current_view="current_view"
      v-on:nav-clicked="set_current_view"
    >
    </annotations-nav>

    <!-- object-tracking-viz
      v-if="current_view == 'Object Tracking'"
      id="object_tracks"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:segment-clicked="jump_video"
    ></object-tracking-viz>

    <label-detection-viz
      v-if="current_view == 'Label Detection'"
      id="label_detection"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:segment-clicked="jump_video"
    ></label-detection-viz>

    <shot-detection-viz
      v-if="current_view == 'Shot Detection'"
      id="shot_detection"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:shot-clicked="jump_video"
    ></shot-detection-viz>

    <speech-transcription-viz
      v-if="current_view == 'Speech Transcription'"
      id="speech_transcription"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:word-clicked="jump_video"
    >
    </speech-transcription-viz>

    <person-detection-viz
      v-if="current_view == 'Person Detection'"
      id="person_detection"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:segment-clicked="jump_video"
    >
    </person-detection-viz>

    <face-detection-viz
      v-if="current_view == 'Face Detection'"
      id="face_detection"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:segment-clicked="jump_video"
    >
    </face-detection-viz>

    <logo-recognition-viz
      v-if="current_view == 'Logo Recognition'"
      id="logo_recognition"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:segment-clicked="jump_video"
    >
    </logo-recognition-viz>

    <text-detection-viz
      v-if="current_view == 'Text Detection'"
      id="text_detection"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:segment-clicked="jump_video"
    >
    </text-detection-viz>

    <explicit-content-detection-viz
      v-if="current_view == 'Explicit Content Detection'"
      id="explicit_content_detection"
      v-bind:json_data="json_data"
      v-bind:video_info="video_info"
      v-on:shot-clicked="jump_video"
    >
    </explicit-content-detection-viz-->
  </div>
</template>

<script lang="ts">
import {
  fetch_json,
  load_video_from_url,
  load_video_dragged,
  load_json_dragged,
  drag_enter,
  drop_video,
  drop_json,
} from "./utils/videoUtils";

import "./utils/utils.js";
import ObjectTrackingViz from "./components/ObjectTrackingViz.vue";
import LabelDetectionViz from "./components/LabelDetectionViz.vue";
import ShotDetectionViz from "./components/ShotDetectionViz.vue";
import SpeechTranscriptionViz from "./components/SpeechTranscriptionViz.vue";
import PersonDetectionViz from "./components/PersonDetectionViz.vue";
import FaceDetectionViz from "./components/FaceDetectionViz.vue";
import LogoRecognitionViz from "./components/LogoRecognitionViz.vue";
import TextDetectionViz from "./components/TextDetectionViz.vue";
import ExplicitContentDetectionViz from "./components/ExplicitContentDetectionViz.vue";
import AnnotationsNav from "./components/AnnotationsNav.vue";

export default {
  components: {
    AnnotationsNav,
    ObjectTrackingViz,
    LabelDetectionViz,
    ShotDetectionViz,
    SpeechTranscriptionViz,
    PersonDetectionViz,
    FaceDetectionViz,
    LogoRecognitionViz,
    TextDetectionViz,
    ExplicitContentDetectionViz,
  },
  data() {
    return {
      json_data: {},
      video_info: { width: 800, height: 500, length: 252 },
      video_length: 252,
      current_view: "Label Detection",
      title_ids_dict: {
        "Label Detection": "shot_label_annotations",
        "Shot Detection": "shot_annotations",
        "Object Tracking": "object_annotations",
        "Person Detection": "person_detection_annotations",
        "Face Detection": "face_detection_annotations",
        "Logo Recognition": "logo_recognition_annotations",
        "Speech Transcription": "speech_transcriptions",
        "Text Detection": "text_annotations",
        "Explicit Content Detection": "explicit_annotation",
      },
    };
  },
  methods: {
    jump_video: function (event_data) {
      document
        .querySelector("video")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      jump_video_to_time(event_data.seconds);
    },
    set_current_view: function (new_view) {
      this.current_view = new_view;
      router.push({ hash: "#" + new_view });
    },
    handleVideoInput(event) {
      const videoElement = this.$refs.video;
      load_video_dragged(event, videoElement);
    },
    handleJsonInput(event) {
      load_json_dragged(event).then((json) => {
        this.json_data = json;
        // Handle the JSON validity check here
        // ...
      });
    },
    handleVideoDrop(event) {
      const videoInputElement = this.$refs.videoInput;
      drop_video(event, videoInputElement);
    },
    handleJsonDrop(event) {
      const jsonInputElement = this.$refs.jsonInput;
      drop_json(event, jsonInputElement);
    },
    load_json_from_url(url) {
      const jsonData = fetch_json_url(url);
      this.json_data = jsonData;

      if (!("annotation_results" in json_data)) {
        alert(
          "❌ Format of json is not compatible, make sure you are setting the 'output_uri' \
configuration when calling the Video Intelligence API so that it \
outputs a .json file direction to Google Cloud Storage. \
Find links to script examples at the top right of the screen."
        );

        json_input.value = null;
      }
    },
  },
  mounted() {
    const videoElement = this.$refs.video;
    videoElement.oncanplay = () => {
      // Handle the video oncanplay event here
      // ...
    };

    // Initialization
    // load_json_from_url(this.json_data, "assets/test_json.json");
    // load_video_from_url(videoElement, "assets/test_video.mp4");

    // Check for hash code in URL
    if (this.$route.hash) {
      const hash_value = decodeURI(this.$route.hash.substring(1));
      if (hash_value in this.title_ids_dict) {
        this.current_view = hash_value;
      }
    }
  },
  computed: {
    data_misaligned() {
      console.log("delt");
      if (this.json_data)
        if (this.json_data.annotation_results) {
          const delta =
            this.video_info.length -
            this.json_data.annotation_results[0].segment.end_time_offset
              .seconds;
          console.log("delt", delta);
          if (Math.abs(delta) > 2) {
            return true;
          }
        }
      return false;
    },
    detected_features() {
      let features = [];

      if (!this.json_data.annotation_results) return features;

      this.json_data.annotation_results.forEach((annotations) => {
        console.log(Object.keys(annotations));
        features = features.concat(Object.keys(annotations));
      });

      return features;
    },
  },
};
</script>

<style scoped>
body {
  text-align: center;
  min-height: 1500px;
  min-width: 1130px;
}

h1,
h2,
h3,
h4,
h5 {
  color: #5d5d5d;
}

#video-conatiner {
  position: relative;
  width: 800px;
  margin: 15px;
  display: inline-block;
}

#video-conatiner > canvas {
  width: 100%;
  position: absolute;
  opacity: 0.8;
  left: 0;
  height: 100%;
  pointer-events: none;
}

video {
  width: 100%;
  margin: auto;
  display: block;
}

video::-webkit-media-controls-fullscreen-button {
  display: none !important;
}

.mdl-layout__header {
  background-color: rgb(255 255 255);
  color: #5d5d5d;
  font-weight: 100;
}

#upload-data {
  display: inline-block;
  text-align: center;
  vertical-align: top;
  width: 250px;
}

#upload-data > p {
  text-align: justify;
}

.logo {
  width: inherit;
}

.upload-area {
  /* display: inline-block; */
  width: 200px;
  /* height: 62px; */
  border: dashed #ededed 3px;
  border-radius: 5px;
  padding: 15px;
  margin: 15px;
  overflow: hidden;
}

.data-warning {
  background-color: #ffffc3;
  /* display: inline-block; */
  margin: auto;
  position: relative;
  padding: 15px;
  text-align: center;
}
</style>
