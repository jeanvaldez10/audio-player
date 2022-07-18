(function anonymous(instance, properties, context
) {


    var existCondition = setInterval(function() {
        if ($('#' + instance.data.elementId).length) {

            clearInterval(existCondition);

            // get data
            var videoPlayer = instance.data.videoPlayer;
            var playbackRate = properties.playbackRate;

            // set playback rate
            if (playbackRate) {
                videoPlayer.playbackRate(playbackRate);
                instance.publishState("playback_rate", playbackRate);
            }

        }
    }, 100);


//# sourceURL=PLUGIN_1608469100580x213930232373051400_current/VideoJS-Advanced---MUX--All-Media---testing--element_action--VideoJS-Player-Set-playback-rate-.js
})