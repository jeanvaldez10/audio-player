function(instance, properties, context) {
    const player = instance.data.player;

    if (player) {
        const {
            track_file,
            format,
            content,
            kind,
            label,
            isDefault,
            language,
            mode,
            replace,
            background,
            opacity,
            color,
            font_family,
            font_size,
            font-
        }
        var track_file = properties.track_file;
        var format = properties.format ? properties.format.toLowerCase() : '';
        var content = properties.content;
        var kind = properties.kind.toLowerCase();
        var label = properties.label ? properties.label.charAt(0).toUpperCase() + properties.label.slice(1) : 'Default';
        var isdefault = properties.default;
        var srclang = properties.srclang ? properties.srclang : 'en';
        var mode = properties.mode;
        var keep_previous_visible = properties.keep_previous_visible;

        var background_color = properties.background_color ? properties.background_color : 'Black';
        var background_opacity = properties.background_opacity ? properties.background_opacity : 'Transparent';
        var text_color = properties.text_color;
        var edge_style = properties.edge_style;
        var font_family = properties.font_family;
        var font_percent = properties.font_percent;
        var text_opacity = properties.text_opacity;
        var window_color = properties.window_color;
        var window_opacity = properties.window_opacity;

        // these are also used within initialize in the textTrack change event
        instance.data.subBottom = properties.bottom ? properties.bottom : '5px';
        instance.data.subPadding = properties.padding ? properties.padding : '5px';
        instance.data.subPosition = properties.position ? properties.position.toLowerCase() : 'bottom';
        instance.data.subLineHeight = properties.line_height ? properties.line_height : '1.4';

        // set the styling option values
        if (background_color == "Black") {
            background_color = "#000";
        } else if (background_color == "Blue") {
            background_color = "#00F";
        } else if (background_color == "Cyan") {
            background_color = "#0FF";
        } else if (background_color == "Green") {
            background_color = "#0F0";
        } else if (background_color == "Magenta") {
            background_color = "#F0F";
        } else if (background_color == "Red") {
            background_color = "#F00";
        } else if (background_color == "White") {
            background_color = "#FFF";
        } else if (background_color == "Yellow") {
            background_color = "#FF0";
        }

        if (text_color == "Black") {
            text_color = "#000";
        } else if (text_color == "Blue") {
            text_color = "#00F";
        } else if (text_color == "Cyan") {
            text_color = "#0FF";
        } else if (text_color == "Green") {
            text_color = "#0F0";
        } else if (text_color == "Magenta") {
            text_color = "#F0F";
        } else if (text_color == "Red") {
            text_color = "#F00";
        } else if (text_color == "White") {
            text_color = "#FFF";
        } else if (text_color == "Yellow") {
            text_color = "#FF0";
        }

        if (window_color == "Black") {
            window_color = "#000";
        } else if (window_color == "Blue") {
            window_color = "#00F";
        } else if (window_color == "Cyan") {
            window_color = "#0FF";
        } else if (window_color == "Green") {
            window_color = "#0F0";
        } else if (window_color == "Magenta") {
            window_color = "#F0F";
        } else if (window_color == "Red") {
            window_color = "#F00";
        } else if (window_color == "White") {
            window_color = "#FFF";
        } else if (window_color == "Yellow") {
            window_color = "#FF0";
        }

        if (background_opacity == "Opaque") {
            background_opacity = "1";
        } else if (background_opacity == "Semi-Transparent") {
            background_opacity = "0.5";
        } else if (background_opacity == "Transparent") {
            background_opacity = "0";
        }

        if (text_opacity == "Opaque") {
            text_opacity = "1";
        } else if (text_opacity == "Semi-Transparent") {
            text_opacity = "0.5";
        }

        if (window_opacity == "Opaque") {
            window_opacity = "1";
        } else if (window_opacity == "Semi-Transparent") {
            window_opacity = "0.5";
        } else if (window_opacity == "Transparent") {
            window_opacity = "0";
        }

        if (font_family == "Proportional Sans-Serif") {
            font_family = "proportionalSansSerif";
        } else if (font_family == "Monospace Sans-Serif") {
            font_family = "monospaceSansSerif";
        } else if (font_family == "Proportional Serif") {
            font_family = "proportionalSerif";
        } else if (font_family == "Monospace Serif") {
            font_family = "monospaceSerif";
        } else if (font_family == "Casual") {
            font_family = "casual";
        } else if (font_family == "Script") {
            font_family = "script";
        } else if (font_family == "Small Caps") {
            font_family = "small-caps";
        }

        if (instance.data.subPosition == "bottom") {
            instance.data.subPosition = "absolute";
        } else if (instance.data.subPosition == "top") {
            instance.data.subPosition = "initial";
        } else if (instance.data.subPosition == "middle") {
            instance.data.subPosition = "absolute";
            instance.data.subHeight = "50%";
        }

        // generate a random id just for the id attribute in the track tag
        var randomId = Math.floor((Math.random() * 100000) + 1);
        var trackId = 'track_' + randomId;
        var source;

        // format time function (00:00:00)
        function secondsToTime(secs) {
            var hours = Math.floor(secs/3600);
            (hours >= 1) ? secs = secs - (hours*3600) : hours = '00';
            ((hours > 0) && (hours < 10)) ? hours = '0'+hours : hours;

            var min = Math.floor(secs/60);
            (min >= 1) ? secs = secs - (min*60) : min = '00';
            ((secs > 0) && (secs < 10)) ? secs = '0'+(secs).toFixed(3) : secs = (secs).toFixed(3);
            ((min > 0) && (min < 10)) ? min = '0'+min : min;

            return hours+':'+min+':'+secs;
        };

        // used for converting srt to vtt
        function convertSrtCue(caption) {

            var cue = "";
            var s = caption.split(/\n/);

            while (s.length > 3) {
                for (var i = 3; i < s.length; i++) {
                    s[2] += "\n" + s[i]
                }
                s.splice(3, s.length - 3);
            }

            var line = 0;

            if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
                cue += s[0].match(/\w+/) + "\n";
                line += 1;
            }

            if (s[line].match(/\d+:\d+:\d+/)) {
                var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
                if (m) {
                    cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
                        +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
                    line += 1;
                } else {
                    return "";
                }
            } else {
                return "";
            }

            if (s[line]) {
                cue += s[line] + "\n\n";
            }
            return cue;
        }

        // used for converting srt to vtt
        function srt2webvtt(data) {

            var srt = data.replace(/\r+/g, '');
            srt = srt.replace(/^\s+|\s+$/g, '');

            var cuelist = srt.split('\n\n');
            var result = "";

            if (cuelist.length > 0) {
                result += "WEBVTT\n\n";
                for (var i = 0; i < cuelist.length; i=i+1) {
                    result += convertSrtCue(cuelist[i]);
                }
            }
            return result;
        }

        // function to get file extension
        function getExtension(path) {
            var basename = path.split(/[\\/]/).pop();
            var pos = basename.lastIndexOf(".");
            if (basename === "" || pos < 1) {
                return "";
            }
            return basename.slice(pos + 1); // return ext
        }

        // get file extension when using the file url, or use the format value
        if (src) {
            var ext = getExtension(src).toLowerCase();
            if (!ext && !format) {
                alert("When supplying a subtitles URL that doesn't contain the filename, you need to select a format of either SRT / VTT");
            }
            if (!ext && format) {
                ext = format;
            }
            if (ext && format) {
                ext = format;
            }
        }

        // main function to process, load and manipulate the subtitles
        function processSubs(source) {

            // options
            var trackOptions = {
                src: "" + source + "",
                kind: "" + kind + "",
                label: "" + label + "",
                default: isdefault,
                srclang: "" + srclang + "",
                mode: "" + mode + "",
                id: trackId
            }

            // disable any subtitle tracks that may already be in place, so the new one becomes active upon loading if keep_previous_visible is false
            if (!keep_previous_visible) {
                var textTrack = videoPlayer.textTracks();
                for (var i = 0; i < textTrack.length; i++) {
                    var track = textTrack[i];
                    track.mode = 'disabled';
                }
            } else {
                var textTrack = videoPlayer.textTracks();
                for (var i = 0; i < textTrack.length; i++) {
                    var track = textTrack[i];
                    track.mode = 'showing';
                }
            }

            // add new track
            videoPlayer.addRemoteTextTrack(trackOptions, false);

            // event listener for cue changes, this gets recreated within initiliaze when the track is changed from the control bar
            textTrack = videoPlayer.textTracks()[0];
            textTrack.addEventListener('cuechange', () => {
                var activeCue = textTrack.activeCues[0];
                try {

                    var currentCaption = activeCue.text;

                    // extracts text between any tags that may exist like <v>xxx</v>
                    if (currentCaption.match(/(<.*?>)(.*?)(<\/.*?>)/)) {
                        currentCaption = currentCaption.match(/(<.*?>)(.*?)(<\/.*?>)/)[2];
                    }

                    instance.publishState("subtitles_current_caption", currentCaption);
                    instance.publishState("subtitles_current_starttime", activeCue.startTime);
                    instance.publishState("subtitles_current_endtime", activeCue.endTime);
                    instance.publishState("subtitles_current_starttime_text", secondsToTime(activeCue.startTime));
                    instance.publishState("subtitles_current_endtime_text", secondsToTime(activeCue.endTime));

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
            });

            var settings = videoPlayer.textTrackSettings;
            settings.setValues({
                "backgroundColor": "" + background_color + "",
                "backgroundOpacity": "" + background_opacity + "",
                "color": "" + text_color + "",
                "edgeStyle": "" + edge_style + "",
                "fontFamily": "" + font_family + "",
                "fontPercent": font_percent,
                "textOpacity": "" + text_opacity + "",
                "windowColor": "" + window_color + "",
                "windowOpacity": "" + window_opacity + ""
            });
            settings.updateDisplay();

            // declare arrays
            var sections = [];
            var startTimes_formatted = [];
            var endTimes_formatted = [];
            var startTimes = [];
            var endTimes = [];
            var captions = [];

            // if you have to modify this section then do the same in the change event within initialize
            $.get(source, function(data) {

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

                        // extracts text between any tags like <v>xxx</v>
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

        }

        // set subtitles source and trigger processSubs function accordingly
        if (src) {

            if (ext == "srt") {
                function showGetResult (src, callback) {
                    return $.get(src, {}, callback);
                }
                showGetResult(src, function(data) {
                    var webvtt = srt2webvtt(data);
                    var vttBlob = new Blob([webvtt], {type : 'text/vtt'});
                    source = URL.createObjectURL(vttBlob);

                    // launch main function
                    processSubs(source);
                });
            }

            if (ext == "vtt") {

                // launch main function
                processSubs(src);
            }
            instance.publishState("subtitles", "" + src + "");

        } else if (content && !src) {
            var vttBlob = new Blob([content], {type : 'text/vtt'});
            source = URL.createObjectURL(vttBlob);
            instance.publishState("subtitles", "No file url specified as using Content");

            // launch main function
            processSubs(source);
        }

    }
}

