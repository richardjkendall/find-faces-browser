import * as faceapi from 'face-api.js';
import uuidv4 from 'uuid/v4';

// Load models and weights
export async function loadModels() {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
}

export async function getFullFaceDescription(blob, displaySize, inputSize = 512) {
    // tiny_face_detector options
    let scoreThreshold = 0.5;
    const OPTION = new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold
    });

    // detect all faces and generate full description from image
    // including landmark and expression of each face
    let fullDesc = await faceapi
        .detectAllFaces(blob, OPTION)
        //.withFaceLandmarks()
        //.withFaceDescriptors()
        .withFaceExpressions();
    
    // need to resize them
    fullDesc = faceapi.resizeResults(fullDesc, displaySize);
    return fullDesc;
}

export async function findMatchingFaces(fullDesc, labels, descriptors, faceGraph, maxDistance = 0.6) {
    // exit if the fullDesc array is empty
    if (fullDesc.length === 0) {
        return 0;
    }

    // special case for first time function is called with empty face set
    if (labels.length == 0) {
        //console.log("zero length labels");
        //console.log("fulldesc", fullDesc);
        var newLabels = fullDesc.map((fd, i) => {return "person " + i});
        var newDescriptors = fullDesc.map(fd => {
            return fd.descriptor
        });
        //console.log("descriptors", newDescriptors);
        // update lists for next time
        labels = newLabels.reduce(function(coll, item) {
            coll.push(item);
            return coll;
        }, labels);
        descriptors = newDescriptors.reduce(function(coll, item) {
            coll.push(item);
            return coll;
        }, descriptors);
        //console.log("output", labels, descriptors);
        return 0;
    }
    
    // create labeled dataset and facematcher
    //var labeledDescriptors = faceapi.LabeledFaceDescriptors(labels, descriptors);
    var labeledDescriptors = labels.map((label, i) => {
        //console.log("working on face ", label, i);
        return faceapi.LabeledFaceDescriptors(label, [descriptors[i]])
    });

    //const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, maxDistance);
    const faceMatcher = new faceapi.FaceMatcher(descriptors, maxDistance);
    
    // match new faces with existing faces
    const results = fullDesc.map(fd => faceMatcher.findBestMatch(fd.descriptor));
    
    // generate data to add to existing label and descriptor set
    var newLabels = fullDesc.map((fd, i) => {
        return "person " + (labels.length + i)
    });
    var newDescriptors = fullDesc.map(fd => {
        return fd.descriptor
    });

    // update graph
    results.forEach((bestMatch, i) => {
        faceGraph.setNode(newLabels[i], fullDesc[i]);
        if(bestMatch) {
            var targetFace = bestMatch.toString(false);
            //console.log("best match", targetFace);
            faceGraph.setEdge(newLabels[i], targetFace);
        }
    });

    // update lists for next time
    labels = newLabels.reduce(function(coll, item) {
        coll.push(item);
        return coll;
    }, labels);
    descriptors = newDescriptors.reduce(function(coll, item) {
        coll.push(item);
        return coll;
    }, descriptors);
}