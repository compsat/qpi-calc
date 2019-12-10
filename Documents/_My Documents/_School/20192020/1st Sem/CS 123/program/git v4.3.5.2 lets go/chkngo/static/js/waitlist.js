function putNum() {
	// Get the waitlistNum element and convert into an array
	var num = document.getElementsByClassName("waitlistNum");
	var arr = Array.from(num);

	// Output the numbers depending on the length
	for (var i = 0; i < num.length; i++) {
		arr[i].innerHTML = i + 1;
	}
}

function numInId() {
	// Get the waitlistNum element and convert into an array
	var num = document.getElementsByClassName("wait-row");
	var arr = Array.from(num);

	var j = 1;

	// Output the numbers depending on the length
	for (var i = 0; i < num.length; i++) {
		arr[i].id = "row" + j;
		j++;
	}
}

function showList(id) {
	var elem = document.getElementById(id);
	elem.style.display = (elem.style.display == 'block') ? 'none' : 'block';
}

function fade(element) {

	console.log(element.parentNode.parentNode.id);
	
	var elem = element.parentNode.parentNode.id;
	console.log(elem);

	// animation logic

	// var i = 1;

	// var id = setInterval(frame, 5);
	// function frame() {
	// 	if (i == 0) {
	// 		clearInterval(id);
	// 	}
	// 	else {
	//     	i -= 0.05;
	//     	elem.style.opacity = i;
	//   	}
	// }
}

// Run functions here
putNum();
numInId();