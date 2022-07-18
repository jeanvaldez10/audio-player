function(instance, properties, context) {
    const { enable } = properties;
    if (instance.data.player) {
        if (enable) {
            instance.data.player.requestPictureInPicture();
        } else {
            instance.data.player.exitPictureInPicture();
        }
    }
}