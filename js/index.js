// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video;
var canvas;
var photo;

var takenPicture = false;

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = '#AAA';
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takepicture() {
  var context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    takenPicture = true; // first time we take the picture set this to true
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  } else {
    clearphoto();
  }
}

function getTextToSpeechUrl(text) {
  var voice = 'usenglishmale2',
     speed = 0,
     pitch = 0;

  var apiKey = '34b06ef0ba220c09a817fe7924575123';

  var url = 'https://api.ispeech.org/api/rest.mp3' +
           '?apikey=' + apiKey +
           '&action=convert' +
           '&voice=' + voice +
           '&speed=' + speed +
           '&pitch=' + pitch +
           '&text=' + text;

   return url;
}

function startup() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');
  var startButtonEl = document.querySelector('.start-button');


  var splashEl = document.querySelector('.splash');

  var outputColor = document.querySelector('.outputColor');

  var splashAudio = document.querySelector('#splashAudio');
  var startOutput = document.querySelector('#startAudio');
  var audioOutput = document.querySelector('#outputAudio');

  startButtonEl.addEventListener('click', function(event) {
    splashAudio.play();
    damnnn();

    splashEl.classList.add('splash--hidden');
    setTimeout(function() {
      splashEl.style.display = 'none';
    }, 1000);
  });

  startOutput.volume = 1;
  audioOutput.volume = .5;

  startOutput.addEventListener('ended', function(){
    audioOutput.play();
  });

  photo.addEventListener('load', function() {
    // only process image if we've taken a picture
    if (takenPicture) {
      var colorThief = new ColorThief();
      var rgbColor = colorThief.getColor(photo);
      var hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);

      var colorInfo = ntc.name(hexColor);
      var colorOut = colorInfo[0];
      var colorName = colorInfo[1];

      outputColor.style.background = colorOut;
      outputColor.innerHTML = colorName;
      audioOutput.src = getTextToSpeechUrl(colorName + ' coloured clothing item.');

      startOutput.play();
    }
  });
}

function damnnn() {
  var outputColor = document.querySelector('.outputColor');

  
  navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
    .then(function(stream) {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);

      video.play();
    })
    .catch(function(error) {
      outputColor.style.background = 'red';
      outputColor.style.color = 'white';
      outputColor.innerHTML = 'Can\'t get the camera :¬( ahhhh';
      console.log('An error occurred! ', error);
    });

  video.addEventListener('canplay', function(event){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

  video.addEventListener('click', function(event){
    event.preventDefault();
    takepicture();
  }, false);

  clearphoto();
}

document.addEventListener('DOMContentLoaded', startup, false);
