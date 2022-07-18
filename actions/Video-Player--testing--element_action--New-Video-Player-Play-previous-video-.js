function(instance, properties, context) {

    let playlist = instance.data.playlist;
    const mainProperties = instance.data.properties;

    if(instance.data.counter > 0){
        instance.data.counter -= 1;
    } else {
        instance.data.counter = playlist.length -1;
    }
    instance.data.updateVideojs(mainProperties);

}