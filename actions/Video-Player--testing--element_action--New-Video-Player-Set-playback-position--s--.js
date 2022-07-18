function(instance, properties, context) {

    instance.publishState('current_time', properties.seconds);
    if (instance.data.player) instance.data.player.currentTime(properties.seconds);

}