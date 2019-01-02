function keyWordsearch(){
        gapi.client.setApiKey('AIzaSyCJDa3JqstkZFFyIkSyeUfDQzQov1_D3Ek');
        gapi.client.load('youtube', 'v3', function(){
                makeRequest();
        });
}

currentId = " ";
function makeRequest(){
        var q = $('#query').val();
        var request = gapi.client.youtube.search.list({
                q: q,
                part: 'snippet',
                maxResults: 10
        });
        request.execute(function(response)  {
                $('#results').empty()
                var srchItems = response.result.items;
                $.each(srchItems, function(index, item){
                        vidTitle = item.snippet.title;
                        link = "https://www.youtube.com/embed/" + item.id.videoId;
                        button = '<button class="w3-button w3-black" onclick=setLab("'+/*link*/ item.id.videoId+'")>Learn</button>';
                        //button = '<button class="w3-button w3-black" id="newVid" videoid=" '+item.id.videoId+' ">Learn</button>';
                        vidThumburl =  item.snippet.thumbnails.default.url;
                        vidThumbimg = '<pre><img id="thumb" src="'+vidThumburl+'" alt="No  Image  Available." style="width:204px;height:128px"></pre>';
                        $('#results').append('<p>' + vidTitle + vidThumbimg + button + '</p>');
                })
        })
}

var player, time_update_interval = 0;

function onYouTubeIframeAPIReady() {
        player = new YT.Player('video-placeholder', {
                width: 600,
                height: 400,
                videoId: 'Xa0Q0J5tOP0',
                playerVars: {
                        color: 'white',
                        playlist: 'taJ60kskkns,FG0fTKAqZ5g'
                },
                events: {
                        onReady: initialize
                }
        });

        button = '<button class="w3-button w3-black" id="bookmark">Save Time</button>';
        save = '<button class="w3-button w3-black" id="save">Done!</button>';
        $('#bookmarkButton').append(button);
        $('#bookmarkButton').append(save);
        $('#bookmark').click(function() {
                time = player.getCurrentTime().toFixed(2);
                link = '<a timestamp="'+time+'"  id = "goTo" onclick=seekVid("'+time+'")> '+time+' seconds</a><br>';
                $('#times').append(link);
        });

        $('#save').click(function() {
                list = $('#times').children().toArray();
                //console.log(list);


                arr = [];
                for (var i = 0; i < list.length; i++) {
                        time = list[i].getAttribute("timestamp");
                        if (time) {
                                arr.push(time);
                        }
                }
                //console.log(arr);
                sendToWeb(arr);
        });

}

function sendToWeb(times, vid) {
        username = prompt("Enter your name");
        request = new XMLHttpRequest();

        request.open("POST", "https://dance-step-by-step.herokuapp.com/submit", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        console.log(currentId);
        console.log(times);
        request.send("username=" + username + "&id=" + currentId + "&list=" + times);
}

function seekVid(timeStamp) {
        player.seekTo(timeStamp);
}

function initialize(){

        // Update the controls on load
        updateTimerDisplay();

        // Clear any old interval.
        clearInterval(time_update_interval);

        // Start interval to update elapsed time display and
        // the elapsed part of the progress bar every second.
        time_update_interval = setInterval(function () {
                updateTimerDisplay();
        }, 1000);
}


// This function is called by initialize()
function updateTimerDisplay(){
        // Update current time text display.
        $('#current-time').text(formatTime( player.getCurrentTime() ));
        $('#duration').text(formatTime( player.getDuration() ));
}

// Helper Functions

function formatTime(time){
        time = Math.round(time);

        var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

        seconds = seconds < 10 ? '0' + seconds : seconds;

        return minutes + ":" + seconds;
}

function setLab(id) {
        currentId = id;
        $('#times').empty();
        player.loadVideoById(id);
}
