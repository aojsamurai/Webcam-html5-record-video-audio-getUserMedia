Webcam-html5-record-video-audio-getUserMedia
============================================

Webcam capture using Html5 getUserMedia, the stream is recorded via js and saved using php in two files inside the folder /video, one file for video as .webm and one file for audio as .wav

** CREATE IN THE SAME PROJECT FOLDER ONE NEW FOLDER NAMED "video" WHERE THE FILES ARE GOING TO BE STORAGE. 

Using getUserMedia start the streaming of the webcam, the stream is recorded using javascript the send it as blob to a php file
where gets the file format.

The file video.js contains the commands of strat stream, stop, encode and save.
For the audio, his controls are inside the file index.php as js script at the bottom.


The project contains Javascript libraries and php files.

**Note: For security the webcam only its allowed if the prooject is running on a server and its necessary to allow
the use when the pop up appears.

This version is probed in Chrome.
