function(instance, properties, context) {
    const { seconds = 15 } = properties;
    instance.data.forwardRewind(seconds);
}