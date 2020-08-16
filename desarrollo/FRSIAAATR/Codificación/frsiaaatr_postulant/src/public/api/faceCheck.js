function loadModels() {
    llamarPromise2();
}

function llamarPromise2() {
    console.log("entro");
    Promise.all([
        faceapi.loadTinyFaceDetectorModel('/models'),
        faceapi.loadFaceLandmarkTinyModel('/models'),
        faceapi.loadFaceRecognitionModel('/models'),
        faceapi.loadSsdMobilenetv1Model('/models'),
        faceapi.loadFaceLandmarkModel('/models')
    ])
}

async function verifyImages() {
    const img = await faceapi.fetchImage(`/moment/test.jpg`);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    return detections;
}
