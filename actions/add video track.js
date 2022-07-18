function(instance, properties, context) {
    const videoPlayer = instance.data.player;
    const videoContainer = document.getElementById(instance.data.playerId);
    if (videoPlayer && videoContainer) {
        let {
            video_file,
            trackId,
            mime_type,
            kind,
            label,
            language,
            selected,
        } = properties;


        let ext = instance.data.getExtension(video_file);
        kind = kind?.toLowerCase();
        // set common mime type when mime type field is left empty
        if (!mime_type && ext) {
            mime_type = "video/"+ext+"";
        }

        if (!trackId) {
            // generate a random id just for the id attribute in the track tag
            const randomId = Math.floor((Math.random() * 100000) + 1);
            trackId = 'track_' + randomId;
        }

        const trackOptions = new videojs.VideoTrack({
            src: "" + video_file + "",
            kind: "" + kind + "",
            label: "" + label + "",
            language: "" + language + "",
            type: mime_type,
            id: trackId,
            selected,
        });

        // add new track
        videoPlayer.videoTracks().addTrack(trackOptions);
        instance.publishState('last_added_video_track', trackId);
        if (selected) {
            instance.publishState('video_track', trackId);
            instance.triggerEvent('video_track_change');
        }
        instance.data.updateTracks();
        instance.triggerEvent('added_video_track');
    }
}