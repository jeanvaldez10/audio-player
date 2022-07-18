function(instance, properties, context) {
    // get data
    let videoPlayer = instance.data.player;
    if (videoPlayer) {
        const { trackId, selected } = properties;
        // Get all video tracks for the current player.
        let tracks = videoPlayer.videoTracks();

        for (let i = 0; i < tracks.length; i++) {
            let track = tracks[i];
            // Find the track and mark it as enabled
            if (trackId === track.id) {
                track.selected = selected ;
            }
        }
    }
}