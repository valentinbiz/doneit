var script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(script);

var player;
var isPlaying = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("YouTube", {
    height: "390",
    width: "640",
    videoId: "8nXqcugV2Y4",
    events: {
      onReady: current_duration,
    },
  });
}

function start_player() {
  player.playVideo();
}
function current_duration(stop) {
  if (stop == true) {
    var time = player.getCurrentTime();
  } else {
    var time = player.getCurrentTime();
  }
  var seconds = Math.floor(time);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  if (seconds >= 60) {
    seconds = seconds - minutes * 60;
  }
  if (minutes >= 60) {
    minutes = minutes - hours * 60;
  }
  minutes = minutes.toString();
  minutes = minutes.padStart(2, "0");

  seconds = seconds.toString();
  seconds = seconds.padStart(2, "0");

  hours = hours.toString();
  hours = hours.padStart(2, "0");

  var songDuration = player.getDuration();
  var hoursDur = Math.floor(songDuration / 3600);
  var minutesDur = Math.floor((songDuration - 3600) / 60);
  var secondsDur = Math.floor(songDuration - hoursDur * 3600 - minutesDur * 60);

  minutesDur = minutesDur.toString();
  minutesDur = minutesDur.padStart(2, "0");

  secondsDur = secondsDur.toString();
  secondsDur = secondsDur.padStart(2, "0");

  hoursDur = hoursDur.toString();
  hoursDur = hoursDur.padStart(2, "0");

  document.querySelector(".full-duration").innerHTML =
    hoursDur + ":" + minutesDur + ":" + secondsDur;
  document.querySelector(".duration").innerHTML =
    hours + ":" + minutes + ":" + seconds;
}

function toggle_player() {
  if (isPlaying) {
    isPlaying = false;
    player.stopVideo();
    document.querySelector(".player-button").classList.remove("playing");
    current_duration(true);
    clearInterval(intervalID);
  } else {
    isPlaying = true;
    player.playVideo();
    document.querySelector(".player-button").classList.add("playing");
    intervalID = setInterval(current_duration, 1000);
  }
}
