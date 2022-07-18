(function anonymous(instance, properties, context
) {


    var existCondition = setInterval(function () {
        if ($('#' + instance.data.elementId).length) {

            clearInterval(existCondition);

            // get data
            var videoPlayer = instance.data.videoPlayer;
            var seek_enabled = properties.seek_enabled;
            var seek_back = properties.seek_back;
            var seek_forward = properties.seek_forward;
            var remaining_time = properties.remaining_time;
            var full_screen = properties.full_screen;
            var progress_control_bar = properties.progress_control_bar;
            var playback_rate = properties.playback_rate;
            var use_small_font_size = properties.use_small_font_size;
            var picture_in_picture = properties.picture_in_picture;
            var play_button = properties.play_button;
            var volume_panel = properties.volume_panel;
            var hls_quality = properties.hls_quality;
            var control_bar_opacity = properties.control_bar_opacity;

            // this will wait for the control bar to become available
            if (document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar').length) {

                // set seek values
                if (seek_enabled) {
                    if ((seek_back) && (seek_forward)) {
                        videoPlayer.controlBar.seekBack.hide();
                        videoPlayer.controlBar.seekForward.hide();

                        videoPlayer.seekButtons( {
                            forward: seek_forward,
                            back: seek_back
                        });

                    } else {
                        videoPlayer.controlBar.seekBack.show();
                        videoPlayer.controlBar.seekForward.show();
                    }
                } else {
                    videoPlayer.controlBar.seekBack.hide();
                    videoPlayer.controlBar.seekForward.hide();
                }

                // set remaining time
                if (remaining_time) {
                    videoPlayer.controlBar.remainingTimeDisplay.show();
                } else {
                    videoPlayer.controlBar.remainingTimeDisplay.hide();
                }

                // set full screen
                if (full_screen) {
                    videoPlayer.controlBar.fullscreenToggle.show();
                } else {
                    videoPlayer.controlBar.fullscreenToggle.hide();
                }

                // set progress control bar
                if (progress_control_bar) {
                    videoPlayer.controlBar.progressControl.show();
                } else {
                    videoPlayer.controlBar.progressControl.hide();
                }

                // set playback rate
                if (playback_rate) {
                    videoPlayer.controlBar.playbackRateMenuButton.show();
                    if (use_small_font_size) {
                        $('.vjs-playback-rate-value').css('font-size', '1.1em');
                        $('.vjs-playback-rate-value').css('line-height', '2.8');
                    }
                } else {
                    videoPlayer.controlBar.playbackRateMenuButton.hide();
                }

                // set picture in picture (doesn't work in firefox)
                if (navigator.userAgent.toLowerCase().indexOf('firefox') > - 1) {
                    console.log("Firefox browser detected, disabling the videoJS picture in picture controls since they're not supporting the PiP web API for this right now")
                } else {
                    if (picture_in_picture) {
                        videoPlayer.controlBar.pictureInPictureToggle.show();
                    } else {
                        videoPlayer.controlBar.pictureInPictureToggle.hide();
                    }
                }

                // set play button
                if (play_button) {
                    videoPlayer.controlBar.playToggle.show();
                } else {
                    videoPlayer.controlBar.playToggle.hide();
                }

                // set volume panel
                if (volume_panel) {
                    videoPlayer.controlBar.volumePanel.show();
                } else {
                    videoPlayer.controlBar.volumePanel.hide();
                }

                // set hls quality
                if (hls_quality) {
                    document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-quality-menu-wrapper')[0].style.display = "block";
                } else {
                    document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-quality-menu-wrapper')[0].style.display = "none";
                }

                // set control bar opacity
                if (control_bar_opacity >= 0) {
                    setTimeout(function () {
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = control_bar_opacity;
                    }, 500);
                }

            } else {
                alert("You're attempting to run the 'Set VideoJS controls' action when the controls are hidden");
            }

        }
    }, 100);


//# sourceURL=PLUGIN_1608469100580x213930232373051400_current/VideoJS-Advanced---MUX--All-Media---testing--element_action--VideoJS-Player-Set-VideoJS-controls-.js
})