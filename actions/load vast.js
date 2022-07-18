function(instance, properties, context) {
    let player = instance.data.player;
    if (player) {
        const {
            tag1,
            tag2,
            tag3,
            offset1,
            offset2,
            offset3,
        } = properties;
        let tags = [];

        if (tag1) {
            tags.push({
                tagURL: tag1,
                id: 'ads1',
                timeOffset: offset1 || undefined,
            })
        }

        if (tag2) {
            tags.push({
                tagURL: tag2,
                id: 'ads2',
                timeOffset: offset2 || undefined,
            })
        }

        if (tag3) {
            tags.push({
                tagURL: tag3,
                id: 'ads3',
                timeOffset: offset3 || undefined,
            })
        }
        player.vastAds && player.vastAds(tags);
    }
}
