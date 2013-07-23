

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
 
window.requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame
    })();
 
var video;
var width;
var height;
var canvas;
var images = [];
var ctx;
var result;
var capture;
var loopnum;
var startTime;
var capturing = false;
var msgdiv;
var progress;
var startButton;
var stopButton;

 
/**
 * Set the HTML elements we need.
 */
function initvideo() {
    video = document.getElementById('campreview');
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    result = document.getElementById('result');
    msgdiv = document.getElementById('information');
    progress = document.getElementById('progress');
    startButton = document.getElementById('startButton');
    stopButton = document.getElementById('stopButton');
}
 
/**
 * Capture the next frame of the video.
 */


function nextFrame(){
    if(capturing){
        var imageData;
        ctx.drawImage(video, 0, 0, width, height);
        imageData = ctx.getImageData(0, 0, width, height);
        function multiply(topValue, bottomValue){
  		return topValue * bottomValue / 255;
		}
        pix = imageData.data;
		if( filterType == "multiply" ){
			// Loop over each pixel and change the color.
			for (var i = 0, n = pix.length; i < n; i += 4) {
			    pix[i  ] = multiply(multiplyColor[0], pix[i  ]); // red
			    pix[i+1] = multiply(multiplyColor[1], pix[i+1]); // green
			    pix[i+2] = multiply(multiplyColor[2], pix[i+2]); // blue
			    // pix[i+3] is alpha channel (ignored)
			}
		}
		if( filterType == "greyscale" ){
			for (var i = 0, n = pix.length; i < n; i += 4) {
				var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
				pix[i  ] = grayscale; 	// red
				pix[i+1] = grayscale; 	// green
				pix[i+2] = grayscale; 	// blue
			// alpha
			}
		}
		if( filterType == "blur" ){
			JSManipulate.blur.filter(imageData, {amount: 10}); 
		}
		
		if( filterType == "water" ){
			JSManipulate.waterripple.filter(imageData);
			
		}
		if( filterType == "sparkle" ){
			JSManipulate.sparkle.filter(imageData, { amount: 100 ,randomness: 50 });
			
		}
		if( filterType == "kaleidoscope" ){
			JSManipulate.kaleidoscope.filter(imageData, { angle: 45, rotation: 30, sides: 3, centerX: 0.6, centerY: 0.5 });
			
		}
		
		// Draw the result on the canvas
		ctx.putImageData(imageData, 0, 0);
        
        
        images.push({duration : new Date().getTime() - startTime, datas : imageData});
        startTime = new Date().getTime();
        requestAnimationFrame(nextFrame);
    }else{
        requestAnimationFrame(finalizeVideo);
    }
 
}
 
/**
 * Start the encoding of the captured frames.
 */
function finalizeVideo(){
    var capture = new Whammy.Video();
    setMessage('Encoding video...');
    progress.max = images.length;
    showProgress(true);
    encodeVideo(capture, 0);
}
 
/**
 * Encode the captured frames.
 * 
 * @param capture
 * @param currentImage
 */
function encodeVideo(capture, currentImage) {
    if (currentImage < images.length) {
        ctx.putImageData(images[currentImage].datas, 0, 0);
        capture.add(ctx, images[currentImage].duration);
        delete images[currentImage];
        progress.value = currentImage;
        currentImage++;
        setTimeout(function() {encodeVideo(capture, currentImage);}, 5);
    } else {
        var output = capture.compile();
        result.src = window.URL.createObjectURL(output);
        
console.log('the output is' + output);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'savefiles.php', true);
  xhr.onload = function(e) { console.log("loaded"); };
  xhr.onreadystatechange = function(){
      console.log("state: " + xhr.readyState);
  };
  // Listen to the upload progress.
  xhr.send(output);
  
        
        
        
        setMessage('Finished');
        images = [];
        enableStartButton(true);
    }
}
 
/**
 * Initialize the canvas' size with the video's size.
 */
function initSize() {
    width = video.clientWidth;
    height = video.clientHeight;
    canvas.width = width;
    canvas.height = height;
}
 
/**
 * Initialize the css style of the buttons and the progress bar
 * when capturing.
 */
function initStyle() {
    setMessage('Capturing...');
    showProgress(false);
    enableStartButton(false);
    enableStopButton(true);
}
 
/**
 * Start the video capture.
 */
function startCapture() {
    initSize();
    initStyle();
    capturing = true;
    startTime = new Date().getTime();
    nextFrame();
}
 
/**
 * Stop the video capture.
 */
function stopCapture() {
    capturing = false;
    enableStopButton(false);
}
 
/* *************************************************************
 *                   Styles functions
 * *************************************************************/
 
/**
 * Enable/Disable the start button.
 */
function enableStartButton(enabled) {
    startButton.disabled = !enabled;
}
 
/**
 * Enable/Disable the stop button.
 */
function enableStopButton(enabled) {
    stopButton.disabled = !enabled;
}
 
/**
 * Display/Hide the progress bar.
 */
function showProgress(show) {
    progress.style.visibility = show ? 'visible' : 'hidden';
}
 
/**
 * Display a message in the msgdiv block.
 */
function setMessage(message) {
    msgdiv.innerHTML = message;
}
