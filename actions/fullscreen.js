let FSButton = false;

const isFullScreen = () => {
    return (
        document.fullScreenElement ||
        document.mozFullScreen ||
        document.webkitIsFullScreen
    );
};
/*
 if(!properties.remove_full_screen_button){
                 player.ready(function() {

                 var isFullScreenLocal = false;
                 var old_element = instance.canvas.find(".vjs-fullscreen-control.vjs-control.vjs-button").get(0) // fullscreen toggle button;
                 var new_element = old_element.cloneNode(true);
                 old_element.parentNode.replaceChild(new_element, old_element);

                 // Full screen
                 var videoElement = instance.canvas.get(0).firstChild;
                    // console.log(videoElement)
                 var parent = instance.canvas.get(0);

                    if(videoUrl.indexOf("vimeo") === -1){
                        $(new_element).off().click((e) => {

                         FSButton = true;
                         if (isFullScreen()) {
                             try {
                                 if (document.webkitExitFullscreen) {
                                     document.webkitExitFullscreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 } else if (document.mozCancelFullScreen) {
                                     document.mozCancelFullScreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 } else if (document.msExitFullscreen) {
                                     document.msExitFullscreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 } else if (document.exitFullscreen) {
                                     document.exitFullscreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 }
                                 FSButton = false;
                             } catch (e) {
                                 console.log('error exit fs:', e);
                             }
                         } else {
                             try {
                                 if (new_element.msRequestFullscreen) {
                                     document.body.append(videoElement);
                                     videoElement.msRequestFullscreen();
                                     isFullScreenLocal = true;
                                 } else if (new_element.mozRequestFullScreen) {
                                     document.body.append(videoElement);
                                     videoElement.mozRequestFullScreen();
                                     isFullScreenLocal = true;
                                 } else if (new_element.webkitRequestFullScreen) {
                                     document.body.append(videoElement);
                                     videoElement.webkitRequestFullScreen();
                                     isFullScreenLocal = true;
                                 } else if (new_element.requestFullscreen) {
                                     document.body.append(videoElement);
                                     videoElement.requestFullscreen();
                                     isFullScreenLocal = true;
                                 }
                             } catch (e) {
                                 console.log('error on enter fs:', e);
                             }
                         }

                     });
                    function exitHandler() {
                         if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                             try {
                                 if (document.webkitExitFullscreen) {
                                     document.webkitExitFullscreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 } else if (document.mozCancelFullScreen) {
                                     document.mozCancelFullScreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 } else if (document.msExitFullscreen) {
                                     document.msExitFullscreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 } else if (document.exitFullscreen) {
                                     document.exitFullscreen();
                                     parent.append(videoElement);
                                     isFullScreenLocal = false;
                                 }
                             } catch (e) {
                                 console.log('error exit fs:', e);
                             }
                         }
                     }

                     if (document.addEventListener && !FSButton) {
                         document.addEventListener('webkitfullscreenchange', exitHandler, false);
                         document.addEventListener('mozfullscreenchange', exitHandler, false);
                         document.addEventListener('fullscreenchange', exitHandler, false);
                         document.addEventListener('MSFullscreenChange', exitHandler, false);
                     }}



                 });
             }
*/
