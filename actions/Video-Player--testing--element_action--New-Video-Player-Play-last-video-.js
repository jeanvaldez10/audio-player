function(instance, properties, context) {

    const mainProperties = instance.data.properties;
    let playlist = instance.data.playlist;
    instance.data.counter = playlist.length -1;
    instance.data.updateVideojs(mainProperties);

}