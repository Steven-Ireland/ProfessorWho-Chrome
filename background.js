$("abbr[title='Primary']").each(function(obj) {
	var prof = $(this).parent();
	// get first and last name
	var profname = prof.text().substring(0, prof.text().indexOf(" ")) + prof.text().substring(prof.text().lastIndexOf("  ")+1, prof.text().lastIndexOf(" "));
	
	var comProfname = prof.find("a");
	if (comProfname.size() < 1) {
		comProfname =prof.text().substring(0, prof.text().indexOf("(")-1).replace(/  /g, " ");
	}
	else {
		comProfname = comProfname.attr("target");
	}
	
	var encodedprofname = profname+" worcester polytechnic institute";
	encodedprofname = encodeURI(profname);
	var firstDone = false;
	
	var xhr1 = new XMLHttpRequest();
	xhr1.open('GET', "https://commote.net:8081/scrape?"+"p="+encodedprofname, true );
	xhr1.setRequestHeader('content-type', 'text/plain');
	xhr1.onload = function() { // on response
		var json = JSON.parse(xhr1.responseText);	
		if (firstDone != false)
			createTooltip(prof, profname, json, firstDone);
		else
			firstDone = json;
	};
	
	var xhr2 = new XMLHttpRequest();
	xhr2.open('GET', "https://commote.net/api/crx.php?"+"prof="+encodeURI(comProfname).replace(/%20/g, "+"), true );
	xhr2.setRequestHeader('content-type', 'text/plain');
	xhr2.onload = function() { // on response
		var json = JSON.parse(xhr2.responseText);	
		if (firstDone != false)
			createTooltip(prof, profname, firstDone, json);
		else
			firstDone = json;
	};

	xhr1.send(null);
	xhr2.send(null);
});

var uniqueID = (function() {
   var id = 0; // This is the private persistent value
   // The outer function returns a nested function that has access
   // to the persistent value.  It is this nested function we're storing
   // in the variable uniqueID above.
   return function() { return id++; };  // Return and increment
})();

function getTip() {
	getTip.counter = getTip.counter+1;
	return getTip.counter;
}

function createTooltip(prof, profname, rmpJson, comJson) {
	if (typeof getTip.counter == 'undefined') getTip.counter = 0;

	thisTip = getTip();
	prof.css("box-shadow", "0px 4px 15px 0px #"+getRatingColor(comJson.dist["avg"]) );

	prof_avg = 4.098259333839552;
	prof_std = 0.657811782269865;
	
	prof_zscore = (comJson.dist["avg"] - prof_avg) / prof_std;
	prof_score  = (Math.round(comJson.dist["avg"] * 1000) / 1000);
	prof_rzscore = (Math.round(prof_zscore * 1000) / 1000);


	prof.tooltip(
		{
			'title' : 
					'<h4>'+profname+'</h4>'+
					'<h5>WPI Rating: <span class=\"rating\">' + prof_score +'; Z='+prof_rzscore+'</span><h5>'+
					'<canvas id=\"container'+thisTip+'\" style=\"width: 250px; height: 150px;\"></canvas><br><br>'+
					((rmpJson.overall!=0 && rmpJson!="") ? 
						'Overall Rating: '+rmpJson.overall+'<br>'+
						'Helpfulness: '+rmpJson.helpfulness+'<br>'+
						'Clarity: '+rmpJson.clarity+'<br>'+
						'Easiness: '+rmpJson.easiness+'<br>'
					   :'<span class=\"err\">No RateMyProfessor Data found</span><br>'),
						
			'placement': 'right',
			'html' : true,
			'container' : prof
		}
	);
	
	prof.on('shown.bs.tooltip', function() {
		var myNum = thisTip;
		var data = {
			labels: ["1", "2", "3", "4", "5"],
			datasets: [{
				label: "Dataset",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: [comJson.dist["one"], comJson.dist["two"], comJson.dist["three"], comJson.dist["four"], comJson.dist["five"]]
			}]
		}
		var ctx = prof.find("canvas")[0].getContext("2d");
		var chart = new Chart(ctx).Line(data);
	});

}

function getRatingColor(num) {
	if (num == 0 || num == "")
		return "#DDDDDD";	
	else if (num<2)
		return "#FF0000";
	else if (num<3)
		return "#FF7F00";
	else if (num<3.5)
		return "#FFFF00";
	else if (num<4)
		return "7FFF00";
	else
		return "00FF00";
}


