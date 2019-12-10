document.getElementById("id_ReviewDetail").onkeyup = function() {charCount()};

function charCount() {
	var x = document.getElementById("id_ReviewDetail").value;
	document.getElementById("charcount").innerHTML = x.length + "/250";
}