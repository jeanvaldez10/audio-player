(function anonymous(instance, properties, context
) {


    $(document).ready(function () {

        // set variables
        var videoPlayer = instance.data.videoPlayer;
        var videoContainer = document.getElementById(instance.data.elementId);
        var currentUrl = videoPlayer.currentSrc();

        // get data
        var url = properties.media_file;
        var mime_type = properties.mime_type;
        var mux = properties.use_mux;
        var poster = properties.poster;
        var poster_reload = properties.poster_reload;
        var poster_always_visible = properties.poster_always_visible;
        var disable_right_click = properties.disable_right_click;
        var controls = properties.controls_videojs;
        var big_play_button = properties.big_play_button;
        var autoplay = properties.autoplay;
        var loop = properties.loop;
        var volume = properties.volume;
        var muted = properties.muted;
        var playback_rate = properties.playback_rate;
        var playback_time_1 = properties.playback_time_1;
        var playback_time_2 = properties.playback_time_2;
        var playback_time_3 = properties.playback_time_3;
        var play_from_min_value = properties.play_from_min_value;
        var min_value_scrubbing = properties.min_value_scrubbing ? properties.min_value_scrubbing / 1000 : null;
        var max_value_scrubbing = properties.max_value_scrubbing ? properties.max_value_scrubbing / 1000 : null;
        var preload = properties.preload.toLowerCase();
        var object_fit = properties.object_fit.toLowerCase();
        var background_color = properties.background_color;
        var aspect_ratio = properties.aspect_ratio;
        var auto_play_when_in_view = properties.auto_play_when_in_view;
        var auto_play_when_in_view_rg = properties.auto_play_when_in_view_rg;
        var zoom = properties.zoom ? properties.zoom : 1;
        var rotate = properties.rotate ? properties.rotate : 0;
        var flip = properties.flip ? properties.flip.toLowerCase() : 'right';
        var theme = properties.theme;
        var css_skin_file = properties.css_skin_file;
        var centre_play = properties.centre_play;
        var show_button_on_pause = properties.show_button_on_pause;
        var disable_spinner = properties.disable_spinner;
        var disable_click_pause = properties.disable_click_pause;
        var disable_click_play = properties.disable_click_play;
        var click_exit_fullscreen = properties.click_exit_fullscreen;
        var disable_fullscreen = properties.disable_fullscreen;
        var suppress_console_errors = properties.suppress_console_errors;
        var enable_scrubbing_onload = properties.enable_scrubbing_onload;
        var sprite_sheet = properties.sprite_sheet;
        var number_of_tiles = properties.number_of_tiles;
        var slider_width = properties.slider_width;
        var slider_show_onload = properties.slider_show_onload;
        var slider_color = properties.slider_color;
        var slider_stay_visible = properties.slider_stay_visible;
        var scrubber_hide_on_click = properties.scrubber_hide_on_click;

        var mux_video_id = properties.mux_video_id ? properties.mux_video_id : videoPlayer.id();
        var mux_video_title = properties.mux_video_title ? properties.mux_video_title : 'My Awesome Video';
        var mux_viewer_user_id = properties.mux_viewer_user_id ? properties.mux_viewer_user_id : Math.floor(Math.random() * 1977 * 1960 * 1977 * 1960).toString();

        instance.data.control_bar_opacity = properties.control_bar_opacity >= 0 ? properties.control_bar_opacity : 1;
        instance.data.auto_hide_control_bar = properties.auto_hide_control_bar;
        instance.data.play_on_hover = properties.play_on_hover;
        instance.data.use_vimeo_player = properties.use_vimeo_player;
        instance.data.use_wistia_player = properties.use_wistia_player;
        instance.data.format_time = properties.format_time;

        instance.data.mux_sprite_sheet = properties.mux_sprite_sheet;
        instance.data.mux_sprite_sheet_width = properties.mux_sprite_sheet_width;
        instance.data.mux_sprite_sheet_height = properties.mux_sprite_sheet_height;
        instance.data.mux_sprite_sheet_interval = properties.mux_sprite_sheet_interval;
        instance.data.mux_sprite_sheet_scale_factor = properties.mux_sprite_sheet_scale_factor ? properties.mux_sprite_sheet_scale_factor : 1;

        // get the browser user agent and store in state
        instance.publishState("browser_user_agent", navigator.userAgent.toLowerCase());

        // disable tech click (pause/play)
        if ((disable_click_pause) && (!disable_click_play)) {
            videoPlayer.player_.handleTechClick_ = function () {
                if (videoPlayer.paused()) {
                    videoPlayer.play();
                }
            };
        }
        if ((!disable_click_pause) && (disable_click_play)) {
            videoPlayer.player_.handleTechClick_ = function () {
                if (!videoPlayer.paused()) {
                    videoPlayer.pause();
                }
            };
        }
        if ((disable_click_pause) && (disable_click_play)) {
            videoPlayer.player_.handleTechClick_ = function () {
            };
        }
        if (click_exit_fullscreen) {
            videoPlayer.player_.handleTechClick_ = function () {
                if (videoPlayer.isFullscreen()) {
                    videoPlayer.exitFullscreen();
                }
            }
        }

        // error handling, suppress
        if (suppress_console_errors) {
            window.videojs.log.level('off');

            var existCondition = setInterval(function() {
                if (document.getElementById(instance.data.elementId).getElementsByClassName('vjs-modal-dialog-content').length > 1) {
                    clearInterval(existCondition);

                    // remove the element which holds the 'no compatible source was found for this media' message
                    // we're targetting the first class element here, the second one is the captions settings
                    var dialogs = document.getElementById(instance.data.elementId).getElementsByClassName('vjs-modal-dialog-content');
                    var len = dialogs.length;

                    for (var i = 0; i < len; i++) {
                        dialogs[0].remove();
                    }
                }
            }, 100);

        }

        // reset the YouTube control states if the current video isn't already a YouTube video
        // this is because it's difficult to maintain the controls when switching
        if (currentUrl) {
            if (!currentUrl.includes("youtube")) {
                instance.publishState("youtube_controls_enabled", false);
                instance.publishState("youtube_fullscreen_icon", false);
                instance.publishState("youtube_color", "red");
                instance.publishState("youtube_lang_pref", "");
                instance.publishState("youtube_cc_load_policy", false);
                instance.publishState("youtube_disable_kb", false);
                instance.publishState("youtube_interface_lang", "");
                instance.publishState("youtube_iv_load_policy", false);
                instance.publishState("youtube_modestbranding", false);
                instance.publishState("youtube_playsinline", false);
            }
        }

        // set cookie
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        // get cookie
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        // get the mp4 url from the vimeo link
        function getMp4Vimeo(id) {
            $.getJSON("https://api.scraperapi.com/?api_key=588b114448ed05f8120618fe52a4ac4d&url=https://player.vimeo.com/video/" + id + "/config", function (json_data) {

                let files = json_data.request.files.progressive;
                for (var i = 0; i < files.length; i++) {

                    // looks for 1080p and 720p versions
                    if (files[i].quality == "1080p") {
                        console.log("1080p - id is " + id + ", url is " + files[i].url);
                        var sourceObject = {
                            src: files[i].url, type: 'video/mp4'
                        };
                        videoPlayer.src(sourceObject);
                        setCookie(id, files[i].url, 30);
                        var found = "yes";
                        instance.publishState("media_url", files[i].url);
                        instance.publishState("media_type", "video");
                        break;

                    } else if (files[i].quality == "720p") {
                        console.log("720p - id is " + id + ", url is " + files[i].url);
                        var sourceObject = {
                            src: files[i].url, type: 'video/mp4'
                        };
                        videoPlayer.src(sourceObject);
                        setCookie(id, files[i].url, 30);
                        var found = "yes";
                        instance.publishState("media_url", files[i].url);
                        instance.publishState("media_type", "video");
                        break;

                    } else if (files[i].quality) {
                        console.log(files[i].quality + " - id is " + id + ", url is " + files[i].url);
                        var sourceObject = {
                            src: files[i].url, type: 'video/mp4'
                        };
                        videoPlayer.src(sourceObject);
                        setCookie(id, files[i].url, 30);
                        var found = "yes";
                        instance.publishState("media_url", files[i].url);
                        instance.publishState("media_type", "video");
                        break;

                    }

                }
                if (!found) {
                    console.log("Attempted to get vimeo mp4 file but couldn't find a version available, reach out to pork1977 on the forum");
                }

            });
        }

        // function to return file extension of a url
        function getExtension(path) {
            var basename = path.split(/[\\/]/).pop(); // extract file name from full path
            var pos = basename.lastIndexOf("."); // get last position of `.`

            if (basename === "" || pos < 1) { // if file name is empty or not `.` return empty ext
                return "";
            }

            return basename.slice(pos + 1); // return ext
        }

        // set the sourceObjects and states
        // set the file extension/mime types
        var ext;
        if ((url) && (url != instance.data.currentUrl) && (!ext)) {

            // this line stops the video loading everytime the page is resized since all of this is in the update function, it's evaluated in this blocks condition
            instance.data.currentUrl = url;

            ext = getExtension(url).toLowerCase();
            var id;

            if (poster_reload) {
                videoPlayer.poster('');
            }
            instance.publishState("loadedmetadata", false);
            instance.publishState("loadeddata", false);

            // image formats
            if (ext === "svg" || ext === "jpg" || ext === "jpeg" || ext === "bmp" || ext === "png" || ext === "gif") {
                var isImage = true;
                videoPlayer.hasStarted(false);
                instance.publishState("media_url", url);
                instance.publishState("media_type", "image");
                instance.publishState("poster", url);
                instance.publishState("videojs_controls_enabled", false);
                videoPlayer.poster(url);
                videoPlayer.controls(false);

                // audio formats
            } else if (ext === "mp3") {
                var sourceObject = {
                    src: url, type: 'audio/mp3'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "audio");
                videoPlayer.src(sourceObject);

            } else if (ext === "wav") {
                var sourceObject = {
                    src: url, type: 'audio/wav'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "audio");
                videoPlayer.src(sourceObject);

            } else if (ext === "aac") {
                var sourceObject = {
                    src: url, type: 'audio/aac'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "audio");
                videoPlayer.src(sourceObject);

            } else if (ext === "m3u") {
                var sourceObject = {
                    src: url, type: 'audio/x-mpegURL'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "audio");
                videoPlayer.src(sourceObject);

            } else if (ext === "flac") {
                var sourceObject = {
                    src: url, type: 'audio/flac'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "audio");
                videoPlayer.src(sourceObject);

                // video formats
            } else if (ext === "m3u8") {
                var sourceObject = {
                    src: url, type: 'application/x-mpegURL'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "mpd") {
                var sourceObject = {
                    src: url, type: 'application/dash+xml'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "mov") {
                var sourceObject = {
                    src: url, type: 'video/mp4'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if ((ext === "mp4") || (ext === "m4v")) {
                var sourceObject = {
                    src: url, type: 'video/mp4'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

                // this plays dropbox/github videos (needs further work as it assumes mp4)
            } else if ((ext.includes("raw=1")) || (ext.includes("dl=0")) || (ext.includes("dl=1"))) {
                ext = "mp4";
                var sourceObject = {
                    src: url, type: 'video/mp4'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "mkv") {
                var sourceObject = {
                    src: url, type: 'video/mp4'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "f4m") {
                var sourceObject = {
                    src: url, type: 'application/adobe-f4m'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "webm") {
                var sourceObject = {
                    src: url, type: 'video/webm'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "ogg") {
                var sourceObject = {
                    src: url, type: 'video/ogg'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if (ext === "flv") {
                var sourceObject = {
                    src: url, type: 'video/flv'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

            } else if ((!url.includes("//")) && (!url.includes("www."))) {
                ext = "wistia";

                var newUrl = "https://fast.wistia.net/embed/medias/" + url + ".m3u8";
                var sourceObject = {
                    src: newUrl, type: 'application/x-mpegURL'
                };
                instance.publishState("media_url", newUrl);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

                //check if youtube/vimeo/wistia
            } else if (url.match(/(http:|https:|)\/\/(player.|www.|home.|fast.)?(wistia\.com|wi\.st|drive\.google\.com|vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|medias\/|embed\/iframe\/|embed\/|file\/d\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/)) {

                // match supports the following formats:
                //	 youtube
                //     - http(s)://www.youtube.com/watch?v=My2FRPA3Gf8
                //     - http(s)://youtu.be/My2FRPA3Gf8
                //     - http(s)://youtube.googleapis.com/v/My2FRPA3Gf8
                //   vimeo
                //     - http(s)://vimeo.com/25451551
                //     - http(s)://player.vimeo.com/video/25451551
                //   wistia
                //     - http(s)://wistia.com/medias/26sk4lmiix
                //     - http(s)://wistia.com/embed/26sk4lmiix
                //     - http(s)://wi.st/medias/26sk4lmiix
                //     - http(s)://wi.st/embed/26sk4lmiix
                //     - http(s)://fast.wistia.com/embed/iframe/26sk4lmiix
                //     - http(s)://home.wistia.com/medias/26sk4lmiix
                //   google drive
                //     - https://drive.google.com/file/d/1nuSYI4ibo7ee8UcF48R3-ehH1JpEmrgd/view?usp=sharing
                //     - https://drive.google.com/file/d/1nuSYI4ibo7ee8UcF48R3-ehH1JpEmrgd/preview

                if (RegExp.$3.indexOf('youtu') > - 1) {
                    ext = "youtube";
                    id = RegExp.$6;

                    var newUrl = "https://youtube.com/embed/" + id + "?origin=" + window.location.protocol + "//" + window.location.host + "";
                    var sourceObject = {
                        src: newUrl, type: 'video/youtube'
                    };
                    instance.publishState("media_url", newUrl);
                    instance.publishState("media_type", "video");
                    videoPlayer.src(sourceObject);

                } else if (RegExp.$3.indexOf('wi') > - 1) {
                    ext = "wistia";
                    id = RegExp.$6;

                    // using wistia player
                    if (instance.data.use_wistia_player) {
                        var sourceObject = {
                            src: url, type: 'video/wistia'
                        };
                        videoPlayer.src(sourceObject);

                        // not using wistia player
                    } else {
                        var newUrl = "https://fast.wistia.net/embed/medias/" + id + ".m3u8";
                        var sourceObject = {
                            src: newUrl, type: 'application/x-mpegURL'
                        };
                        instance.publishState("media_url", newUrl);
                        instance.publishState("media_type", "video");
                        videoPlayer.src(sourceObject);
                    }

                } else if (RegExp.$3.indexOf('vimeo') > - 1) {
                    ext = "vimeo";
                    id = RegExp.$6;

                    // using vimeo player
                    if (instance.data.use_vimeo_player) {
                        var sourceObject = {
                            src: url, type: 'video/vimeo'
                        };
                        videoPlayer.reset();
                        videoPlayer.src(sourceObject);

                        // not using vimeo player
                    } else {

                        // when the vimeo id from the regex is 'external' it can play directly through the player as an mp4
                        if (id == 'external') {
                            var sourceObject = {
                                src: url, type: 'video/mp4'
                            };
                            videoPlayer.src(sourceObject);
                        } else {

                            // get the mp4 url only if not already attempted, to keep the requests down to a minimum
                            // to see requests go to https://www.scraperapi.com/dashboard
                            id = RegExp.$6;
                            var cookie = getCookie(id);

                            if (!cookie.includes(id)) {
                                getMp4Vimeo(id);

                            } else {

                                // test the url first because sometime it ceases to exist after some time has passed
                                $.get(cookie).done(function () {
                                    console.log("Cookie exists for this vimeo video (" + id + ") so we'll use the value which contains the mp4 url rather than wasting another request to grab it");
                                    var sourceObject = {
                                        src: cookie, type: 'video/mp4'
                                    };
                                    videoPlayer.src(sourceObject);
                                }).fail(function () {
                                    console.log("Cookie exists for this vimeo video (" + id + ") but for some reason is no longer available so we'll request it again");
                                    getMp4Vimeo(id);
                                });

                                instance.publishState("media_url", cookie);
                                instance.publishState("media_type", "video");
                            }

                        }

                    }

                } else if (RegExp.$3.indexOf('drive.google.com') > - 1) {
                    var key = context.keys["Google Drive"];
                    ext = "google";
                    id = RegExp.$6;

                    if (mime_type) {
                        if (key) {
                            var newUrl = "https://www.googleapis.com/drive/v3/files/" + id + "?alt=media&key=" + key + "";
                        } else {
                            var newUrl = "https://drive.google.com/uc?export=download&id=" + id + "";
                        }
                        var sourceObject = {
                            src: newUrl, type: mime_type
                        };
                        instance.publishState("media_url", newUrl);
                        instance.publishState("media_type", "video");
                        videoPlayer.src(sourceObject);
                    } else {
                        alert("Google drive URL recognised, you must set a valid MIME type for this")
                    }

                }

                // no file extension and no mime type then try with video/mp4
            } else if (!ext && !mime_type) {
                var sourceObject = {
                    src: url, type: 'video/mp4'
                };
                instance.publishState("media_url", url);
                instance.publishState("media_type", "video");
                videoPlayer.src(sourceObject);

                // if mime type
            } else {
                if (mime_type) {

                    // mime type as video/quicktime then set to video/mp4
                    if (mime_type.toLowerCase() === "video/quicktime") {
                        var sourceObject = {
                            src: url, type: "video/mp4"
                        };
                        videoPlayer.src(sourceObject);

                        // otherwise use the entered mime type
                    } else {
                        var sourceObject = {
                            src: url, type: mime_type
                        };
                        videoPlayer.src(sourceObject);
                    }

                    instance.publishState("media_url", url);

                    if (url.includes("ucarecdn")) {
                        instance.publishState("media_type", "uploadcare");
                    } else {
                        instance.publishState("media_type", "undefined");
                    }

                } else {
                    console.log("Media type not defined, reach out to pork1977 on the forum");
                }
            }
            instance.publishState("file_extension", ext);

            // emit mux videochange event (metadata)
            if ((mux) && (instance.data.initMux)) {
                var playerInitTime = Date.now();

                videoPlayer.mux.emit('videochange', {

                    // site metadata
                    viewer_user_id: "" + mux_viewer_user_id + "",

                    // player metadata
                    player_name: "VideoJS (Bubble)",
                    player_version: "7.18.1",
                    player_init_time: playerInitTime,

                    // video metadata
                    video_id: "" + mux_video_id + "",
                    video_title: "" + mux_video_title + "",
                    video_duration: "" + videoPlayer.duration() + "",
                    video_cdn: "" + url + ""
                });
            }

        }

        // set mux details (metadata)
        if ((mux) && (!instance.data.initMux)) {
            var playerInitTime = Date.now();
            videoPlayer.mux({
                debug: false,
                data: {
                    env_key: "" + context.keys["MUX Environment Key"] + "",

                    // site metadata
                    viewer_user_id: "" + mux_viewer_user_id + "",

                    // player metadata
                    player_name: "VideoJS (Bubble)",
                    player_version: "7.18.1",
                    player_init_time: playerInitTime,

                    // video metadata
                    video_id: "" + mux_video_id + "",
                    video_title: "" + mux_video_title + "",
                    video_duration: "" + videoPlayer.duration() + "",
                    video_cdn: "" + url + ""
                }
            });
            instance.data.initMux = true;
        }

        // enables scrubber thumbnails on the progress bar
        if (instance.data.mux_sprite_sheet) {
            instance.data.spriteThumbs(videoPlayer, {
                url: "" + instance.data.mux_sprite_sheet + "",
                interval: instance.data.mux_sprite_sheet_interval,
                width: instance.data.mux_sprite_sheet_width,
                height: instance.data.mux_sprite_sheet_height,
                scaleFactor: instance.data.mux_sprite_sheet_scale_factor
            });
        }

        // publish element dimensions
        instance.publishState("player_width", instance.canvas.width().toFixed(2));
        instance.publishState("player_height", instance.canvas.height().toFixed(2));

        // disable right click
        if (disable_right_click) {
            videoPlayer.on('contextmenu', function(e) {
                e.preventDefault();
            });
        }

        // disable fullscreen
        if (disable_fullscreen) {
            videoPlayer.one('loadedmetadata', function() {
                videoPlayer.tech_.off('dblclick');
                videoPlayer.controlBar.fullscreenToggle.hide();
            });

        }

        // load the poster (when not using as image viewer)
        if ((poster) && (!isImage)) {
            videoPlayer.poster(poster);
            document.getElementById('' + instance.data.elementId + '_html5_api').setAttribute('poster', poster);
            instance.publishState("poster", poster);

            // if always visible
            if (poster_always_visible) {
                $('.vjs-poster').css('display','block');
            }
        }

        // big play button
        if (big_play_button) {
            videoPlayer.bigPlayButton.show();
        } else {
            videoPlayer.bigPlayButton.hide();
        }

        // autoplay
        if (autoplay) {
            videoPlayer.play();
            instance.publishState("autoplay", true);
        } else {
            instance.publishState("autoplay", false);
        }

        // loop video
        if (loop) {
            videoPlayer.loop(true);
            instance.publishState("loop", true);
        } else {
            videoPlayer.loop(false);
            instance.publishState("loop", false);
        }

        // volume
        if ((instance.data.volumeReady != 'undefined') && volume) {
            videoPlayer.volume(volume);
        }

        // mute video
        if (muted) {
            videoPlayer.muted(true);
            instance.publishState("muted", true);
        } else {
            videoPlayer.muted(false);
            instance.publishState("muted", false);
        }

        // playback rate
        if (playback_rate) {
            videoPlayer.one('play', function () {
                videoPlayer.playbackRate(playback_rate);
            });
            instance.publishState("playback_rate", playback_rate);
        }

        // playback controls
        if (instance.data.volumeReady != 'undefined' && (playback_time_1 || playback_time_2 || playback_time_3)) {

            // get range values (seconds)
            if (playback_time_3) {
                var playback_time_min = playback_time_3[0] / 1000;
                var playback_time_max = playback_time_3[1] / 1000;
            } else if (playback_time_2) {
                var playback_time_min = playback_time_2[0] / 1000;
                var playback_time_max = playback_time_2[1] / 1000;
            }

            // play from min value
            if (play_from_min_value) {
                instance.data.play_from_min_value = playback_time_min;
            } else {
                instance.data.play_from_min_value = null;
            }

            // simple slider
            if (playback_time_1 != instance.data.pb) {
                videoPlayer.currentTime(playback_time_1);
                instance.data.pb = playback_time_1;
            }

            // pause video if not already before we scrub
            if (!videoPlayer.paused()) {
                videoPlayer.pause();
            }

            // range slider
            if (playback_time_min != instance.data.pb_min) {
                if (!min_value_scrubbing) {
                    videoPlayer.currentTime(playback_time_min);
                    instance.data.pb_min = playback_time_min;
                } else {
                    if ((playback_time_min + min_value_scrubbing) > min_value_scrubbing) {
                        videoPlayer.currentTime(playback_time_min);
                        instance.data.pb_min = playback_time_min;
                    }
                }
            }
            if (playback_time_max != instance.data.pb_max) {
                if (!max_value_scrubbing) {
                    videoPlayer.currentTime(playback_time_max);
                    instance.data.pb_max = playback_time_max;
                } else {
                    if ((playback_time_max + min_value_scrubbing) < max_value_scrubbing) {
                        videoPlayer.currentTime(playback_time_max);
                        instance.data.pb_max = playback_time_max;
                    }
                }
            }

            //update the range states with the time difference between the min and max values
            var playback_range_1_formatted = instance.data.secondsToTime((playback_time_2[1] - playback_time_2[0]) / 1000, true);
            var playback_range_2_formatted = instance.data.secondsToTime((playback_time_3[1] - playback_time_3[0]) / 1000, true);

            instance.publishState('playback_range_1_difference', (playback_time_2[1] - playback_time_2[0]) / 1000);
            instance.publishState('playback_range_2_difference', (playback_time_3[1] - playback_time_3[0]) / 1000);
            instance.publishState('playback_range_1_formatted', playback_range_1_formatted);
            instance.publishState('playback_range_2_formatted', playback_range_2_formatted);

        }

        // preload
        if (preload === "auto") {
            videoPlayer.preload("Auto");
            instance.publishState("preload", "Auto");
        } else if (preload === "metadata") {
            videoPlayer.preload("Metadata");
            instance.publishState("preload", "Metadata");
        } else if (preload === "none") {
            videoPlayer.preload("None");
            instance.publishState("preload", "None");
        }

        // viewport autoplay (binds and unbinds)
        if (auto_play_when_in_view) {
            instance.publishState("auto_play_when_in_view", true);
            $(instance.canvas).ready(function () {
                if (muted) {
                    videoPlayer.muted(true);
                    instance.publishState("muted", true);
                } else {
                    videoPlayer.muted(false);
                    instance.publishState("muted", false);
                }
            });
            $(window).scroll(function () {
                if ($(instance.canvas).is(":in-viewport")) {
                    if (videoPlayer.paused()) {
                        videoPlayer.play();
                    }
                } else {
                    if (!videoPlayer.paused()) {
                        videoPlayer.pause();
                    }
                }
            });
            if (auto_play_when_in_view_rg) {
                $('#' + auto_play_when_in_view_rg).scroll(function () {
                    if ($(instance.canvas).is(":in-viewport")) {
                        if (videoPlayer.paused()) {
                            videoPlayer.play();
                        }
                    } else {
                        if (!videoPlayer.paused()) {
                            videoPlayer.pause();
                        }
                    }
                });
            }
        } else {
            instance.publishState("auto_play_when_in_view", false);
        }

        // load theme
        if (theme === "Base") {
            videoContainer.classList.add("vjs-theme-base");
            instance.publishState("theme", "Base");
        }
        else if (theme === "City") {
            videoContainer.classList.add("vjs-theme-city");
            instance.publishState("theme", "City");
        }
        else if (theme === "Fantasy") {
            videoContainer.classList.add("vjs-theme-fantasy");
            instance.publishState("theme", "Fantasy");
        }
        else if (theme === "Forest") {
            videoContainer.classList.add("vjs-theme-forest");
            instance.publishState("theme", "Forest");
        }
        else if (theme === "Sea") {
            videoContainer.classList.add("vjs-theme-sea");
            instance.publishState("theme", "Sea");
        }
        else if (theme === "Custom") {
            if (css_skin_file) {
                var head = document.getElementsByTagName('head')[0];
                var style = document.createElement('link');
                style.href = css_skin_file;
                style.type = 'text/css';
                style.rel = 'stylesheet';
                head.append(style);
                videoContainer.classList.add("vjs-theme-custom");
            }
        }

        // control bar opacity
        if (instance.data.control_bar_opacity >= 0) {
            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = instance.data.control_bar_opacity;
            // control bar not clickable when it's set to 0
            if (instance.data.control_bar_opacity < 0.1) {
                document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.pointerEvents = 'none';
                // control bar clikable again
            } else {
                document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.pointerEvents = 'auto';
            }
        } else {
            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = 1;
        }

        // disable the loading spinner
        if (disable_spinner) {
            $('.vjs-loading-spinner').each(function(index, obj) {
                if (this.parentNode.id === "" + instance.data.elementId + "") {
                    this.remove();
                }
            });
        }

        // center play button
        if (centre_play) {
            videoContainer.classList.add("vjs-big-play-centered");
            instance.publishState("centre_play", true);
        } else {
            videoContainer.classList.remove("vjs-big-play-centered");
            instance.publishState("centre_play", false);
        }

        // show play button on pause
        if (show_button_on_pause) {
            videoContainer.classList.add("vjs-show-big-play-button-on-pause");
            instance.data.showButtonOnPause = true;
        } else {
            videoContainer.classList.remove("vjs-show-big-play-button-on-pause");
            instance.data.showButtonOnPause = false;
        }

        // show/hide control bar (when not using as image viewer)
        if (instance.canvas[0].style.visibility == 'hidden') {

            videoPlayer.controls(false);
            instance.publishState('control_bar_visible', false);
            instance.publishState("videojs_controls_enabled", false);
        } else {
            if ((controls) && (!isImage)) {
                videoPlayer.controls(true);
                instance.publishState('control_bar_visible', true);
                instance.publishState("videojs_controls_enabled", true);
            } else {
                videoPlayer.controls(false);
                instance.publishState('control_bar_visible', false);
                instance.publishState("videojs_controls_enabled", false);
            }
        }

        // object-fit on html5 video sources and the poster
        if (object_fit) {
            document.getElementById('' + instance.data.elementId + '_html5_api').style.objectFit = object_fit;
            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-poster')[0].style.backgroundSize = object_fit;
        }

        // background color for video and poster
        if (background_color) {
            document.getElementById('' + instance.data.elementId + '').style.backgroundColor = background_color;
            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-poster')[0].style.backgroundColor = background_color;
        }

        // zoom and rotate
        if (flip === 'left') {
            flip = -1;
        }
        if (flip === 'right') {
            flip = 1;
        }
        videoPlayer.zoomrotateflip({"rotate": "" + rotate + "", "zoom": "" + zoom + "", "flip": "" + flip + "", "debug": false});

        // aspect ratio
        if (aspect_ratio) {
            try {
                videoPlayer.aspectRatio('' + aspect_ratio + '');
                instance.publishState("aspect_ratio", "" + aspect_ratio + "");
                var one = aspect_ratio.substring(0, aspect_ratio.indexOf(":"));
                var two = aspect_ratio.split(":").pop();
                instance.data.aspectRatio = two / one;
                instance.data.resizeVideoJS();
                window.addEventListener("resize", instance.data.resizeVideoJS());
            }
            catch(err) {
                // nothing
            }
        }

        // populates the element Id state
        instance.publishState("element_id", "" + instance.data.elementId + "");

        // enables the large scrubbing interface
        if (enable_scrubbing_onload && number_of_tiles && sprite_sheet) {
            if (!instance.data.runOnce) {
                if (slider_show_onload) {
                    slider_show_onload = 'block';
                } else {
                    slider_show_onload = 'none';
                }
                $('#' + instance.data.elementId).prepend('<div id="scrubbing_interface" class="video-preview" data-frames="' + number_of_tiles + '" data-source="' + sprite_sheet + '"></div>');
                instance.data.runOnce = true;
                instance.data.scrubbing(slider_show_onload,slider_width,slider_color,scrubber_hide_on_click,slider_stay_visible);
            }
        }

    });


//# sourceURL=PLUGIN_1608469100580x213930232373051400_current/VideoJS-Advanced---MUX--All-Media---testing--update--VideoJS-Player-.js
})