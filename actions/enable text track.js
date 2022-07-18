function(instance, properties, context) {
    // get data
    let videoPlayer = instance.data.player;
    if (videoPlayer) {
        const { trackId } = properties;
        // change the text track by using the label name
        const tracks = videoPlayer.textTracks();

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];

            if (track.id === trackId) {
                track.mode = 'showing';
            } else {
                track.mode = 'disabled';
            }
        }
    }
}