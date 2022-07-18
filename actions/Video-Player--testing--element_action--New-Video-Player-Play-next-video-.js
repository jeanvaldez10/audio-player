function(instance, properties, context) {
  let playlist = instance.data.playlist;
  let mainProperties = instance.data.properties;
  if (properties.video_url) {
    instance.data.playlist.push(properties.video_url);
    const counter = playlist.indexOf(properties.video_url);
    if (counter > -1) {
      instance.data.counter = counter;
      instance.data.updateVideojs(
          mainProperties,
      );
    }
  } else {
    if (instance.data.counter < playlist.length - 1) {
      instance.data.counter += 1;
    } else {
      instance.data.counter = 0;
    }
    instance.data.updateVideojs(
      mainProperties,
    );
  }
}