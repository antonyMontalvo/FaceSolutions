// The stream & capture
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");

function startStreamingRegister() {

	var mediaSupport = 'mediaDevices' in navigator;
	console.log("1");

	if (mediaSupport) {
		console.log("2");
		navigator.getUserMedia= (navigator.getUserMedia || 
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia);

		navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (mediaStream) {

			cameraStream = mediaStream;

			stream.srcObject = mediaStream;

			stream.play();

		})
		.catch(function (err) {

			console.log("No se puede acceder a la cámara: " + err);
		});
	}
	else {

		alert('Su navegador no es compatible con dispositivos multimedia.');

		return;
	}
}
// ************
 function captureSnapshotsRegister2() {
 	captureSnapshotsRegister()
 }

 function captureSnapshotsRegister() {

		
		var data = new FormData();
		const label = document.getElementById("name").value.trim()
		// if (label.length === 0) {
		// 	stopStreaming();
		// 	return alert("Por favor ingrese el nombre");
		// }
		data.append("label", label);

			var ctx = capture.getContext('2d');
			var img = new Image();

			ctx.drawImage(stream, 0, 0, capture.width, capture.height);

			img.src = capture.toDataURL("image/jpeg");
			img.width = 240;

			const blob =  fetch(img.src).
				then(res=>res.blob());
		

			const file = new File([blob], `${i + 1}.jpg`, blob)

			data.append("image", file);
		
		console.log(dat);

        // var xhr = new XMLHttpRequest();
        // promisify(xhr);

        // xhr.open("POST", "http://localhost:5000/register");
        // xhr.send(data).then(res => {
        //     stopStreaming();
        //     document.getElementById("name").value = '';
        // });

        fetch('http://127.0.0.1:3000/registro', {
              method: 'POST', // or 'PUT'
              body:data
          }).then(function(response) {
          	console.log('Realizando Registro');
            document.getElementById("name").value = '';
              // window.location.assign("http://127.0.0.1:3000/home")

          })
          .catch(function(error) {
          	console.log('Registro=> Hubo un problema con la petición Fetch:' + error.message);
          });

      }
  