function(instance, properties, context) {

    const player = instance.data.player;
    if (player.isFullscreen()) {
        player.exitFullscreen();
    } else {
        player.requestFullscreen();
    }

}