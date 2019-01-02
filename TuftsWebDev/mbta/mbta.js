trains = [
        {
                stopName: "Alewife",
                stopLat: 42.395428,
                stopLon: -71.142483,
                stopId: "place-alfcl"
        },
        {
                stopName: "Davis",
                stopLat: 42.39674,
                stopLon: -71.121815,
                stopId: "place-davis"
        },
        {
                stopName: "Porter Square",
                stopLat: 42.3884,
                stopLon: -71.11914899999999,
                stopId: "place-portr"
        },
        {
                stopName: "Harvard",
                stopLat: 42.373362,
                stopLon: -71.118956,
                stopId: "place-harsq"
        },
        {
                stopName: "Central Square",
                stopLat: 42.365486,
                stopLon: -71.103802,
                stopId: "place-cntsq"
        },
        {
                stopName: "Kendall/MIT",
                stopLat: 42.36249079,
                stopLon: -71.08617653,
                stopId: "place-knncl"
        },
        {
                stopName: "Charles/MGH",
                stopLat: 42.361166,
                stopLon: -71.070628,
                stopId: "place-chmnl"
        },
        {
                stopName: "Park Street",
                stopLat: 42.35639457,
                stopLon: -71.0624242,
                stopId: "place-pktrm"
        },
        {
                stopName: "Downtown Crossing",
                stopLat: 42.355518,
                stopLon: -71.060225,
                stopId: "place-dwnxg"
        },
        {
                stopName: "South Station",
                stopLat: 42.352271,
                stopLon: -71.05524200000001,
                stopId: "place-sstat",
        },
        {
                stopName: "Broadway",
                stopLat: 42.342622,
                stopLon: -71.056967,
                stopId: "place-brdwy"
        },
        {
                stopName: "Andrew",
                stopLat: 42.330154,
                stopLon: -71.057655,
                stopId: "place-andrw"
        },
        {
                stopName: "JFK/UMass",
                stopLat: 42.320685,
                stopLon: -71.052391,
                stopId: "place-jfk"
        },
        {
                stopName: "North Quincy",
                stopLat: 42.275275,
                stopLon: -71.029583,
                stopId: "place-nqncy"
        },
        {
                stopName: "Wollaston",
                stopLat: 42.2665139,
                stopLon: -71.0203369,
                stopId: "place-wlsta"
        },
        {
                stopName: "Quincy Center",
                stopLat: 42.251809,
                stopLon: -71.005409,
                stopId: "place-qnctr"
        },
        {
                stopName: "Quincy Adams",
                stopLat: 42.233391,
                stopLon: -71.007153,
                stopId: "place-qamnl"
        },
        {
                stopName: "Braintree",
                stopLat: 42.2078543,
                stopLon: -71.0011385,
                stopId: "place-brntn"
        },
        {
                stopName: "Savin Hill",
                stopLat: 42.31129,
                stopLon: -71.053331,
                stopId: "place-shmnl"
        },
        {
                stopName: "Fields Corner",
                stopLat: 42.300093,
                stopLon: -71.061667,
                stopId: "place-fldcr"
        },
        {
                stopName: "Shawmut",
                stopLat: 42.29312583,
                stopLon: -71.06573796000001,
                stopId: "place-smmnl"
        },
        {
                stopName: "Ashmont",
                stopLat: 42.284652,
                stopLon: -71.06448899999999,
                stopId: "place-asmnl"
        },
]

function initMap(){
        south = new google.maps.LatLng(trains[0].stopLat, trains[0].stopLon);
        map = new google.maps.Map(document.getElementById("map"), {
                center: south,
                zoom: 11
        });

        getMyLocation();
}

function getMyLocation(){
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                        myLat = position.coords.latitude;
                        myLng = position.coords.longitude;

                        //QUESTION: does renderMap have access to the local variables of these functions?
                        renderMap();
                });
        }
}

function renderMap() {
        setSelf();
        setOthers();
        drawLine();
}

function setSelf() {
        self = new google.maps.LatLng(myLat, myLng);
        infowindow = new google.maps.InfoWindow();
        map.panTo(self);

        selfMarker = new google.maps.Marker({
                position: self,
                title: "Your Location",
                icon: "houseFlat.png"
        });

        selfMarker.setMap(map);
        closestIndex = closestStation()[0];
        closestDistance = closestStation()[1];
        contentString = "The closest station is " + trains[closestIndex].stopName + ": " + parseFloat(closestDistance).toFixed(2) + " miles away";
        selfMarker.content = contentString;



        google.maps.event.addListener(selfMarker, 'click', function(){
                infowindow.setContent(selfMarker.content);
                infowindow.open(map, selfMarker);
                connectClosest();
        });
}

