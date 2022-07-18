function(instance, properties, context) {
    // get data
    let videoPlayer = instance.data.player;
    if (videoPlayer) {
        // Get all audio tracks for the current player.
        let tracks = videoPlayer.audioTracks();
        const { trackId, enabled } = properties;
        for (let i = 0; i < tracks.length; i++) {
            let track = tracks[i];

            // Find the track and mark it as enabled
            if (trackId === track.id) {
                track.enabled = enabled ;
            }
        }
    }
}