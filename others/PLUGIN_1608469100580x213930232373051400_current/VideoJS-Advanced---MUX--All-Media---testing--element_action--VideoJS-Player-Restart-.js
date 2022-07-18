(function anonymous(instance, properties, context
) {


    var existCondition = setInterval(function() {
        if ($('#' + instance.data.elementId).length) {

            clearInterval(existCondition);

            // get data
            var videoPlayer = instance.data.videoPlayer;
            var play = properties.play;

            // get playing status
            var isPaused = videoPlayer.paused();

            // reset time
            videoPlayer.currentTime(0);

            // control video
            if (play) {
                if (isPaused) {
                    videoPlayer.play();
                }
            }

            // update states since the video may not have played yet, meaning the timeupdate event wouldn't be setup
            if (Number.isFinite(videoPlayer.duration())) {
                instance.publishState("duration", videoPlayer.duration());
            }
            if (Number.isFinite(videoPlayer.currentTime())) {
                instance.publishState("current_time", videoPlayer.currentTime());
                instance.publishState("current_time_ms", videoPlayer.currentTime() * 1000);
            }
            if (Number.isFinite(videoPlayer.remainingTime())) {
                instance.publishState("current_time_remaining", videoPlayer.remainingTime());
                instance.publishState("current_time_remaining_ms", videoPlayer.remainingTime() * 1000);
            }

        }
    }, 100);


//# sourceURL=PLUGIN_1608469100580x213930232373051400_current/VideoJS-Advanced---MUX--All-Media---testing--element_action--VideoJS-Player-Restart-.js
})