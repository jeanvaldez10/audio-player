function(instance, context) {
  // initialize states

  $(document).ready(function() {
    window.videojs.log.level('off');
  });

  const playerId = "universal-audio" + Math.floor(Math.random() * 100000001);
  instance.data.playerId = playerId;
  instance.publishState("playerId", playerId);

  // function to return file extension of a url
  instance.data.getExtension = (path) => {
    const basename = path.split(/[\\/]/).pop(); // extract file name from full path
    const pos = basename.lastIndexOf("."); // get last position of `.`

    if (basename === "" || pos < 1) {
      // if file name is empty or not `.` return empty ext
      return "";
    }

    return basename.slice(pos + 1); // return ext
  };

  instance.data.resizePlayer = function resizeVideoJS() {
    const player = instance.data.player;
    if (!player || player.isFullscreen()) {
      return;
    }
    let height = player.currentHeight();
    const parent = instance.canvas.parent(".bubble-r-box");
    if (parent.length) {
      parent.css("height", height);
      parent.css("max-height", "fit-content");
      parent.css("min-height", "fit-content");
      parent.css("overflow", 'visible');
      const grandParent = parent.parent(".bubble-r-line");
      if (grandParent.length) {
        grandParent.css("height", height);
        grandParent.css("max-height", "fit-content");
        grandParent.css("min-height", "fit-content");
        grandParent.css("overflow", 'visible');
      }
    }
    instance.canvas.css("height", height);
    instance.canvas.css("max-height", "fit-content");
    instance.canvas.css("min-height", "fit-content");
    instance.canvas.css("overflow", 'visible');
  };

  instance.data.forwardRewind = (delta) => {
    const player = instance.data.player;
    if (!player) {
      return;
    }
    let time = player.currentTime() + delta;

    if (time < 0) {
      time = 0;
    }
    player.currentTime(time);
  };

  instance.data.secondsToTime = (secs, split) => {
    var hours = Math.floor(secs / 3600);
    hours >= 1 ? (secs = secs - hours * 3600) : (hours = "");
    hours > 0 && hours < 10 ? (hours = "0" + hours) : hours;

    var min = Math.floor(secs / 60);
    min >= 1 ? (secs = secs - min * 60) : (min = "00");
    if (!split) {
      secs > 0 && secs < 10
        ? (secs = "0" + Math.floor(secs))
        : (secs = Math.floor(secs));
    } else {
      secs > 0 && secs < 10
        ? (secs = "0" + secs.toFixed(2))
        : (secs = secs.toFixed(2));
    }
    min > 0 && min < 10 ? (min = "0" + min) : min;

    if (hours < 1) {
      return min + ":" + secs;
    } else {
      return hours + ":" + min + ":" + secs;
    }
  };

  instance.data.updateOptions = (properties) => {
    const player = instance.data.player;
    if (!player) {
      return;
    }
    let {
      muted,
      speed,
      loop,
      volume,
      forcePause,
      forcePlay,
      theme,
      progressBarColor,
      barColor,
      override_style,
      css_skin_file,
    } =properties;
    try {
      player.controls(true);
      player.loop(loop);
      player.volume(volume || 0);
      player.muted(muted);
      player.playbackRate(speed || 1);
      player.audioOnlyMode(true);
      player.fluid(true);

      if (forcePause) {
        player.pause();
      } else if (forcePlay){
        player.play();
      }
    } catch (e) {
      console.log(e);
    }
    const videoContainer = document.getElementById(instance.data.playerId);

    videoContainer.classList.remove("vjs-theme-base");
    videoContainer.classList.remove("vjs-theme-city");
    videoContainer.classList.remove("vjs-theme-fantasy");
    videoContainer.classList.remove("vjs-theme-forest");
    videoContainer.classList.remove("vjs-theme-sea");
    videoContainer.classList.remove("vjs-theme-dt");
    videoContainer.classList.remove("vjs-theme-custom");
    $(`link#vjs-theme-custom-${playerId}`).remove();
    // load theme
    if (theme === "Base") {
      videoContainer.classList.add("vjs-theme-base");
    } else if (theme === "City") {
      videoContainer.classList.add("vjs-theme-city");
    } else if (theme === "Fantasy") {
      videoContainer.classList.add("vjs-theme-fantasy");
    } else if (theme === "Forest") {
      videoContainer.classList.add("vjs-theme-forest");
    } else if (theme === "Sea") {
      videoContainer.classList.add("vjs-theme-sea");
    } else if (theme === "Digital Theatre") {
      videoContainer.classList.add("vjs-theme-dt");
    } else if (theme === "Custom") {
      if (css_skin_file) {
        var head = document.getElementsByTagName("head")[0];
        var style = document.createElement("link");
        style.href = css_skin_file;
        style.type = "text/css";
        style.rel = "stylesheet";
        style.id = `vjs-theme-custom-${playerId}`;
        head.append(style);
        videoContainer.classList.add("vjs-theme-custom");
      }
    }

    if (override_style) {
      if (barColor) {
        instance.canvas
            .find(".vjs-control-bar")
            .css("background-color", barColor);
      }

      if (progressBarColor) {
        instance.canvas
            .find(".vjs-play-progress")
            .css("background-color", progressBarColor);
      }
    }
  };

  instance.data.updatePlugins = (properties) => {
    const player = instance.data.player;
    if (!player) {
      return;
    }

    let {
      apply_seek_button,
      apply_source_selector,
      apply_hotkeys,
      apply_ab_loop,
      apply_airplay,
      apply_vr,
    } = properties;

    if (apply_seek_button && !player.activePlugins_?.seekButtons) {
      const { forward, back } = properties;
      player.seekButtons({
        forward,
        back,
      });
    }

    if (apply_source_selector && !player.activePlugins_?.httpSourceSelector) {
      player.httpSourceSelector({ default: "auto" }); // hls, dash source selector.
      player.qualityLevels(); // hls quality levels
    }

    if (apply_hotkeys && !player.activePlugins_?.hotkeys) {
      const { volumeStep = 0.1, seekStep = 5 } = properties;
      player.hotkeys({
        volumeStep,
        seekStep,
        enableModifiersForNumbers: false,
      });
    }
    if (apply_ab_loop && !player.activePlugins_?.abLoopPlugin) {
      player.abLoopPlugin();
    }

    if (apply_airplay && !player.activePlugins_?.airPlay) {
      player.airPlay();
    }

    if (apply_vr && !player.activePlugins_?.vr) {
      const {
        projection,
        motionControls,
        omnitone,
        sphereDetail = 32,
        forceCardboard,
      } = properties;

      player.vr({
        projection,
        omnitone: omnitone && Omnitone,
        motionControls,
        sphereDetail,
        forceCardboard,
        nav: true,
        nav_position: "left"
      });
    }
  };

  instance.data.updateVideojs = (properties) => {
    const {
      audioSource = "",
      mime_type,
    } = properties;
    instance.data.playlist = audioSource?.split(",") || [""];

    // if source changed
    if (audioSource !== instance.data.properties?.audioSource) {
      instance.data.counter = 0;
      instance.publishState("counter", 0);
    }

    instance.publishState("counter", instance.data.counter);

    const currentSrc = instance.data.playlist.find(
        (item, index) => index === instance.data.counter
    );


    if (!instance.data.player && !currentSrc) {
      return;
    }
    if (currentSrc !== instance.data.currentSrc) {
      instance.data.currentSrc = currentSrc;
      let video_url = currentSrc
          ?.replace(/\r?\n|\r/g, ",")
          .trim()
          ?.replace(/,\s/g, ",");
      const url = video_url?.trim()?.replace(/\r?\n|\r/g, "");
      let ext = instance.data.getExtension(video_url).toLowerCase();
      let media_type;
      instance.publishState("current_url", url);

      instance.data.initPlayer(properties);

      let player = instance.data.player;
      let sourceObject;

      if (ext === "mp3") {
        sourceObject = {
          src: url,
          type: "audio/mp3",
        };
        instance.publishState("media_type", "audio");
        media_type = 'audio';
      } else if (ext === "wav") {
        sourceObject = {
          src: url,
          type: "audio/wav",
        };
        instance.publishState("media_type", "audio");
        media_type = 'audio';
      } else if (ext === "aac") {
        sourceObject = {
          src: url,
          type: "audio/aac",
        };
        instance.publishState("media_type", "audio");
        media_type = 'audio';

      } else if (ext === "m3u") {
        sourceObject = {
          src: url,
          type: "audio/x-mpegURL",
        };
        instance.publishState("media_type", "audio");
        media_type = 'audio';

      } else if (ext === "flac") {
        sourceObject = {
          src: url,
          type: "audio/flac",
        };
        instance.publishState("media_type", "audio");
        media_type = 'audio';

      } else if (ext === "m3u8") {
        sourceObject = {
          src: url,
          type: "application/x-mpegURL",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';

      } else if (ext === "mpd") {
        sourceObject = {
          src: url,
          type: "application/dash+xml",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';

      } else if (ext === "mov") {
        sourceObject = {
          src: url,
          type: "video/mp4",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';

      } else if (ext === "mp4" || ext === "m4v") {
        sourceObject = {
          src: url,
          type: "video/mp4",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';

      } else if (
          ext.includes("raw=1") ||
          ext.includes("dl=0") ||
          ext.includes("dl=1")
      ) {
        ext = "mp4";
        sourceObject = {
          src: url,
          type: "video/mp4",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';
      } else if (ext === "mkv") {
        sourceObject = {
          src: url,
          type: "video/mp4",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';

      } else if (ext === "f4m") {
        sourceObject = {
          src: url,
          type: "application/adobe-f4m",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';
      } else if (ext === "webm") {
        sourceObject = {
          src: url,
          type: "video/webm",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';
      } else if (ext === "ogg") {
        sourceObject = {
          src: url,
          type: "video/ogg",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';
      } else if (ext === "flv") {
        sourceObject = {
          src: url,
          type: "video/flv",
        };
        instance.publishState("media_type", "html5");
        media_type = 'html5';
      } else if (mime_type) {
        sourceObject = {
          src: url,
          type: mime_type,
        };
        instance.publishState("media_type", mime_type);
        media_type = 'html5';
      } else {
        instance.publishState("media_type", "unknown");
        media_type = 'unknown';
      }
      instance.publishState("file_extension", ext);
      instance.data.ext = ext;
      instance.data.media_type = media_type;
      player.src(sourceObject);
    }

    instance.data.updatePlugins(properties);
    instance.data.updateOptions(properties);

    instance.data.properties = properties;
  };

  // init player FUNCTION
  instance.data.initPlayer = function (properties) {

    if (instance.data.player) {
        instance.data.player.resetAd && instance.data.player.resetAd();
      instance.data.player.dispose();
    }
    //instance.data.player = null;
    instance.publishState("current_time", 0);
    instance.publishState("loadedmetadata", false);
    instance.publishState("loadeddata", false);
    instance.publishState("audio_duration_second", 0);
    instance.publishState("audio_duration_format", "");
    instance.publishState("ended", false);
    instance.publishState("playing", false);
    instance.publishState("paused", false);
    instance.publishState("error_type", "");
    instance.publishState("error_message", "");
    instance.publishState("error_message", "");
    instance.publishState("file_extension", "");
    instance.publishState("remaining_time_format", "");
    instance.publishState("remaining_time", 0);
    instance.publishState("volume", 0);
    instance.publishState("speed", 0);
    instance.publishState("player_width", 0);
    instance.publishState("player_width", 0);
    instance.publishState("seeking", false);

    instance.canvas.empty();


      let {
          autoplay,
          muted,
          loop,
          apply_vr
      } = properties;

      const videoPlayer = $(
      `<video id="${playerId}" class='video-js vjs-big-play-centered' playsinline ${apply_vr ? "crossorigin='anonymous'" : ""}><p class="vjs-no-js">
                            To view this video please enable JavaScript, and
                            consider upgrading to a web browser that
                        <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                </p></video>`
    );

    if (autoplay === "false") {
      autoplay = false;
    } else if (autoplay === "true") {
      autoplay = true;
    }

    let options = {
      techOrder: ["html5"],
      html5: {
        vhs: {
          overrideNative: !videojs.browser.IS_SAFARI,
          experimentalLLHLS: true,
          experimentalExactManifestTimings: true,
          experimentalLeastPixelDiffSelector: true,
          useNetworkInformationApi: true,
        },
        nativeTextTracks: false,
      },
      liveui: true,
      preload: "auto",
      autoplay,
      controls: true,
      muted,
      loop,
      playbackRates: [0.5, 1, 1.5, 2, 4, 8],
      playsinline: true,
      fluid: true,
      responsive: true,
    };

    instance.canvas.append(videoPlayer);
    let player = videojs(playerId, options, function onPlayerReady() {});


    instance.data.player = player;

    player.on("loadedmetadata", () => {
      if (Number.isFinite(player.duration())) {
        let ftime = instance.data.secondsToTime(player.duration());
        instance.publishState("audio_duration_second", player.duration());
        instance.publishState("audio_duration_format", ftime);
      }
      instance.publishState("loadedmetadata", true);
      instance.publishState("speed", player.playbackRate() || 1);
      instance.triggerEvent("loaded_meta");
      setTimeout(() => {
        instance.data.resizePlayer();
      }, 100);
    });
    player.on("ended", function (e) {
      instance.publishState("ended", true);
      instance.publishState("playing", false);
      instance.triggerEvent("ended");
    });

    // # added trigger event is_playing
    player.on("play", function () {
      instance.publishState("playing", true);
      instance.publishState("ended", false);
      instance.publishState("paused", false);
      instance.triggerEvent("play");
      setTimeout(() => {
          instance.data.resizePlayer();
      }, 100)

    });

    player.on("pause", function () {
      instance.publishState("playing", false);
      instance.publishState("paused", true);
      instance.triggerEvent("paused");
      const audios = document.getElementsByTagName("audio");
      for (let i = 0, len = audios.length; i < len; i++) {
        audios[i].pause();
      }
    });

    player.on("loadstart", function () {
      instance.publishState("playing", "no");
      instance.data.updateOptions(instance.data.properties);
    });

    player.on("loadeddata", function () {
      instance.publishState("loadeddata", true);
      instance.publishState("error_type", "");
      instance.publishState("error_message", "");
      instance.triggerEvent("loaded_data");
    });

    player.on("ready", function () {
      instance.triggerEvent("ready");
    });

    player.on("timeupdate", function () {
      if (Number.isFinite(player.duration())) {
        let fDuration = instance.data.secondsToTime(player.duration());
        instance.publishState("audio_duration_second", player.duration());
        instance.publishState("audio_duration_format", fDuration);
      }
      if (Number.isFinite(player.remainingTime())) {
        const remainingSeconds = player.remainingTime();
        instance.publishState("current_time", Math.floor(player.currentTime()));
        instance.publishState("remaining_time", remainingSeconds);
        instance.publishState(
            "remaining_time_format",
            instance.data.secondsToTime(remainingSeconds)
        );
      }
      instance.triggerEvent("timeupdate");
    });

    player.on("error", function () {
      let error = player.error();
      let errorType;
      if (error.code === 0) {
        errorType = "MEDIA_ERR_CUSTOM";
      } else if (error.code === 1) {
        errorType = "MEDIA_ERR_ABORTED";
      } else if (error.code === 2) {
        errorType = "MEDIA_ERR_NETWORK";
      } else if (error.code === 3) {
        errorType = "MEDIA_ERR_DECODE";
      } else if (error.code === 4) {
        errorType = "MEDIA_ERR_SRC_NOT_SUPPORTED";
      } else if (error.code === 5) {
        errorType = "MEDIA_ERR_ENCRYPTED";
      }
      instance.publishState("error_message", error.message);
      instance.publishState("error_type", errorType);
      instance.triggerEvent("error");
    });

    player.on("volumechange", function () {
      instance.publishState("volume", player.volume());
      instance.triggerEvent("changed_volume");
    });

    player.on("ratechange", function () {
      instance.publishState("speed", player.playbackRate());
      instance.triggerEvent("ratechange");
    });

    player.on("playerresize", function () {
      instance.publishState("player_width", player.currentWidth());
      instance.publishState("player_height", player.currentHeight());
      instance.triggerEvent("playerresize");
      instance.data.resizePlayer();
    });

    player.on("componentresize", function () {
      instance.data.resizePlayer();
    });

    player.on("stalled", function () {
      instance.triggerEvent("stalled");
    });

    player.on("canplay", function () {
      instance.triggerEvent("canplay");
    });

    player.on("canplaythrough", function () {
      instance.triggerEvent("canplaythrough");
    });

    player.on("waiting", function () {
      instance.triggerEvent("waiting");
    });

    player.on("seeking", function () {
      instance.publishState("seeking", true);
      instance.triggerEvent("seeking");
    });

    player.on("seeked", function () {
      instance.publishState("seeking", false);
      instance.triggerEvent("seeked");
    });
  };
}
