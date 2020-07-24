console.log("dssd");
console.log(faceapi);


const video= document.getElementById('video');

function startVideo() {

  navigator.getUserMedia= (navigator.getUserMedia || 
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  navigator.getUserMedia(
    { video : {} },
    stream => video.srcObject = stream,
    err => console.log(err)
    )

}



Promise.all([

  faceapi.loadTinyFaceDetectorModel('/models'),
  faceapi.loadFaceLandmarkTinyModel('/models'),   
  faceapi.loadFaceRecognitionModel('/models'),
  faceapi.loadSsdMobilenetv1Model('/models'),
  faceapi.loadFaceLandmarkModel('/models'),
  faceapi.loadFaceRecognitionModel('/models')


  ]).then(startVideo)

video.addEventListener('play',async () =>{

  console.log("Empezamos");
  const labeledFaceDescriptors = await loadLabeledImages();
   //DEFINIMOS LA CANTIDAD DE PARTICIONES DEL ROSTRO
   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 1);
   console.log("escaneando");
    // *****************************

    const canvas=faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width:video.width, height:video.height};
    faceapi.matchDimensions(canvas,displaySize);


    setInterval( async()=>{
      const detections = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();;

      const resizedDetections=await faceapi.resizeResults(detections,displaySize);

      canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);

      faceapi.draw.drawDetections(canvas,resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
        // -----------------------------------------------------

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
          drawBox.draw(canvas);
          console.log(drawBox.options.label);
          console.log(typeof(drawBox.options.label));

          fetch('http://127.0.0.1:3000/api',{
            method: 'POST'
          }).then(function(response) {
            console.log("Entro POST");
          })
          .catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
          });


        })

      },1000)

  });


function loadLabeledImages() {
  const labels = ['Luis Fernando,Roberto Carlos'];
  console.log("14");
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`https://robertounocc.github.io/Api-face-WebCam/perfiles/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
    )
}
