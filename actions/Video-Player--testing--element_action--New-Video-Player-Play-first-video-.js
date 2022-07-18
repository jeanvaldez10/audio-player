function(instance, properties, context) {
    const mainProperties = instance.data.properties;
    instance.data.counter = 0;
    instance.data.updateVideojs(mainProperties);
}