function(instance, properties, context) {
    const videoPlayer = instance.data.player;
    const videoContainer = document.getElementById(instance.data.playerId);
    if (videoPlayer && videoContainer) {
        let {
            audio_file,
            trackId,
            mime_type,
            kind,
            label,
            language,
            loop,
            enabled,
            play_audio,
            play_video
        } = properties;


        let ext = instance.data.getExtension(audio_file);
        kind = kind?.toLowerCase();

        // set common mime type when mime type field is left empty
        if (!mime_type && ext) {
            mime_type = "audio/"+ext+"";
        }

        if (!trackId) {
            // generate a random id just for the id attribute in the track tag
            const randomId = Math.floor((Math.random() * 100000) + 1);
            trackId = 'track_' + randomId;
        }


        // create new audio element using trackId, is searched for in the audioTrackList change event defined within initialize
        let audioElement = document.createElement("audio");
        audioElement.id = "" + trackId + "";
        audioElement.src = "" + audio_file + "";
        audioElement.type = "" + mime_type + "";

        // set loop attribute
        if (loop) {
            audioElement.setAttribute('loop', true);
        }

        // append audioSource to the audioElement
        videoContainer.appendChild(audioElement);

        // options
        const trackOptions = new videojs.AudioTrack({
            src: "" + audio_file + "",
            kind: "" + kind + "",
            label: "" + label + "",
            language: "" + language + "",
            enabled: enabled,
            id: trackId
        });

        // add new track
        videoPlayer.audioTracks().addTrack(trackOptions);
        instance.publishState('last_added_audio_track', trackId);
        instance.data.updateTracks();
        if (enabled) {
            instance.publishState('audio_track', trackId);
            instance.triggerEvent('audio_track_change');
        }
        instance.triggerEvent('added_audio_track');

        // play audio
        if (play_audio && enabled) {
            setTimeout(function() {
                videoPlayer.muted(true);
                audioElement.play();
            }, 100);
        }

        // play video
        if (play_video) {
            videoPlayer.play();
        }
    }
}