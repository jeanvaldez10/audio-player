function(instance, context) {
  // initialize states

  $(document).ready(function() {
    window.videojs.log.level('off');
  });

  const playerId = "universal-video" + Math.floor(Math.random() * 100000001);
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

  instance.data.updateTracks = () => {
    const player = instance.data.player;
    if (player) {
      const audioTracks = player.audioTracks().tracks_ || [];
      const videoTracks = player.videoTracks().tracks_ || [];
      const textTracks = player.textTracks().tracks_ || [];

      for (let i = 0; i < textTracks.length; i++) {
        const track = textTracks[i];
        if (track.mode === "showing") {
          instance.publishState("text_track", track.id);
        }
      }
      // search through track list and play enabled one
      for (let i = 0; i < audioTracks.length; i++) {
        const track = audioTracks[i];
        let audioElement = document.getElementById(track.id);
        if (track.enabled) {
          audioElement?.play();
          instance.publishState("audio_track", track.id);
        } else {
          audioElement?.pause();
        }
      }

      for (let i = 0; i < videoTracks.length; i++) {
        let track = videoTracks[i];

        if (track.selected) {
          instance.publishState("video_track", track.id);
        }
      }

      instance.publishState(
        "text_tracks",
        textTracks.map((track) => track.id)
      );
      instance.publishState(
        "audio_tracks",
        audioTracks.map((track) => track.id)
      );
      instance.publishState(
        "video_tracks",
        videoTracks.map((track) => track.id)
      );
    }
  };

  instance.data.removeTextTrack = (properties) => {
    let player = instance.data.player;
    if (player) {
      const { trackId, all } = properties;
      // change the text track by using the label name
      let tracks = player.textTracks();
      let trackIds = [];
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (all || track.id === trackId) {
          trackIds.push(track.id);
        }
      }
      for (let i = 0; i < trackIds.length; i++) {
        const track = player.textTracks().getTrackById(trackIds[i]);
        if (track) {
          player.removeRemoteTextTrack(track);
        }
      }
    }
    instance.data.updateTracks();
    instance.triggerEvent("removed_text_track");
  };

  instance.data.removeAudioTrack = (properties) => {
    const player = instance.data.player;
    if (player) {
      const { trackId, all } = properties;
      // remove track and audio element
      const audioTrackList = player.audioTracks();
      let trackIds = [];

      for (let i = 0; i < audioTrackList.length; i++) {
        const track = audioTrackList[i];
        if (all || track.id === trackId) {
          trackIds.push(track.id);
        }
      }
      for (let i = 0; i < trackIds.length; i++) {
        const track = player.audioTracks().getTrackById(trackIds[i]);
        if (track) {
          player.audioTracks().removeTrack(track);
          document.getElementById(track.id).remove();
        }
      }
      instance.data.updateTracks();
      instance.triggerEvent("removed_audio_track");
    }
  };

  instance.data.removeVideoTrack = (properties) => {
    const player = instance.data.player;
    if (player) {
      const { trackId, all } = properties;
      const videoTrackList = player.videoTracks();
      let trackIds = [];

      for (let i = 0; i < videoTrackList.length; i++) {
        const track = videoTrackList[i];
        if (all || track.id === trackId) {
          trackIds.push(track.id);
        }
      }
      for (let i = 0; i < trackIds.length; i++) {
        const track = player.videoTracks().getTrackById(trackIds[i]);
        if (track) {
          player.videoTracks().removeTrack(track);
        }
      }
      instance.data.updateTracks();
      instance.triggerEvent("removed_video_track");
    }
  };

  instance.data.resizePlayer = function resizeVideoJS() {
    const player = instance.data.player;
    if (!player || player.isFullscreen() || !instance.data.properties?.resizeMode) {
      return;
    }
    const aspectRatio = player.aspectRatio();
    let height = player.currentHeight();
    const width = player.currentWidth();
    if (aspectRatio && /^\d+\:\d+$/.test(aspectRatio) && !instance.data.properties?.audioOnlyMode) {
      const [w, h] = aspectRatio.split(":");
      height = (width * h) / w;
    }
    const parent = instance.canvas.parent(".bubble-r-box");
    if (parent.length) {
      parent.css("height", height);
      parent.css("max-height", "fit-content");
      parent.css("min-height", "fit-content");
      const grandParent = parent.parent(".bubble-r-line");
      if (grandParent.length) {
        grandParent.css("height", height);
        grandParent.css("max-height", "fit-content");
        grandParent.css("min-height", "fit-content");
      }
    }
    instance.canvas.css("height", height);
    instance.canvas.css("max-height", "fit-content");
    instance.canvas.css("min-height", "fit-content");
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
    let {
      muted,
      speed,
      loop,
      controls,
      volume,
      fluid,
      aspectRatio,
      forcePause,
      forcePlay,
      theme,
      progressBarColor,
      barColor,
      override_style,
      playBtnColor,
      css_skin_file,
      audioOnlyMode,
    } =properties;
    try {
      if (instance.data.ext === "vimeo") {
        if (muted) {
          player.volume(0);
        } else {
          player.volume(volume);
        }
      } else {
        player.controls(controls);
        player.loop(loop);
        player.volume(volume || 0);
        player.muted(muted);
        player.playbackRate(speed || 1);
      }

      if (['vimeo', 'youtube'].includes(instance.data.media_type)) {
        player.controls(false);
        player.audioOnlyMode(false);
      } else {
        player.audioOnlyMode(audioOnlyMode);
      }
      if (forcePause) {
        player.pause();
      } else if (forcePlay){
        player.play();
      }
      player.fluid(fluid);
      if (aspectRatio) {
        player.aspectRatio(aspectRatio);
        instance.data.resizePlayer();
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
      if (playBtnColor) {
        instance.canvas
            .find(".vjs-big-play-button")
            .css("background-color", playBtnColor);

        instance.canvas
            .find(".vjs-big-play-button")
            .on("mouseenter", function () {
              instance.canvas.find(".vjs-big-play-button").css("opacity", "1");
            })
            .on("mouseleave", function () {
              instance.canvas.find(".vjs-big-play-button").css("opacity", "0.8");
            });
      }

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
      apply_mobile_ui,
      apply_seek_button,
      apply_source_selector,
      apply_hotkeys,
      apply_ab_loop,
      apply_share,
      apply_airplay,
      apply_vr,
    } = properties;

    if (apply_mobile_ui && !player.activePlugins_?.mobileUi) {
      let {
        enterOnRotate,
        exitOnRotate,
        lockOnRotate,
        lockToLandscapeOnEnter,
        iOS,
        seekSeconds,
      } = properties;
      player.mobileUi({
        fullscreen: {
          enterOnRotate,
          exitOnRotate,
          lockOnRotate,
          lockToLandscapeOnEnter,
          iOS: false,
          disabled: false,
        },
        touchControls: {
          seekSeconds,
          tapTimeout: 300,
          disableOnEnd: false,
          disabled: false,
        },
      });
    }
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

    if (apply_share && !player.activePlugins_?.share) {
      const shareOptions = {
        socials: [
          "fb",
          "tw",
          "reddit",
          "gp",
          "messenger",
          "linkedin",
          "telegram",
          "whatsapp",
          "facebook",
          "viber",
          "vk",
          "ok",
          "mail",
        ],

        url: window.location.href,
        title: "Share your media",
        description: "Share your media",
        // required for Facebook and Messenger
        fbAppId: properties.fbAppId,
        // optional for Facebook
        redirectUri: window.location.href + "#close",

        // optional for VK
        isVkParse: true,

        // optinal embed code
        embedCode: `<iframe src='${window.location.href}' width='560' height='315' frameborder='0' allowfullscreen></iframe>`,
      };

      player.share(shareOptions);
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
      videoSource = "",
      poster,
      mime_type,
      use_poster_list,
    } = properties;
    instance.data.playlist = videoSource?.split(",") || [""];
    instance.data.posterlist = poster?.split(",") || [""];

    // if source changed
    if (videoSource !== instance.data.properties?.videoSource) {
      instance.data.counter = 0;
      instance.publishState("counter", 0);
    }

    instance.publishState("counter", instance.data.counter);

    const currentSrc = instance.data.playlist.find(
        (item, index) => index === instance.data.counter
    );

    let currentPoster;

    if (use_poster_list) {
      currentPoster = instance.data.posterlist.find(
          (item, index) => index === instance.data.counter
      );
    } else {
      currentPoster = instance.data.posterlist[0];
    }

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
      } else if (
          url.match(
              /(http:|https:|)\/\/(player.|www.|home.|fast.)?(wistia\.com|wi\.st|drive\.google\.com|vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|medias\/|embed\/iframe\/|embed\/|file\/d\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
          )
      ) {
        if (url.indexOf("youtu") > -1) {
          ext = "youtube";
          const id = RegExp.$6;

          const newUrl =
              "https://youtube.com/embed/" +
              id +
              "?origin=" +
              window.location.protocol +
              "//" +
              window.location.host +
              "";
          sourceObject = {
            src: newUrl,
            type: "video/youtube",
          };

          instance.publishState("media_type", "youtube");
          media_type = 'youtube';

        } else if (url.indexOf("vimeo") > -1) {
          ext = "vimeo";
          sourceObject = {
            src: url,
            type: "video/vimeo",
          };
          instance.publishState("media_type", "vimeo");
          media_type = 'vimeo';

        } else if (RegExp.$3.indexOf("drive.google.com") > -1) {
          ext = "google";
          const id = RegExp.$6;
          const newUrl =
              "https://drive.google.com/uc?export=download&id=" + id + "";

          if (mime_type) {
            sourceObject = {
              src: newUrl,
              type: mime_type,
            };
            instance.publishState("media_type", "html5");
            media_type = 'html5';
          } else {
            instance.publishState("media_type", "unknown");
            media_type = 'unknown';
          }
        } else if (mime_type) {
          sourceObject = {
            src: url,
            type: mime_type,
          };
          instance.publishState("media_type", mime_type);
          media_type = 'html5';
        } else {
          media_type = 'html5';
        }
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

    if (currentPoster && !currentPoster !== instance.data.currentPoster) {
      instance.data.currentPoster = currentPoster;
      instance.data.player?.poster(currentPoster);
      instance.publishState("current_poster", currentPoster);
    }

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
    instance.publishState("video_duration_second", 0);
    instance.publishState("video_duration_format", "");
    instance.publishState("ended", false);
    instance.publishState("playing", false);
    instance.publishState("paused", false);
    instance.publishState("video_tracks", []);
    instance.publishState("audio_tracks", []);
    instance.publishState("text_tracks", []);
    instance.publishState("last_added_video_track", "");
    instance.publishState("last_added_audio_track", "");
    instance.publishState("last_added_text_track", "");
    instance.publishState("text_track", "");
    instance.publishState("video_track", "");
    instance.publishState("audio_track", "");
    instance.publishState("error_type", "");
    instance.publishState("error_message", "");
    instance.publishState("error_message", "");
    instance.publishState("file_extension", "");
    instance.publishState("current_poster", "");
    instance.publishState("remaining_time_format", "");
    instance.publishState("remaining_time", 0);
    instance.publishState("volume", 0);
    instance.publishState("speed", 0);
    instance.publishState("fullscreen", false);
    instance.publishState("video_width", 0);
    instance.publishState("video_height", 0);
    instance.publishState("player_width", 0);
    instance.publishState("player_width", 0);
    instance.publishState("seeking", false);

    instance.canvas.empty();


      let {
          autoplay,
          muted,
          controls,
          loop,
          fluid,
          aspectRatio,
          apply_vr
      } = properties;

      const videoPlayer = $(
      `<video id="${playerId}" class='video-js vjs-big-play-centered' playsinline ${apply_vr ? "crossorigin='anonymous'" : ""}><p class="vjs-no-js">
                            To view this video please enable JavaScript, and
                            consider upgrading to a web browser that
                        <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                </p></video>`
    );


    if (instance.data.currentSrc?.indexOf("vimeo") > -1) {
      autoplay = autoplay !== 'false';
    }

    if (autoplay === "false") {
      autoplay = false;
    } else if (autoplay === "true") {
      autoplay = true;
    }

    let options = {
      techOrder: ["html5", "vimeo", "youtube"],
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
      youtube: {
        ytControls: controls ? 2 : 0,
        controls: controls ? 1 : 0,
        autoplay: autoplay ? 1 : 0,
        fs: 1,
        iv_load_policy: 1, // 3 disables
        loop: loop ? 1 : 0,
        modestbranding: 1,
        playsinline: 1,
      },
      vimeo: {
        color: "#fbc51b",
        controls,
      },
      liveui: true,
      preload: "auto",
      autoplay,
      controls,
      muted,
      loop,
      playbackRates: [0.5, 1, 1.5, 2, 4, 8],
      playsinline: true,
      fluid,
      responsive: true,
    };

    if (aspectRatio) {
      options.aspectRatio = aspectRatio;
    }

    instance.canvas.append(videoPlayer);
    let player = videojs(playerId, options, function onPlayerReady() {});

    player.univ({
      shareMenu: false,
      zoomMenu: false,
      relatedMenu: false,
      settingsButton: false,
      qualityMenu: false,
      rateMenu: false,
      buttonRewind: false,
      buttonForward: false,
      mirrorButton: false,
      controlbar: true,
      androidLock: false,
      pipButton: true,
      theaterButton: false,
      tooltips: false,
      contextMenu: false,
      hdicon: false,
      zoonInfo: false,
      zoomWheel: false
    });

    instance.data.player = player;

    let audioTracks = player.audioTracks();
    let videoTracks = player.videoTracks();
    let textTracks = player.textTracks();
    textTracks.on("change", function action(event) {
      instance.data.updateTracks();
      instance.triggerEvent("text_track_change");
    });
    audioTracks.on("change", function action(event) {
      instance.data.updateTracks();
      instance.triggerEvent("audio_track_change");
    });
    videoTracks.on("change", function action(event) {
      instance.data.updateTracks();
      instance.triggerEvent("video_track_change");
    });

    player.on("loadedmetadata", () => {
      if (Number.isFinite(player.duration())) {
        let ftime = instance.data.secondsToTime(player.duration());
        instance.publishState("video_duration_second", player.duration());
        instance.publishState("video_duration_format", ftime);
      }
      instance.publishState("loadedmetadata", true);
      instance.publishState("video_width", player.videoWidth() || 0);
      instance.publishState("video_height", player.videoHeight() || 0);
      instance.publishState("speed", player.playbackRate() || 1);
      instance.triggerEvent("loaded_meta");
      setTimeout(() => {
        instance.data.updateTracks();
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
      for (let i = 0; i < audioTracks.length; i++) {
        const track = audioTracks[i];
        if (track.enabled) {
          const audioElement = document.getElementById(track.id);
          if (audioElement) {
            audioElement.play();
          }
          return;
        }
      }
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
        instance.publishState("video_duration_second", player.duration());
        instance.publishState("video_duration_format", fDuration);
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

    player.on("fullscreenchange", function () {
      if (player.isFullscreen()) {
        instance.publishState("fullscreen", true);
        instance.triggerEvent("went_fullscreen");
      } else {
        instance.publishState("fullscreen", false);
        instance.triggerEvent("exit_fullscreen");
      }
    });
    player.on("volumechange", function () {
      instance.publishState("volume", player.volume());
      instance.triggerEvent("changed_volume");
    });

    player.on("ratechange", function () {
      instance.publishState("speed", player.playbackRate());
      instance.triggerEvent("ratechange");
    });

    player.on("resize", function () {
      instance.triggerEvent("resize");
      instance.data.resizePlayer();
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
