// faceapi.loadTinyFaceDetectorModel('/models'),
//   faceapi.loadFaceLandmarkTinyModel('/models'),   
//   faceapi.loadFaceRecognitionModel('/models'),
//   faceapi.loadSsdMobilenetv1Model('/models'),
//   faceapi.loadFaceLandmarkModel('/models'),
//   faceapi.loadFaceRecognitionModel('/models')


var dato = null;
var ayuda = [];
console.log(typeof (cantidad));
const formularioPostulante = document.getElementById('formularioPostulante');
const loading = document.getElementById('loading');
const videoWC = document.getElementById('video');
const botonR = document.getElementById('redir');

function CodigoValidacion(codigo) {
    // if(codigo!=null && codigo.length !=0){
    formularioPostulante.classList.add('d-none');
    formularioPostulante.classList.remove('wrapper');

    loading.classList.remove('d-none');
    // video.classList.remove('d-none');
    dato = codigo;
    // }
    llamarPromise();
}

function llamarPromise() {
    console.log("entro");
    Promise.all([
        faceapi.loadTinyFaceDetectorModel('/models'),
        faceapi.loadFaceLandmarkTinyModel('/models'),
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadSsdMobilenetv1Model('/models'),
        faceapi.loadFaceLandmarkModel('/models')
    ]).then(startVideo)
}

function startVideo() {
    console.log("star video");
    // est es diferente para cada navegador asi que ponemos para todos los navegadores
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


    // Recuperar informacion de la cámara web
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.log(err)
    )

    console.log('entro video');
    loading.classList.add('d-none');
    videoWC.classList.remove('d-none');
    botonR.classList.remove('d-none');
}

// navigator.getUserMedia( ,nos devuelve el stream de video que vamos a capturar y se lo enviamos a src de video, aca vemos los errore)

// startVideo();
console.log('prueba 1');

// Abrir la webCam cuando se reconoce a todos los modelos

// faceapi.nets.tinyFaceDetector.loadFromUri('/models') =>Detectar las caras
// faceLandmark68Net => PAra reconocimiento de las caras

console.log('prueba 2');

video.addEventListener('play', async () => {
    let cantidad = 0;


    console.log('prueba 3');
    // ******************************
    //AQUI SE ALMACENA LOS DATOS DE LA IMG 
    const labeledFaceDescriptors = await loadLabeledImages(dato);
    //DEFINIMOS LA CANTIDAD DE PARTICIONES DEL ROSTRO
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    alert('Análisis Realizado,iniciando escaneo');
    // *****************************

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    // dibujamos el objeto
    const displaySize = {width: video.width, height: video.height};
    // El video tendria el canvas poe encima con el mismo tamaño
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        ;
        // console.log(detections);

        // ahora redireccionamos el tamaño del Canvas
        const resizedDetections = await faceapi.resizeResults(detections, displaySize);


        // -----------------------------------------------------
        // limpiar
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        // Pintamos
        faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
        // -----------------------------------------------------

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()});
            drawBox.draw(canvas);
            console.log(drawBox.options.label);
            console.log(typeof (drawBox.options.label));


            ayuda = drawBox.options.label.split(' (');
            console.log(ayuda);
            if (dato == ayuda[0]) {
                cantidad++;
                console.log('comparo');
            }


            if (cantidad > 5) {
                // FETCG

                // fetch('http://127.0.0.1:3000/api', {
                //     method: 'POST', // or 'PUT'
                // }).then(function (response) {
                //     console.log('entro a API');
                // })
                //     .catch(function (error) {
                //         console.log('Hubo un problema con la petición Fetch:' + error.message);
                //     });
                // FIN FETCH
            }
        })
        // console.log(ayuda);


    }, 100)

});


// ***************************
function loadLabeledImages(dato) {
    console.log(dato)
    // const labels = ['Roberto Carlos','Luis Fernando','Elvis Pernia']
    const labels = [dato]
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 4; i++) {
                const img = await faceapi.fetchImage(`/perfiles/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    )
}

async function verifyImages(imgE) {
    const img = await faceapi.fetchImage(imgE);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    return detections;

}
