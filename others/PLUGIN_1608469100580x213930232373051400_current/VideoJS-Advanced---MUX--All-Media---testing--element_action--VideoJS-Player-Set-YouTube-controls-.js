(function anonymous(instance, properties, context
) {


    // there's a couple of issues using this
    // when running for a second time on a video that was different from the first time it ran, it loads the first video again

    // it's because you're using videoElement.src and it doesn't update after loading a new video
    // running this action will also stop some videoJS events to not fire!

    // I don't think videoJS likes you touching the elements URL at all

    var existCondition = setInterval(function() {
        if ($('#' + instance.data.elementId).length) {

            clearInterval(existCondition);

            // get data
            var videoPlayer = instance.data.videoPlayer;
            var videoElement = document.getElementById(instance.data.elementId + "_youtube_api");
            if (videoElement) {
                var url = videoElement.src;
            }

            var controls = properties.controls;
            var fs = properties.fs;
            var color = properties.color;
            var cc_lang_pref = properties.cc_lang_pref;
            var cc_load_policy = properties.cc_load_policy;
            var disablekb = properties.disablekb;
            var hl = properties.hl;
            var iv_load_policy = properties.iv_load_policy;
            var modestbranding = properties.modestbranding;
            var playsinline = properties.playsinline;

            // regex patterns
            var regex_controls = /controls=([^&]*)/;
            var regex_fs = /fs=([^&]*)/;
            var regex_color = /color=([^&]*)/;
            var regex_cc_lang_pref = /cc_lang_pref=([^&]*)/;
            var regex_cc_load_policy = /cc_load_policy=([^&]*)/;
            var regex_disablekb = /disablekb=([^&]*)/;
            var regex_hl = /hl=([^&]*)/;
            var regex_iv_load_policy = /iv_load_policy=([^&]*)/;
            var regex_modestbranding = /modestbranding=([^&]*)/;
            var regex_playsinline = /playsinline=([^&]*)/;

            function controlProperties() {

                // set youtube parameters which are passed into the url

                // controls
                if (controls) {
                    // disable the standard videoJS controls when the YouTube controls are enabled
                    videoPlayer.controls(false);
                    instance.publishState("videojs_controls_enabled", false);

                    var paramSearch = url.search(regex_controls) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_controls, "controls=1");
                    } else {
                        url += "&controls=1";
                    }
                    instance.publishState("youtube_controls_enabled", true);
                } else {
                    var paramSearch = url.search(regex_controls) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_controls, "controls=0");
                    } else {
                        url += "&controls=0";
                    }
                    instance.publishState("youtube_controls_enabled", false);
                }

                // full screen
                if (fs) {
                    var paramSearch = url.search(regex_fs) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_fs, "fs=1");
                    } else {
                        url += "&fs=1";
                    }
                    instance.publishState("youtube_fullscreen_icon", true);
                } else {
                    var paramSearch = url.search(regex_fs) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_fs, "fs=0");
                    } else {
                        url += "&fs=0";
                    }
                    instance.publishState("youtube_fullscreen_icon", false);
                }

                // progress bar colour
                if (color) {
                    color = color.toLowerCase();
                    var paramSearch = url.search(regex_color) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_color, "color=" + color);
                    } else {
                        url += "&color=" + color;
                    }
                    instance.publishState("youtube_color", color);
                } else {
                    var paramSearch = url.search(regex_color) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_color, "color=red");
                    } else {
                        url += "&color=red";
                    }
                    instance.publishState("youtube_color", "red");
                }

                // language preference
                if (cc_lang_pref) {
                    cc_lang_pref = cc_lang_pref.toLowerCase();
                    var paramSearch = url.search(regex_cc_lang_pref) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_cc_lang_pref, "cc_lang_pref=" + cc_lang_pref);
                    } else {
                        url += "cc_lang_pref=" + cc_lang_pref;
                    }
                    instance.publishState("youtube_lang_pref", cc_lang_pref);
                } else {
                    var paramSearch = url.search(regex_cc_lang_pref) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_cc_lang_pref, "cc_lang_pref=\"\"");
                    } else {
                        url += "&cc_lang_pref=\"\"";
                    }
                    instance.publishState("youtube_lang_pref", "");
                }

                // cc load policy
                if (cc_load_policy) {
                    var paramSearch = url.search(regex_cc_load_policy) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_cc_load_policy, "cc_load_policy=1");
                    } else {
                        url += "&cc_load_policy=1";
                    }
                    instance.publishState("youtube_cc_load_policy", true);
                } else {
                    var paramSearch = url.search(regex_cc_load_policy) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_cc_load_policy, "cc_load_policy=0");
                    } else {
                        url += "&cc_load_policy=0";
                    }
                    instance.publishState("youtube_cc_load_policy", false);
                }

                // disable keyboard
                if (disablekb) {
                    var paramSearch = url.search(regex_disablekb) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_disablekb, "disablekb=1");
                    } else {
                        url += "&disablekb=1";
                    }
                    instance.publishState("youtube_disable_kb", true);
                } else {
                    var paramSearch = url.search(regex_disablekb) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_disablekb, "disablekb=0");
                    } else {
                        url += "&disablekb=0";
                    }
                    instance.publishState("youtube_disable_kb", false);
                }

                // interface language
                if (hl) {
                    hl = hl.toLowerCase();
                    var paramSearch = url.search(regex_hl) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_hl, "hl=" + hl);
                    } else {
                        url += "hl=" + hl;
                    }
                    instance.publishState("youtube_interface_lang", hl);
                } else {
                    var paramSearch = url.search(regex_hl) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_hl, "hl=\"\"");
                    } else {
                        url += "&hl=\"\"";
                    }
                    instance.publishState("youtube_interface_lang", "");
                }

                // iv load policy
                if (iv_load_policy) {
                    var paramSearch = url.search(regex_iv_load_policy) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_iv_load_policy, "iv_load_policy=1");
                    } else {
                        url += "&iv_load_policy=1";
                    }
                    instance.publishState("youtube_iv_load_policy", true);
                } else {
                    var paramSearch = url.search(regex_iv_load_policy) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_iv_load_policy, "iv_load_policy=0");
                    } else {
                        url += "&iv_load_policy=0";
                    }
                    instance.publishState("youtube_iv_load_policy", false);
                }

                // modestbranding
                if (modestbranding) {
                    var paramSearch = url.search(regex_modestbranding) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_modestbranding, "modestbranding=1");
                    } else {
                        url += "&modestbranding=1";
                    }
                    instance.publishState("youtube_modestbranding", true);
                } else {
                    var paramSearch = url.search(regex_modestbranding) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_modestbranding, "modestbranding=0");
                    } else {
                        url += "&modestbranding=0";
                    }
                    instance.publishState("youtube_modestbranding", false);
                }

                // playsinline
                if (playsinline) {
                    var paramSearch = url.search(regex_playsinline) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_playsinline, "playsinline=1");
                    } else {
                        url += "&playsinline=1";
                    }
                    instance.publishState("youtube_playsinline", true);
                } else {
                    var paramSearch = url.search(regex_playsinline) >= 0;
                    if (paramSearch) {
                        url = url.replace(regex_playsinline, "playsinline=0");
                    } else {
                        url += "&playsinline=0";
                    }
                    instance.publishState("youtube_playsinline", false);
                }

                // update url
                var sourceObject = {src: url, type: 'video/youtube'};
                videoPlayer.src(sourceObject);
                $("#" + instance.data.elementId + "_youtube_api").attr("src", "" + url + "");

                // remove the annoying spinner
                setTimeout(function() {
                    $('.vjs-loading-spinner').remove();
                }, 500);
            }

            // run when the youtube videoElement is available
            if (videoElement) {
                var isPlaying = !videoPlayer.paused();
                if (isPlaying) {
                    controlProperties();
                } else {
                    videoPlayer.one("play", controlProperties);
                    videoPlayer.play();
                }
            } else {
                console.log ("No element found to set controls for, you should have the YouTube player visible and a media loaded");
            }
        }
    }, 100);


//# sourceURL=PLUGIN_1608469100580x213930232373051400_current/VideoJS-Advanced---MUX--All-Media---testing--element_action--VideoJS-Player-Set-YouTube-controls-.js
})