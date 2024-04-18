// This Code based on this Tutorial: https://www.youtube.com/watch?v=OIo-DIOkNVg
// PoseNet: https://ml5js.org/reference/api-PoseNet/

// List of Keypoints:
// leftEye, rightEye, leftEye, leftEar, rightEar, 
// leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, 
// leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle

let video;
let poseNet;
let pose;
let skeleton;
let maskPos;

function setup() {
  createCanvas(640, 480);
  
  //   connect to webcam
  video = createCapture(VIDEO);
  video.hide();
  
  // Init PoseNet
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  
}

// Comfirm that the model has been loaded
function modelLoaded() {
  console.log('PoseNet Model Loaded');
}

// Get the poses estimation data in each frame
function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    // console.log(pose);
  }
}

// The main draw loop
function draw() {

  // Draw the video feed
  image(video, 0,0);
  fill(255, 0 , 0);
  noStroke();

  // Use the pose object 
  if (pose) {
    
    // Estimate the face Size
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    // Draw Glasses
    textSize(d * 2);
    text("🕶",eyeL.x - d, eyeL.y + d / 1.5);
    
    // Draw Mask
    textSize(d * 2);
    maskPos = createVector((eyeL.x + eyeR.x) / 2, (eyeL.y + eyeR.y) / 2);
    text("👓",maskPos.x - d, maskPos.y + d / 1.5);
    ellipse(pose.nose.x, pose.nose.y, d);

    drawKeypoints();
    drawSkeleton();
  }
  
}

// Draw all keypoints - only if score is higher than 0.2
function drawKeypoints() {
  for (let i = 0; i < pose.keypoints.length; i++) {
    if (pose.keypoints[i].score > 0.2) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 10, 10);
    }
  }
}

// Draw the Skeleton
function drawSkeleton() {      
  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];
    strokeWeight(2);
    stroke(255);
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }
}

