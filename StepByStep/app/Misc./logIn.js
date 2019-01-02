function isValid(){
	var inputName = document.getElementById("Username").value;
	var pw = document.getElementById("Password").value;
	var pw2 = document.getElementById("pswRep").value;
	

	//asci code vulnerability?
	if(pw === pw2){
		var url = "https://morning-thicket-88985.herokuapp.com/scores.json?username=";
		var SENDIT = url.concat(inputName);
		//alert(SENDIT);
		window.location.href = SENDIT;
		//$.get(SENDIT);



	}
	else{
		alert("Passwords do not match!")
	}

};

/*

	get name from user (check)
	if name exists pull all data from db with this name
	if name doesn't exist set name to a global type var?



	if (ser) {
    
      var gridHold =JSON.stringify(this.grid);

      //jquery post to location
      $.post( "https://morning-thicket-88985.herokuapp.com/submit", { username: placeHold, score: this.score, grid:gridHold },function(data){
          var results = data;
}
*/