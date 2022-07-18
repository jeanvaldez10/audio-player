(function anonymous(instance, context
) {


    // generate a random id for the element
    var randomId = Math.floor((Math.random() * 100000) + 1);
    var elementId = 'videoElement_' + randomId;
    var waveformId = 'waveForm_' + randomId;

    // options - youtube parameters cannot be set dynamically unless adding to the URL which breaks some videoJS events
    instance.data.options = {
        techOrder: ['html5', 'vimeo', 'youtube', 'wistia'],
        html5: {
            vhs: {
                experimentalLLHLS: true
            },
            nativeTextTracks: false // this makes subtitle styling possible on iPads
        },
        youtube: {
            ytControls: 2,
            autoplay: 0,
            fs: 1,
            iv_load_policy: 1, // 3 disables
            loop: 0,
            modestbranding: 1,
            playsinline: 1
        },
        playbackRates: [0.5, 1, 1.5, 2, 4, 8]
    }

    // add the video div
    instance.canvas.append("<div style='display:none;z-index:1' id='" + waveformId + "'></div><div class='ads'><div class='advertisement hide'>Advertisement</div><div class='skip hide'>Skip</div><div class='visit hide'>Visit</div></div><video id='" + elementId + "' data-setup='{}' class='video-js' type='*' playsinline allow='autoplay' style='width:100%;height:100%;'></video>");
    instance.data.dataSetup = $('#' + elementId).attr('data-setup', JSON.stringify(instance.data.options));
    instance.data.elementId = elementId;
    instance.data.waveformId = waveformId;

    $(document).ready(function() {

        // set a couple of states back to default values for use with in/out viewport events to stop them firing loads of times
        var inView = true;
        var outView = true;

        // load video player
        var videoPlayer;
        videoPlayer = videojs(elementId);

        // default youtube states
        instance.publishState("youtube_controls_enabled", true);
        instance.publishState("youtube_fullscreen_icon", true);
        instance.publishState("youtube_color", "red");
        instance.publishState("youtube_lang_pref", "");
        instance.publishState("youtube_cc_load_policy", false);
        instance.publishState("youtube_disable_kb", false);
        instance.publishState("youtube_interface_lang", "");
        instance.publishState("youtube_iv_load_policy", true);
        instance.publishState("youtube_modestbranding", true);
        instance.publishState("youtube_playsinline", true);

        // set the default quality resolution
        videoPlayer.qualityMenu({
            useResolutionLabels: true
        });

        // zoom plugin
        videoPlayer.zoomrotateflip({
            rotate: 0,
            zoom: 1,
            flip: 1,
            debug: false
        });

        // enable as default some seek controls
        videoPlayer.seekButtons({
            forward: 20,
            back: 10,
            forwardIndex: 1,
            backIndex: 1
        });

        // changes the mouse on ajax start (get vimeo video)
        $(document).ajaxStart(function() {
            $(document.body).css({'cursor' : 'wait'});
        }).ajaxStop(function() {
            $(document.body).css({'cursor' : 'default'});
        });

        // resize the player as page size changes to keep aspect ratio
        instance.data.resizeVideoJS = function resizeVideoJS() {
            var width = document.getElementById(instance.data.elementId).parentElement.offsetWidth;
            videoPlayer.width(width);
            instance.canvas.css("height", width * instance.data.aspectRatio);
        }

        // if the video is playing still when the element is made not visible, then this will stop it
        function pauseVideo() {
            if (!instance.canvas[0].bubble_data.bubble_instance._is_visible) {
                if (!videoPlayer.paused()) {
                    videoPlayer.pause();
                }
            }
        }
        $(window).click(pauseVideo);

        // setup a mutation observer to pause the video when it's not visible and disable the sound wave if it's enabled
        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {

                if (mutation.type == 'attributes') {
                    var currentDisplay = mutation.target.style.display;
                    var currentVisibility = mutation.target.style.visibility;

                    if (currentDisplay == 'none' || currentVisibility == 'hidden') {
                        // console.log("display has just changed to none or visibility has changed to hidden");

                        videoPlayer.pause();

                        // the new responsive engine is not hiding the control bar, not sure why but this will hide it
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = 0;
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.pointerEvents = 'none';

                        // sound wave disable
                        var waveForm = document.getElementById("" + instance.data.waveformId + "");
                        if (waveForm) {
                            while (waveForm.firstChild) {
                                waveForm.removeChild(waveForm.firstChild);
                                waveForm.style.width = "";
                                waveForm.style.height = "";
                            }
                            instance.data.wavesurfer_hasLoaded = false;
                        }

                    } else if (currentDisplay == 'block' || currentVisibility == '') {
                        // console.log("display has just changed to block or visibility has changed to visible");

                        // restore visibility on the control bar, is a problem with new responsive engine
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = instance.data.control_bar_opacity;
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-control-bar')[0].style.pointerEvents = 'auto';

                        // fixes the height being 0 when running on the old responsive engine and bubble's show action is run, it flickers on new engine though
                        // if you conditionally change the visibility based upon the value of a state it will be fine, older engine
                        if (instance.canvas.height() < 1) {
                            // instance.canvas.css("height", videoPlayer.videoHeight() + 30);
                        }

                    }

                    // if you ever need a mutation observer to happen only once, you can add this
                    // observer.disconnect();
                }

            });
        });
        let observerConfig = {
            childList: true,
            subtree: true,
            attributes: true
        };
        observer.observe(instance.canvas[0], {
            attributes: true
        });

        // controls the scrubber thumbnails on the progress bar - called from update/load media/load scrubber thumbnails
        instance.data.spriteThumbs = function spriteThumbs(player, options) {
            var url = options.url;
            var height = options.height;
            var width = options.width;
            var scaleFactor = options.scaleFactor;
            var dom = videojs.dom || videojs;
            var controls = player.controlBar;
            var progress = controls.progressControl;
            var seekBar = progress.seekBar;
            var mouseTimeDisplay = seekBar.mouseTimeDisplay;

            if (url && height && width && mouseTimeDisplay) {
                var img = dom.createEl('img', {
                    src: url
                });

                var tooltipStyle = function tooltipStyle(obj) {
                    Object.keys(obj).forEach(function (key) {
                        var val = obj[key];
                        var ttstyle = mouseTimeDisplay.timeTooltip.el().style;

                        if (val !== '') {
                            ttstyle.setProperty(key, val);
                        } else {
                            ttstyle.removeProperty(key);
                        }
                    });
                };

                var hijackMouseTooltip = function hijackMouseTooltip() {
                    var imgWidth = img.naturalWidth;
                    var imgHeight = img.naturalHeight;

                    if (player.controls() && imgWidth && imgHeight) {
                        var hoverPosition = parseFloat(mouseTimeDisplay.el().style.left);
                        hoverPosition = player.duration() * (hoverPosition / seekBar.currentWidth());

                        if (!isNaN(hoverPosition)) {
                            hoverPosition = hoverPosition / options.interval;
                            var playerWidth = player.currentWidth();
                            var scaleFactor = options.scaleFactor ? options.scaleFactor : 1;
                            var columns = imgWidth / width;
                            var scaledWidth = width * scaleFactor;
                            var scaledHeight = height * scaleFactor;
                            var cleft = Math.floor(hoverPosition % columns) * -scaledWidth;
                            var ctop = Math.floor(hoverPosition / columns) * -scaledHeight;
                            var bgSize = imgWidth * scaleFactor + 'px ' + imgHeight * scaleFactor + 'px';
                            var controlsTop = dom.getBoundingClientRect(controls.el()).top;
                            var seekBarTop = dom.getBoundingClientRect(seekBar.el()).top; // top of seekBar is 0 position

                            var topOffset = -scaledHeight - Math.max(0, seekBarTop - controlsTop);
                            tooltipStyle({
                                'width': scaledWidth + 'px',
                                'height': scaledHeight + 'px',
                                'background-image': 'url(' + url + ')',
                                'background-repeat': 'no-repeat',
                                'background-position': cleft + 'px ' + ctop + 'px',
                                'background-size': bgSize,
                                'top': topOffset + 'px',
                                'color': '#fff',
                                'text-shadow': '1px 1px #000',
                                'border': '1px solid #000',
                                'margin': '0 1px'
                            });
                        }
                    }
                };

                tooltipStyle({
                    'width': '',
                    'height': '',
                    'background-image': '',
                    'background-repeat': '',
                    'background-position': '',
                    'background-size': '',
                    'top': '',
                    'color': '',
                    'text-shadow': '',
                    'border': '',
                    'margin': ''
                });
                progress.on('mousemove', hijackMouseTooltip);
                progress.on('touchmove', hijackMouseTooltip);
                player.addClass('vjs-sprite-thumbnails');
            }
        }

        // controls the scrubbing interface over the video player - called from update/load scrubbing interface
        instance.data.scrubbing = function scrubbing(sliderShowOnLoad,sliderWidth,sliderColor,hideOnClick,stayVisible) {
            (function($) {
                $.fn.videoPreview = function(options) {
                    return this.each(function() {
                        var elm = $(this);
                        var frames = parseFloat(elm.data('frames'));

                        var img = $('<img/>', { 'src': elm.data('source') }).hide().css({
                            'position': 'absolute',
                            'cursor': 'pointer'
                        }).appendTo(elm);
                        var slider = $('<div/>').hide().css({
                            'display': '' + sliderShowOnLoad + '',
                            'width': '' + sliderWidth + 'px',
                            'left': instance.canvas.width() / 2,
                            'height': '100%',
                            'background': '' + instance.data.getRGB(sliderColor).toUpperCase() + '',
                            'position': 'absolute',
                            'z-index': '1',
                            'top': '0',
                            'opacity': 0.6,
                            'cursor': 'pointer'
                        }).appendTo(elm);

                        var width;

                        function defaultPos() {
                            img.css('left', -width * frames / 4);
                        }

                        img.load(function() {
                            $(this).show();
                            width = this.width / frames;
                            elm.css('width', width);
                            defaultPos();
                        });
                        elm.click(function(e) {
                            instance.triggerEvent('scrubber_clicked');
                            if (hideOnClick) {
                                elm.hide();
                                slider.hide();
                            }
                        });
                        elm.mousemove(function(e) {
                            var left = e.clientX - (window.scrollX + document.querySelector('#' + instance.data.elementId).getBoundingClientRect().left);
                            slider.show().css('left', left);
                            img.css('left', -Math.floor((left / width) * frames) * width);
                        }).mouseleave(function(e) {
                            if (!stayVisible) {
                                slider.hide();
                            }
                        });

                    });
                };
            })(jQuery);
            $('.video-preview').videoPreview();
        }

        // set some states to default values on load
        instance.publishState("is_playing", false);
        instance.publishState("playback_rate", 1);
        instance.publishState("volume", 1);
        instance.publishState("loading_time_events", false);

        // format time function (00:00:00)
        instance.data.secondsToTime = function secondsToTime(secs, split) {
            var hours = Math.floor(secs/3600);
            (hours >= 1) ? secs = secs - (hours*3600) : hours = '';
            ((hours > 0) && (hours < 10)) ? hours = '0'+hours : hours;

            var min = Math.floor(secs/60);
            (min >= 1) ? secs = secs - (min*60) : min = '00';
            if (!split) {
                ((secs > 0) && (secs < 10)) ? secs = '0'+Math.floor(secs) : secs = Math.floor(secs);
            } else {
                ((secs > 0) && (secs < 10)) ? secs = '0'+secs.toFixed(2) : secs = secs.toFixed(2);
            }
            ((min > 0) && (min < 10)) ? min = '0'+min : min;

            if (hours < 1) {
                return min+':'+secs;
            } else {
                return hours+':'+min+':'+secs;
            }
        };

        // used to format the times in control bar
        function customTimeFormat(seconds, guide) {
            seconds = seconds < 0 ? 0 : seconds;
            let s = Math.floor(seconds % 60);
            let m = Math.floor(seconds / 60 % 60);
            let h = Math.floor(seconds / 3600);
            let gm = Math.floor(guide / 60 % 60);
            let gh = Math.floor(guide / 3600); // handle invalid times

            if (isNaN(seconds) || seconds === Infinity) {
                // '-' is false for all relational operators (e.g. <, >=) so this setting adds the minimum number of fields specified by the guide
                h = m = s = '-';

                return h + ':' + s;
            } // check if we need to show hours

            h = h > 0 || gh > 0 ? h + ':' : ''; // if hours are showing, we may need to add a leading zero
            m = ((h || gm >= 10) && m < 10 ? '0' + m : m) + ':'; // check if leading zero is need for seconds

            h = parseInt(h) < 10 ? '0' + h : h;
            s = parseInt(s) < 10 ? '0' + s : s;

            return h + m + s;
        };

        // stops the poster from zooming when clicked
        $('.vjs-poster').css('pointer-events','none');

        // trigger events
        videoPlayer.on('ready', function() {
            instance.triggerEvent('is_ready');
        });

        videoPlayer.on('ended', function() {
            instance.publishState("is_playing", false);
            instance.triggerEvent('media_ended');
        });

        videoPlayer.controlBar.progressControl.on('click', function() {
            if (instance.data.play_from_min_value != null) {
                instance.data.progress_control_clicked = true;
            }
        });

        videoPlayer.controlBar.progressControl.seekBar.on('click', function() {
            if (instance.data.play_from_min_value != null) {
                instance.data.progress_control_clicked = true;
            }
        });

        videoPlayer.on('play', function() {

            // used inside update for the playback range scrubbing fields
            if (instance.data.play_from_min_value != null && !instance.data.progress_control_clicked) {
                videoPlayer.currentTime(instance.data.play_from_min_value);
            }

            // used in update to make sure the volume event doesn't trigger before the video begins to play
            instance.data.volumeReady = true;

            // when the audio track action has run, make sure we're playing the correct audio track
            if (instance.data.audioTrack) {
                for (var i = 0; i < audioTrackList.length; i++) {
                    var track = audioTrackList[i];
                    if (track.enabled) {
                        var audioElement = document.getElementById(track.id);
                        if (audioElement) {
                            audioElement.play();
                        }
                        return;
                    }
                }
            }

            // trigger the time update events
            videoPlayer.on('timeupdate', function() {
                instance.triggerEvent('timeupdate');

                if (Number.isFinite(this.duration())) {
                    instance.publishState("duration", this.duration());
                    instance.publishState("duration_text", instance.data.secondsToTime(this.duration()));

                    if (Number.isFinite(this.currentTime()) && this.currentTime() > 0 && this.duration() > 0) {
                        instance.publishState("percentage_played", (this.currentTime() / this.duration() * 100).toFixed(2));
                    }

                };

                if (Number.isFinite(this.currentTime())) {
                    instance.publishState("current_time", this.currentTime());
                    instance.publishState("current_time_ms", this.currentTime() * 1000);
                    instance.publishState("current_time_text", instance.data.secondsToTime(this.currentTime()));
                };

                if (Number.isFinite(this.remainingTime())) {
                    instance.publishState("current_time_remaining", this.remainingTime());
                    instance.publishState("current_time_remaining_ms", this.remainingTime() * 1000);
                    instance.publishState("current_time_remaining_text", instance.data.secondsToTime(this.remainingTime()));
                }

                instance.publishState("scrubbing", videoPlayer.scrubbing());
                instance.publishState("seeking", videoPlayer.seeking());

            });

            instance.publishState("is_playing", true);
            instance.triggerEvent('media_started');
        });

        // get click coordinates
        function getCoords(event) {
            var coord= {
                X: null,
                Y: null
            }

            // for touch devices
            var isTouchSupported = 'ontouchstart' in window;
            if (isTouchSupported) {
                if (event.clientX || event.clientX == 0) {
                    coord.X = event.clientX;
                    coord.Y = event.clientY;
                } else {
                    coord.X = event.touches[0].clientX;
                    coord.Y = event.touches[0].clientY;
                }
                return coord;
            }

            // for webkit browser like safari and chrome
            else if (event.offsetX || event.offsetX == 0) {
                coord.X = event.offsetX;
                coord.Y = event.offsetY;
                return coord;
            }

            // for mozilla firefox
            else if (event.layerX || event.layerX == 0) {
                coord.X = event.layerX;
                coord.Y = event.layerY;
                return coord;
            }
        }

        videoPlayer.bigPlayButton.on('click', function() {
            instance.triggerEvent('big_play_button_clicked');
        });

        $(instance.canvas).on("click touchstart", function(event) {
            if ((event.target.tagName === 'VIDEO') || ($('#' + waveformId).css('display') == 'block')) {
                instance.publishState("mouse_x_coords", getCoords(event).X);
                instance.publishState("mouse_y_coords", getCoords(event).Y);
                instance.triggerEvent('coordinates_changed');
            }
        });

        videoPlayer.on('fullscreenchange', function() {
            if (document.fullscreenElement) {
                instance.publishState("is_fullscreen", true);
                instance.triggerEvent('entered_fullscreen');
            } else {
                instance.publishState("is_fullscreen", false);
                instance.triggerEvent('exited_fullscreen');
            }
        });

        videoPlayer.on('pause', function() {
            instance.publishState("is_playing", false);
            instance.triggerEvent('media_paused')

            // when the audio track action has run, make sure we also pause any audio tracks
            if (instance.data.audioTrack) {
                var audios = document.getElementsByTagName('audio');
                for (var i = 0, len = audios.length; i < len;i++) {
                    audios[i].pause();
                }
            }
        });

        videoPlayer.on('loadeddata', function() {
            // only run these when wavesurfer isn't loaded, it can cause a reoccurring loop when you try enabling wavesurfer inside this event
            if (!instance.data.wavesurfer_hasLoaded) {

                // custom time formatting for user to configure in options
                if (instance.data.format_time) {
                    videojs.setFormatTime(customTimeFormat);
                }

                instance.triggerEvent('loadeddata');
                instance.publishState("loadeddata", true);
                instance.publishState("media_is_loading", false);
                instance.publishState("percentage_played");

                // publish video dimensions
                instance.publishState("video_width", videoPlayer.videoWidth());
                instance.publishState("video_height", videoPlayer.videoHeight());

                if (Number.isFinite(videoPlayer.duration())) {
                    instance.publishState("duration", videoPlayer.duration());
                }

            }
        });

        videoPlayer.textTracks().on("change", function action(event) {
            var showing = this.tracks_.filter(function (track) {
                if (track.mode === "showing") {

                    instance.publishState("subtitles_current_filename", track.src);
                    instance.publishState("subtitles_current_label", track.label);
                    instance.triggerEvent('subtitles_changed');

                    // make sure the styling is set as soon as the control bar option is changed
                    try {
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.inset = null;
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.bottom = "" + instance.data.subBottom + "";
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.top = "" + instance.data.subHeight + "";
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.padding = "" + instance.data.subPadding + "";
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.height = "" + instance.data.subHeight + "";
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].childNodes[0].style.padding = "" + instance.data.subPadding + "";
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].childNodes[0].style.lineHeight = "" + instance.data.subLineHeight + "";
                        document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.position = "" + instance.data.subPosition + "";
                    }
                    catch(err) {
                        // error will occur if subtitles changed from the control bar and they're not currently displayed, this is ok
                    }

                    // declare arrays
                    var sections = [];
                    var startTimes_formatted = [];
                    var endTimes_formatted = [];
                    var startTimes = [];
                    var endTimes = [];
                    var captions = [];

                    $.get(track.src, function(data) {

                        // read all captions into an array
                        var items = data.split(/\r?\n/);

                        // add data to state
                        var formatted_subs = '';
                        instance.publishState("subtitles_raw_vtt", data);

                        // loop through all lines
                        var lastTextItem = "";
                        $.each(items, function( index, value ) {

                            var item = items[index].split(/\r?\n/);
                            var last = index == items.length -1;

                            // filters
                            item.filter(function(text) {

                                // extracts text between any tags that may exist like <v>xxx</v>
                                if (text.match(/(<.*?>)(.*?)(<\/.*?>)/)) {
                                    text = text.match(/(<.*?>)(.*?)(<\/.*?>)/)[2];
                                }

                                // match the subtitles text, looks at previous text item to add to if neccessary (also matches hebrew/arabic text)
                                if ((text.match(/[A-Za-z]/) || text.match(/[־׀׃א-״؛-ي٭-ە‏ײַ-ﳝﶈ-ﷺﺂ-ﻼ]/)) && text.match(/^((?!line:).)*$/) && text.match(/^((?!position:).)*$/) && text.match(/^((?!size:).)*$/) && text.match(/^((?!align:).)*$/) && text.match(/^((?!line-).)*$/) && text.match(/^((?!vertical:).)*$/)) {
                                    if ((!text.match(/^[0-9 ]*$/)) && (!text.includes("WEBVTT")) || text.match(/[־׀׃א-״؛-ي٭-ە‏ײַ-ﳝﶈ-ﷺﺂ-ﻼ]/)) {

                                        if (lastTextItem) {
                                            captions[captions.length - 1] = lastTextItem + "\n" + text;
                                        } else {
                                            captions.push(text);
                                        }

                                        lastTextItem = text;
                                        formatted_subs = '' + formatted_subs + ' ' + text + '';
                                    }
                                } else {
                                    lastTextItem = "";
                                }

                                // match the times, split into start and end times
                                if (text.match(/^[0-9]*:/)) {

                                    var startTime = text.substr(0, text.indexOf('-->')).trim();
                                    var endTime = text.substr(text.indexOf("-->") + 3).trim();
                                    startTimes_formatted.push(startTime);
                                    endTimes_formatted.push(endTime)

                                    // these output a list of numbers which can be used to set video playback time
                                    startTimes.push(startTime.split(':').reduce((acc,time) => (60 * acc) + +time).toFixed(3));
                                    endTimes.push(endTime.split(':').reduce((acc,time) => (60 * acc) + +time).toFixed(3));
                                }

                            });

                            // puts formatted text into state
                            if (last) {
                                instance.publishState("subtitles_formatted", formatted_subs.trim());
                            }

                        });

                        // add sections to states
                        instance.publishState("subtitles_starttimes_formatted", startTimes_formatted);
                        instance.publishState("subtitles_endtimes_formatted", endTimes_formatted);
                        instance.publishState("subtitles_starttimes", startTimes);
                        instance.publishState("subtitles_endtimes", endTimes);
                        instance.publishState("subtitles_captions", captions);

                    });

                    // also initialized in the load subtitles action, needs recreating when changing from control bar
                    track.addEventListener('cuechange', () => {
                        var activeCue = track.activeCues[0];
                        try {

                            var currentCaption = activeCue.text;

                            // extracts text between any tags that may exist like <v>xxx</v>
                            if (currentCaption.match(/(<.*?>)(.*?)(<\/.*?>)/)) {
                                currentCaption = currentCaption.match(/(<.*?>)(.*?)(<\/.*?>)/)[2];
                            }

                            instance.publishState("subtitles_current_caption", currentCaption);
                            instance.publishState("subtitles_current_starttime", activeCue.startTime);
                            instance.publishState("subtitles_current_endtime", activeCue.endTime);
                            instance.publishState("subtitles_current_starttime_text", instance.data.secondsToTime(activeCue.startTime));
                            instance.publishState("subtitles_current_endtime_text", instance.data.secondsToTime(activeCue.endTime));

                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.inset = null;
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.bottom = "" + instance.data.subBottom + "";
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.top = "" + instance.data.subHeight + "";
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.padding = "" + instance.data.subPadding + "";
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.height = "" + instance.data.subHeight + "";
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].childNodes[0].style.padding = "" + instance.data.subPadding + "";
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].childNodes[0].style.lineHeight = "" + instance.data.subLineHeight + "";
                            document.getElementById('' + instance.data.elementId + '').getElementsByClassName('vjs-text-track-cue')[0].style.position = "" + instance.data.subPosition + "";
                        }
                        catch(err) {
                            // error occassionally occurs but doesn't stop this from working so we just catch it here
                        }
                    })

                };
            })[0];
        });

        videoPlayer.on('loadedmetadata', function() {
            // only run these when wavesurfer isn't loaded, it can cause a reoccurring loop when you try enabling wavesurfer inside this event
            if (!instance.data.wavesurfer_hasLoaded) {

                // custom time formatting for user to configure in options
                if (instance.data.format_time) {
                    videojs.setFormatTime(customTimeFormat);
                }

                instance.triggerEvent('loadedmetadata');
                instance.publishState("loadedmetadata", true);
                instance.publishState("media_is_loading", false);
                instance.publishState("percentage_played");

                // publish video dimensions
                instance.publishState("video_width", videoPlayer.videoWidth());
                instance.publishState("video_height", videoPlayer.videoHeight());

                if (Number.isFinite(videoPlayer.duration())) {
                    instance.publishState("duration", videoPlayer.duration());
                }

                // fixes the wistia player size when loading videos
                setTimeout(function() {
                    var wistiaDiv = document.getElementById("" + elementId + "").getElementsByClassName("wistia_embed")[0];
                    if (wistiaDiv) {
                        wistiaDiv.style.height = '';
                    }
                }, 500);

                // trigger event when video is in/out view
                $(window).scroll(function() {
                    if ($(instance.canvas).is(":in-viewport")) {
                        if (inView) {
                            instance.triggerEvent('in_viewport');
                            inView = false;
                            outView = true;
                        }
                    } else {
                        if (outView) {
                            instance.triggerEvent('out_viewport');
                            outView = false;
                            inView = true;
                        }
                    }
                });
            }
        });

        videoPlayer.on('error', function() {
            instance.triggerEvent('error');
            var error = videoPlayer.error();
            instance.publishState("media_error_description", error.message);
            instance.publishState("media_error_code", error.code);
            if (error.code === 0) {
                instance.publishState("media_error_type", "MEDIA_ERR_CUSTOM");
            } else if (error.code === 1) {
                instance.publishState("media_error_type", "MEDIA_ERR_ABORTED");
            } else if (error.code === 2) {
                instance.publishState("media_error_type", "MEDIA_ERR_NETWORK");
            } else if (error.code === 3) {
                instance.publishState("media_error_type", "MEDIA_ERR_DECODE");
            } else if (error.code === 4) {
                instance.publishState("media_error_type", "MEDIA_ERR_SRC_NOT_SUPPORTED");
            } else if (error.code === 5) {
                instance.publishState("media_error_type", "MEDIA_ERR_ENCRYPTED");
            }
        });

        videoPlayer.on('useractive', function() {
            instance.triggerEvent('useractive');
            // when auto hide/show mouse option is enabled
            if (instance.data.auto_hide_control_bar) {
                document.getElementById('' + elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = instance.data.control_bar_opacity;
                $(document.body).css({'cursor' : 'default'});
                // update state
                if (instance.data.volumeReady) {
                    instance.publishState('control_bar_visible', true);
                }
            }
        });

        videoPlayer.on('userinactive', function() {
            instance.triggerEvent('userinactive');
            // when auto hide/show mouse option is enabled
            if (instance.data.auto_hide_control_bar) {
                document.getElementById('' + elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = 0;
                if (document.getElementById(elementId).matches(':hover')) {
                    $(document.body).css({'cursor' : 'none'});
                }
                // update state
                if (instance.data.volumeReady) {
                    instance.publishState('control_bar_visible', false);
                }
            }
        });

        videoPlayer.on('mouseover', function() {
            // when auto hide/show mouse option is enabled
            if (instance.data.auto_hide_control_bar) {
                setTimeout(function () {
                    document.getElementById('' + elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = instance.data.control_bar_opacity;
                }, 200);
                // update state
                if (instance.data.volumeReady) {
                    instance.publishState('control_bar_visible', true);
                }
            }
            if (instance.data.play_on_hover) {
                videoPlayer.play();
            }
        })

        videoPlayer.on('mouseout', function() {
            // when auto hide/show mouse option is enabled
            if (instance.data.auto_hide_control_bar) {
                setTimeout(function () {
                    document.getElementById('' + elementId + '').getElementsByClassName('vjs-control-bar')[0].style.opacity = 0;
                }, 200);
                // update state
                if (instance.data.volumeReady) {
                    instance.publishState('control_bar_visible', false);
                }
            }
            if (instance.data.play_on_hover) {
                videoPlayer.pause();
            }
        })

        videoPlayer.on('volumechange', function() {
            instance.publishState("volume", this.volume());
            instance.triggerEvent('volumechange');
        });

        videoPlayer.on('progress', function() {
            if (Number.isFinite(videoPlayer.bufferedPercent())) {
                var buffPerc = (videoPlayer.bufferedPercent()*100).toFixed(2);
                instance.publishState("buffer_percentage", buffPerc);
            }
        });

        videoPlayer.on('enterpictureinpicture', function() {
            instance.publishState("pip", true);
        });

        videoPlayer.on('leavepictureinpicture', function() {
            instance.publishState("pip", false);
        });

        var audioTrackList = videoPlayer.audioTracks();
        audioTrackList.addEventListener('change', function() {

            // pause all audios first!
            var audios = document.getElementsByTagName('audio');
            for (var i = 0, len = audios.length; i < len;i++) {
                audios[i].pause();
            }

            // search through track list and play enabled one
            for (var i = 0; i < audioTrackList.length; i++) {
                var track = audioTrackList[i];
                if (track.enabled) {
                    var audioElement = document.getElementById(track.id);
                    audioElement.play();
                    return;
                }
            }
            instance.triggerEvent('audio_track_changed');

        });

        instance.data.videoPlayer = videoPlayer;

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
            for(var i = 0; i <ca.length; i++) {
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

        // store element id into cookie
        var elementCookie = getCookie("elements");
        var comma = ",";
        if (!elementCookie) {
            comma = "";
        }
        setCookie("elements", "" + elementCookie + "" + comma + "" + elementId + "", 30);

        // function to get hex colors
        instance.data.getRGB = function getRGB(str) {
            var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
            var result = " " + match[1] + "," + match[2] + "," + match[3] + "";
            r = parseInt(match[1]).toString(16);
            g = parseInt(match[2]).toString(16);
            b = parseInt(match[3]).toString(16);
            if (r.length == 1)
                r = "0" + r;
            if (g.length == 1)
                g = "0" + g;
            if (b.length == 1)
                b = "0" + b;
            return "#" + r + g + b;
        }

        // run once variable used for scrubbing function in update
        instance.data.runOnce = false;

        // run once variable used when setting the MUX option to yes
        instance.data.initMux = false;

    });


//# sourceURL=PLUGIN_1608469100580x213930232373051400_current/VideoJS-Advanced---MUX--All-Media---testing--initialize--VideoJS-Player-.js
})