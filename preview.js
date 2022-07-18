function(instance, properties) {

    let box = $(`<div style="display: flex;justify-content: center; align-items: center;">
                   <img src="//dd7tel2830j4w.cloudfront.net/f1657552315564x693689462089470800/preview.png" style="width: 100%; height: 100%;" />
                </div>`);
    instance.canvas.append(box);
    box.width(properties.bubble.width);
    box.height(properties.bubble.height);
}
