// function onload() {
// 	var xhr = new XMLHttpRequest();

// 	xhr.open("GET", "./Desert.jpeg");
// 	xhr.responseType = "arraybuffer";

// 	xhr.onload = function (e) {
// 		var blob = new Blob([xhr.response], {type: "image/jpeg"});
// 		var url = URL.createObjectURL(blob);

// 		console.log(url);

// 		var img = document.getElementById("image");
// 		img.src = url;
// 	}

// 	xhr.send();
// }

// onload();