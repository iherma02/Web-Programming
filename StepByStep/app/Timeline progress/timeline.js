//Sample times 
//player.getCurrentTime():Number;
var times = [15, 30, 75];
var totalTime = 180;

//Main function. Draw your circles.
function timeSpan(time)  {
    var seconds = time % 60;
    var minutes = (time - seconds) / 60;
    
    var timesText = "";
  
    if (seconds < 10){
      timesText = minutes + ":0" + seconds;
    }
    else  {
      timesText = minutes + ":" + seconds;  
    }
    return timesText;
}

function makeCircles() {
    //Set first and last
    var first = 0;
    var last = totalTime;
    //Draw time circle at 0:00
  
      $("#line").append('<div class="circle" id="circle0" style="left: ' + 0 + '%;"><div class="popupSpan">' + "0:00" + '</div></div>');
      
      $("#mainCont").append('<span id="span0" class="right">' + "0:00" + '</span>');
  
  
    //Loop through times
    for (i = 0; i < times.length - 1; i++) {
      
      //Integer representation of the time
      var thisInt = times[i] / totalTime;

      //Draw the time circle
      $("#line").append('<div class="circle" id="circle' + i + '" style="left: ' + thisInt * 100 + '%;"><div class="popupSpan">' + timeSpan(times[i]) + '</div></div>');
      
      $("#mainCont").append('<span id="span' + i + '" class="right">' + timeSpan(times[i]) + '</span>');
    }

    //Draw the last date circle
    $("#line").append('<div class="circle" id="circle' + i + '" style="left: ' + 99 + '%;"><div class="popupSpan">' + timeSpan(totalTime) + '</div></div>'); 
    
    $("#mainCont").append('<span id="span' + i + '" class="right">' + timeSpan(totalTime) + '</span>');

  $(".circle:first").addClass("active");
}

makeCircles();

$(".circle").mouseenter(function() {
  $(this).addClass("hover");
});

$(".circle").mouseleave(function() {
  $(this).removeClass("hover");
});

$(".circle").click(function() {
  var spanNum = $(this).attr("id");
  selectTime(spanNum);
});

function selectTime(selector) {
  $selector = "#" + selector;
  $spanSelector = $selector.replace("circle", "span");
  var current = $selector.replace("circle", "");
  
  $(".active").removeClass("active");
  $($selector).addClass("active");
  
  if ($($spanSelector).hasClass("right")) {
    $(".center").removeClass("center").addClass("left")
    $($spanSelector).addClass("center");
    $($spanSelector).removeClass("right")
  } else if ($($spanSelector).hasClass("left")) {
    $(".center").removeClass("center").addClass("right");
    $($spanSelector).addClass("center");
    $($spanSelector).removeClass("left");
  }; 
};

console.log()