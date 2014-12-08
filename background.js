$("abbr[title*='Primary']").each(function(obj) {
	var prof = $(this).parent();
	// get first and last name
	var origName = prof.text().substring(0, prof.text().indexOf(" ")) + prof.text().substring(prof.text().lastIndexOf("  ")+1, prof.text().lastIndexOf(" "));
	var profname = encodeURI(origName);

	var xhr = new XMLHttpRequest(); // create the request
	xhr.open('GET', "https://localhost:8081/scrape?"+"p="+profname, true );
	xhr.setRequestHeader('content-type', 'text/plain');
	xhr.onload = function() { // on response
		var json = JSON.parse(xhr.responseText);
		ratings[origName] = json;		
		prof.css("background-color", getRatingColor(json.overall));
		prof.on(
	};

	xhr.send(null);
});


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