function connectClosest() {
        coords = new Array();
        myCoord = {lat: myLat, lng: myLng}
        coords.push(myCoord);
        closestCoord = {lat: trains[closestIndex].stopLat, lng: trains[closestIndex].stopLon};
        coords.push(closestCoord);

        path = new google.maps.Polyline({
                path: coords,
                geodesic: true,
                strokeColor: '#22A7F0',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        path.setMap(map);
}

function closestStation() {
        closestDistance = Number.MAX_SAFE_INTEGER;
        closestIndex = 0;
        currentDistance = 0;

        for (var i = 0; i < trains.length; i++) {
                lat2 = trains[i].stopLat;
                lng2 = trains[i].stopLon;
                currentDistance = getDistance(myLat, myLng, lat2, lng2);
                if (currentDistance < closestDistance) {
                        closestDistance = currentDistance;
                        closestIndex = i;
                }
        }
        info = [closestIndex, closestDistance]
        return info;
}

function getDistance(myLat, myLng, lat2, lng2) {
        R = 6371;

        dLat = toRad(lat2 - myLat);
        dLon = toRad(lng2 - myLng);
        a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(myLat)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);

        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        d = R * c;
        return d * 0.621371;

}

function toRad(deg) {
        return (deg) * (Math.PI/180);
}



function setOthers(){
        for (var i = 0; i < trains.length; i++) {
                newLocation = new google.maps.LatLng(trains[i].stopLat, trains[i].stopLon);
                //timeInfo = getData(trains[i].stopId);
                newInfowindow = new google.maps.InfoWindow();
                newMarker = new google.maps.Marker({
                        position: newLocation,
                        title: trains[i].stopName + "--",
                        icon: "trainFlat.png",
                        stopId: trains[i].stopId
                });
                newMarker.setMap(map);
                google.maps.event.addListener(newMarker, 'click', function() {
                        timeInfo = getData(this.stopId);
                        newMarker.content = this.title + "\n" + timeInfo + "\n";
                        newInfowindow.setContent(this.title);
                        newInfowindow.setContent(newMarker.content);
                        newInfowindow.open(map, this);
                });
        }
}

// QUESTION: why do I need to declare/initialize timeInfo outside scope of getData() function to access it later????
timeInfo = " ";
function getData(stopId) {
        request = new XMLHttpRequest();
        request.open("GET", "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" +
        stopId, true);

        request.onreadystatechange = function(){
                if (request.readyState == 4 && request.status == 200) {
                        theData = request.responseText;
                        timeObj = JSON.parse(theData);
                        timeInfo = generateInfoString(timeObj);
                }
        }

        request.send();
        return timeInfo;
}

function generateInfoString(timeObj) {
        infoString = "";
        for (var i = 0; i < timeObj.data.length; i++) {
                if (timeObj.data[i].attributes.direction_id == 1) {
                        infoString += "Northbound: ";
                }
                else {
                        infoString += "Southbound: ";
                }
                timing = timeObj.data[i].attributes.arrival_time;
                if (timing != null) {
                        infoString += timing.substring(
                                timing.lastIndexOf("T") + 1,
                                timing.lastIndexOf("-")
                        );
                }
                else {
                        infoString += "Null, sorry";
                }
                infoString += ",\n";
        }

        return infoString;
}

function drawLine() {
        drawHandle();
        drawLeft();
        drawRight();
}

function drawHandle() {
        handleCoords = new Array();
        for (var i = 0; i < 13; i++) {
                singleCoord = {lat: trains[i].stopLat, lng: trains[i].stopLon};
                handleCoords.push(singleCoord);
        }
        handlePath = new google.maps.Polyline({
                path: handleCoords,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        handlePath.setMap(map);
}

function drawLeft() {
        leftCoords = new Array();
        leftCoords.push({lat: trains[12].stopLat, lng: trains[12].stopLon});
        for (var i = 18; i < trains.length; i++) {
                singleCoord = {lat: trains[i].stopLat, lng: trains[i].stopLon};
                leftCoords.push(singleCoord);
        }
        leftPath = new google.maps.Polyline({
                path: leftCoords,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        leftPath.setMap(map);
}

function drawRight() {
        rightCoords = new Array();
        for (var i = 12; i < 18; i++) {
                singleCoord = {lat: trains[i].stopLat, lng: trains[i].stopLon};
                rightCoords.push(singleCoord);
        }
        rightPath = new google.maps.Polyline({
                path: rightCoords,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
        });
        rightPath.setMap(map);
}
