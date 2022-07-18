function(instance, properties, context) {
    const player = instance.data.player;

    if (player) {
        let {
            trackId,
            track_file,
            content,
            kind,
            label,
            show_default,
            language,
            mode,
            replace,
            background,
            opacity,
            color,
            font_family,
            font_percentage,
            font_opacity,
            win_color,
            win_opacity,
            bottom,
            padding,
            position,
        } = properties;


        let format = properties.format ? properties.format.toLowerCase() : '';

        // these are also used within initialize in the textTrack change event
        const subBottom = bottom ? bottom + 'px' : '5px';
        const subPadding = padding ? padding + 'px': '5px';
        let subPosition = position ? position.toLowerCase() : 'bottom';
        if (subPosition === "bottom") {
            subPosition = "absolute";
        } else if (subPosition === "top") {
            subPosition = "initial";
        } else if (subPosition === "middle") {
            subPosition = "absolute";
        }

        if (!trackId) {
            // generate a random id just for the id attribute in the track tag
            const randomId = Math.floor((Math.random() * 100000) + 1);
            trackId = 'track_' + randomId;
        }

        let source;

        // used for converting srt to vtt
        function convertSrtCue(caption) {

            let cue = "";
            let s = caption.split(/\n/);

            while (s.length > 3) {
                for (var i = 3; i < s.length; i++) {
                    s[2] += "\n" + s[i]
                }
                s.splice(3, s.length - 3);
            }

            let line = 0;

            if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
                cue += s[0].match(/\w+/) + "\n";
                line += 1;
            }

            if (s[line].match(/\d+:\d+:\d+/)) {
                let m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
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

            let srt = data.replace(/\r+/g, '');
            srt = srt.replace(/^\s+|\s+$/g, '');

            let cuelist = srt.split('\n\n');
            let result = "";

            if (cuelist.length > 0) {
                result += "WEBVTT\n\n";
                for (let i = 0; i < cuelist.length; i=i+1) {
                    result += convertSrtCue(cuelist[i]);
                }
            }
            return result;
        }

        let ext;
        // get file extension when using the file url, or use the format value
        if (track_file) {
            ext = instance.data.getExtension(track_file).toLowerCase();
            if (!ext && !format) {
                instance.triggerEvent('text_track_invalid')
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
            const trackOptions = {
                src: "" + source + "",
                kind: "" + kind + "",
                label: "" + label + "",
                default: show_default,
                language: "" + language+ "",
                mode: "" + mode + "",
                id: trackId
            };

            if (replace) {
                let textTracks = player.textTracks();
                for (let i = 0; i < textTracks.length; i++) {
                    let track = textTracks[i];
                    track.mode = 'disabled';
                }
            }

            // add new track
            const newTrack = player.addRemoteTextTrack(trackOptions, false);
            instance.publishState('last_added_text_track', trackId);
            if (mode === 'showing') {
                instance.publishState('text_track', trackId);
                instance.triggerEvent('text_track_change');
            }
            instance.data.updateTracks();
            instance.triggerEvent('added_text_track');
            // event listener for cue changes, this gets recreated within initiliaze when the track is changed from the control bar
            newTrack.addEventListener('cuechange', () => {
                try {
                    document.getElementById('' + instance.data.playerId + '').getElementsByClassName('vjs-text-track-cue')[0].style.inset = null;
                    document.getElementById('' + instance.data.playerId + '').getElementsByClassName('vjs-text-track-cue')[0].style.bottom = "" + subBottom + "";
                    document.getElementById('' + instance.data.playerId + '').getElementsByClassName('vjs-text-track-cue')[0].style.padding = "" + subPadding + "";
                    document.getElementById('' + instance.data.playerId + '').getElementsByClassName('vjs-text-track-cue')[0].childNodes[0].style.padding = "" + subPadding + "";
                    document.getElementById('' + instance.data.playerId + '').getElementsByClassName('vjs-text-track-cue')[0].style.position = "" + subPosition + "";
                }
                catch(err) {
                    // error occassionally occurs but doesn't stop this from working so we just catch it here
                }
            });

            let settings = player.textTrackSettings;
            settings.setValues({
                "backgroundColor": "" + background + "",
                "backgroundOpacity": "" + opacity + "",
                "color": "" + color + "",
                "fontFamily": "" + font_family + "",
                "fontPercent": font_percentage,
                "textOpacity": "" + font_opacity + "",
                "windowColor": "" + win_color + "",
                "windowOpacity": "" + win_opacity + ""
            });
            settings.updateDisplay();

        }

        // set subtitles source and trigger processSubs function accordingly
        if (track_file) {

            if (ext === "srt") {
                function showGetResult (src, callback) {
                    return $.get(src, {}, callback);
                }
                showGetResult(track_file, function(data) {
                    let webvtt = srt2webvtt(data);
                    let vttBlob = new Blob([webvtt], {type : 'text/vtt'});
                    source = URL.createObjectURL(vttBlob);

                    // launch main function
                    processSubs(source);
                });
            }

            if (ext === "vtt") {

                // launch main function
                processSubs(track_file);
            }

        } else if (content && !track_file) {
            let vttBlob = new Blob([content], {type : 'text/vtt'});
            source = URL.createObjectURL(vttBlob);

            // launch main function
            processSubs(source);
        }

    }
}

