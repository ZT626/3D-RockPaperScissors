/*
 * Importing and naming libraries for reference
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import GSAP from "gsap";
import { Pane } from "tweakpane";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

// important variables in global scope

let handObjectsOne = [];
let fingerBonesOne = [];
let handMeshesOne = [];

let handObjectsTwo = [];
let fingerBonesTwo = [];
let handMeshesTwo = [];

const bonesOne = {
  wrist: null,
  wrist1: null,
  wrist2: null,
  wrist3: null,
  wrist4: null,
  wrist5: null,
  wrist6: null,

  thumb1: null,
  thumb2: null,
  thumb3: null,

  index1: null,
  index2: null,
  index3: null,

  middle1: null,
  middle2: null,
  middle3: null,

  ring1: null,
  ring2: null,
  ring3: null,

  pinky1: null,
  pinky2: null,
  pinky3: null,
};

const bonesTwo = {
  wrist: null,
  wrist1: null,
  wrist2: null,
  wrist3: null,
  wrist4: null,
  wrist5: null,
  wrist6: null,

  thumb1: null,
  thumb2: null,
  thumb3: null,

  index1: null,
  index2: null,
  index3: null,

  middle1: null,
  middle2: null,
  middle3: null,

  ring1: null,
  ring2: null,
  ring3: null,

  pinky1: null,
  pinky2: null,
  pinky3: null,
};

const PARAMETERS = {
  bg: 0xffffff,
  hand: 0xf8db27,
  shirt: 0xffffff,
  coat: [0x0000ff, 0xff0000],
  // values of the following things have been copied! change for later use!
  paramBonesOne: {
    wrist: 0.0,
    thumb: 0.9,
    index: 1.1,
    middle: 1.25,
    ring: 1.25,
    pinky: 1.15,
    thumbz: -0.1,
    indexz: -0.08,
    middlez: 0.02,
    ringz: 0.09,
    pinkyz: 0.2,
  },
  paramBonesTwo: {
    wrist: 0.0,
    thumb: 0.9,
    index: 1.1,
    middle: 1.25,
    ring: 1.25,
    pinky: 1.15,
    thumbz: -0.1,
    indexz: -0.08,
    middlez: 0.02,
    ringz: 0.09,
    pinkyz: 0.2,
  },
};

// setting up the basic scene

const canvas = document.querySelector("canvas.webgl");
if (!canvas) {
  console.log("Canvas not found.");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(PARAMETERS.bg);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(-5, 5, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 2);

// importing the hand

const loader = new GLTFLoader();
loader.load(
  "/handKiril.glb",
  (handOne) => {
    console.log("Model loaded:", handOne);
    scene.add(handOne.scene);

    handOne.scene.rotation.z = -Math.PI / 2;
    handOne.scene.scale.set(0.3, 0.3, 0.3);
    handOne.scene.position.set(-1, 1, 0);

    // assigns objects depending on properties
    assignObjects(handOne.scene, "one");
    materialAssignment(handOne.scene, "one");
    settingBones(handOne.scene, "one");
  },
  undefined,
  (error) => {
    console.error("An error happened", error);
  }
);

loader.load(
  "/handKiril.glb",
  (handTwo) => {
    console.log("Model loaded:", handTwo);
    scene.add(handTwo.scene);

    handTwo.scene.rotation.z = Math.PI / 2;
    handTwo.scene.rotation.x = 3.2;
    handTwo.scene.scale.set(0.3, 0.3, 0.3);
    handTwo.scene.position.set(1, 1, 0);

    // assigns objects depending on properties
    assignObjects(handTwo.scene, "two");
    materialAssignment(handTwo.scene, "two");
    settingBones(handTwo.scene, "two");
  },
  undefined,
  (error) => {
    console.error("An error happened", error);
  }
);

// materials assignment

const materials = {
  hand: new THREE.MeshToonMaterial(),
  shirt: new THREE.MeshToonMaterial(),
  coatOne: new THREE.MeshToonMaterial(),
  coatTwo: new THREE.MeshToonMaterial(),
};

const materialAssignment = (model, whatModel) => {
  materials.hand.color = new THREE.Color(PARAMETERS.hand);
  materials.hand.roughness = 0.7;
  materials.hand.emissive = new THREE.Color(PARAMETERS.hand);
  materials.hand.emissiveIntensity = 0.3;

  materials.shirt.color = new THREE.Color(PARAMETERS.shirt);
  materials.coatOne.color = new THREE.Color(PARAMETERS.coat[0]);
  materials.coatTwo.color = new THREE.Color(PARAMETERS.coat[1]);

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("Hand")) {
        child.material = materials.hand;
      } else if (child.name.includes("Shirt")) {
        child.material = materials.shirt;
      }
    }
  });

  switch (whatModel) {
    case "one":
      model.traverse((child) => {
        if (child.isMesh && child.name.includes("Vest")) {
          child.material = materials.coatOne;
        }
      });
      break;
    case "two":
      model.traverse((child) => {
        if (child.isMesh && child.name.includes("Vest")) {
          child.material = materials.coatTwo;
        }
      });
      break;
  }
};

// object assignment based on property function

const assignObjects = (model, whatModel) => {
  switch (whatModel) {
    case "one":
      model.traverse((child) => {
        handObjectsOne.push(child);

        if (child.isMesh) {
          handMeshesOne.push(child);
        } else if (child.isBone) {
          fingerBonesOne.push(child);
        }
      });

      console.log(handObjectsOne);
      console.log("The hand ONE MESHES are, ", handMeshesOne);
      console.log("The hand ONE BONES are, ", fingerBonesOne);

      break;
    case "two":
      model.traverse((child) => {
        handObjectsTwo.push(child);

        if (child.isMesh) {
          handMeshesTwo.push(child);
        } else if (child.isBone) {
          fingerBonesTwo.push(child);
        }
      });

      console.log(handObjectsTwo);
      console.log("The hand TWO MESHES are, ", handMeshesTwo);
      console.log("The hand TWO BONES are, ", fingerBonesTwo);

      break;
  }
};

// setting bones

const settingBones = (model, whatModel) => {
  switch (whatModel) {
    case "one":
      bonesOne.wrist = model.getObjectByName("Hand").skeleton.bones[0];
      bonesOne.wrist1 = model.getObjectByName("Hand").skeleton.bones[1];
      bonesOne.wrist2 = model.getObjectByName("Hand").skeleton.bones[2];
      bonesOne.wrist3 = model.getObjectByName("Hand").skeleton.bones[6];
      bonesOne.wrist4 = model.getObjectByName("Hand").skeleton.bones[10];
      bonesOne.wrist5 = model.getObjectByName("Hand").skeleton.bones[14];
      bonesOne.wrist6 = model.getObjectByName("Hand").skeleton.bones[18];
      bonesOne.wrist1.rotation.x = PARAMETERS.paramBonesOne.wrist;
      bonesOne.wrist2.rotation.x = PARAMETERS.paramBonesOne.wrist;
      bonesOne.wrist3.rotation.x = PARAMETERS.paramBonesOne.wrist;
      bonesOne.wrist4.rotation.x = PARAMETERS.paramBonesOne.wrist;
      bonesOne.wrist5.rotation.x = PARAMETERS.paramBonesOne.wrist;
      bonesOne.wrist6.rotation.x = PARAMETERS.paramBonesOne.wrist;

      bonesOne.thumb1 = model.getObjectByName("Hand").skeleton.bones[3];
      bonesOne.thumb2 = model.getObjectByName("Hand").skeleton.bones[4];
      bonesOne.thumb3 = model.getObjectByName("Hand").skeleton.bones[5];
      bonesOne.thumb1.rotation.x = PARAMETERS.paramBonesOne.thumb;
      bonesOne.thumb2.rotation.x = PARAMETERS.paramBonesOne.thumb;
      bonesOne.thumb3.rotation.x = PARAMETERS.paramBonesOne.thumb;
      bonesOne.thumb1.rotation.z = PARAMETERS.paramBonesOne.thumbz;
      bonesOne.thumb2.rotation.z = PARAMETERS.paramBonesOne.thumbz;
      bonesOne.thumb3.rotation.z = PARAMETERS.paramBonesOne.thumbz;

      bonesOne.index1 = model.getObjectByName("Hand").skeleton.bones[7];
      bonesOne.index2 = model.getObjectByName("Hand").skeleton.bones[8];
      bonesOne.index3 = model.getObjectByName("Hand").skeleton.bones[9];
      bonesOne.index1.rotation.x = PARAMETERS.paramBonesOne.index;
      bonesOne.index2.rotation.x = PARAMETERS.paramBonesOne.index;
      bonesOne.index3.rotation.x = PARAMETERS.paramBonesOne.index;
      bonesOne.index1.rotation.z = PARAMETERS.paramBonesOne.indexz;
      bonesOne.index2.rotation.z = PARAMETERS.paramBonesOne.indexz;
      bonesOne.index3.rotation.z = PARAMETERS.paramBonesOne.indexz;

      bonesOne.middle1 = model.getObjectByName("Hand").skeleton.bones[11];
      bonesOne.middle2 = model.getObjectByName("Hand").skeleton.bones[12];
      bonesOne.middle3 = model.getObjectByName("Hand").skeleton.bones[13];
      bonesOne.middle1.rotation.x = PARAMETERS.paramBonesOne.middle;
      bonesOne.middle2.rotation.x = PARAMETERS.paramBonesOne.middle;
      bonesOne.middle3.rotation.x = PARAMETERS.paramBonesOne.middle;
      bonesOne.middle1.rotation.z = PARAMETERS.paramBonesOne.middlez;
      bonesOne.middle2.rotation.z = PARAMETERS.paramBonesOne.middlez;
      bonesOne.middle3.rotation.z = PARAMETERS.paramBonesOne.middlez;

      bonesOne.ring1 = model.getObjectByName("Hand").skeleton.bones[15];
      bonesOne.ring2 = model.getObjectByName("Hand").skeleton.bones[16];
      bonesOne.ring3 = model.getObjectByName("Hand").skeleton.bones[17];
      bonesOne.ring1.rotation.x = PARAMETERS.paramBonesOne.ring;
      bonesOne.ring2.rotation.x = PARAMETERS.paramBonesOne.ring;
      bonesOne.ring3.rotation.x = PARAMETERS.paramBonesOne.ring;
      bonesOne.ring1.rotation.z = PARAMETERS.paramBonesOne.ringz;
      bonesOne.ring2.rotation.z = PARAMETERS.paramBonesOne.ringz;
      bonesOne.ring3.rotation.z = PARAMETERS.paramBonesOne.ringz;

      bonesOne.pinky1 = model.getObjectByName("Hand").skeleton.bones[19];
      bonesOne.pinky2 = model.getObjectByName("Hand").skeleton.bones[20];
      bonesOne.pinky3 = model.getObjectByName("Hand").skeleton.bones[21];
      bonesOne.pinky1.rotation.x = PARAMETERS.paramBonesOne.pinky;
      bonesOne.pinky2.rotation.x = PARAMETERS.paramBonesOne.pinky;
      bonesOne.pinky3.rotation.x = PARAMETERS.paramBonesOne.pinky;
      bonesOne.pinky1.rotation.z = PARAMETERS.paramBonesOne.pinkyz;
      bonesOne.pinky2.rotation.z = PARAMETERS.paramBonesOne.pinkyz;
      bonesOne.pinky3.rotation.z = PARAMETERS.paramBonesOne.pinkyz;
      break;
    case "two":
      bonesTwo.wrist = model.getObjectByName("Hand").skeleton.bones[0];
      bonesTwo.wrist1 = model.getObjectByName("Hand").skeleton.bones[1];
      bonesTwo.wrist2 = model.getObjectByName("Hand").skeleton.bones[2];
      bonesTwo.wrist3 = model.getObjectByName("Hand").skeleton.bones[6];
      bonesTwo.wrist4 = model.getObjectByName("Hand").skeleton.bones[10];
      bonesTwo.wrist5 = model.getObjectByName("Hand").skeleton.bones[14];
      bonesTwo.wrist6 = model.getObjectByName("Hand").skeleton.bones[18];
      bonesTwo.wrist1.rotation.x = PARAMETERS.paramBonesTwo.wrist;
      bonesTwo.wrist2.rotation.x = PARAMETERS.paramBonesTwo.wrist;
      bonesTwo.wrist3.rotation.x = PARAMETERS.paramBonesTwo.wrist;
      bonesTwo.wrist4.rotation.x = PARAMETERS.paramBonesTwo.wrist;
      bonesTwo.wrist5.rotation.x = PARAMETERS.paramBonesTwo.wrist;
      bonesTwo.wrist6.rotation.x = PARAMETERS.paramBonesTwo.wrist;

      bonesTwo.thumb1 = model.getObjectByName("Hand").skeleton.bones[3];
      bonesTwo.thumb2 = model.getObjectByName("Hand").skeleton.bones[4];
      bonesTwo.thumb3 = model.getObjectByName("Hand").skeleton.bones[5];
      bonesTwo.thumb1.rotation.x = PARAMETERS.paramBonesTwo.thumb;
      bonesTwo.thumb2.rotation.x = PARAMETERS.paramBonesTwo.thumb;
      bonesTwo.thumb3.rotation.x = PARAMETERS.paramBonesTwo.thumb;
      bonesTwo.thumb1.rotation.z = PARAMETERS.paramBonesTwo.thumbz;
      bonesTwo.thumb2.rotation.z = PARAMETERS.paramBonesTwo.thumbz;
      bonesTwo.thumb3.rotation.z = PARAMETERS.paramBonesTwo.thumbz;

      bonesTwo.index1 = model.getObjectByName("Hand").skeleton.bones[7];
      bonesTwo.index2 = model.getObjectByName("Hand").skeleton.bones[8];
      bonesTwo.index3 = model.getObjectByName("Hand").skeleton.bones[9];
      bonesTwo.index1.rotation.x = PARAMETERS.paramBonesTwo.index;
      bonesTwo.index2.rotation.x = PARAMETERS.paramBonesTwo.index;
      bonesTwo.index3.rotation.x = PARAMETERS.paramBonesTwo.index;
      bonesTwo.index1.rotation.z = PARAMETERS.paramBonesTwo.indexz;
      bonesTwo.index2.rotation.z = PARAMETERS.paramBonesTwo.indexz;
      bonesTwo.index3.rotation.z = PARAMETERS.paramBonesTwo.indexz;

      bonesTwo.middle1 = model.getObjectByName("Hand").skeleton.bones[11];
      bonesTwo.middle2 = model.getObjectByName("Hand").skeleton.bones[12];
      bonesTwo.middle3 = model.getObjectByName("Hand").skeleton.bones[13];
      bonesTwo.middle1.rotation.x = PARAMETERS.paramBonesTwo.middle;
      bonesTwo.middle2.rotation.x = PARAMETERS.paramBonesTwo.middle;
      bonesTwo.middle3.rotation.x = PARAMETERS.paramBonesTwo.middle;
      bonesTwo.middle1.rotation.z = PARAMETERS.paramBonesTwo.middlez;
      bonesTwo.middle2.rotation.z = PARAMETERS.paramBonesTwo.middlez;
      bonesTwo.middle3.rotation.z = PARAMETERS.paramBonesTwo.middlez;

      bonesTwo.ring1 = model.getObjectByName("Hand").skeleton.bones[15];
      bonesTwo.ring2 = model.getObjectByName("Hand").skeleton.bones[16];
      bonesTwo.ring3 = model.getObjectByName("Hand").skeleton.bones[17];
      bonesTwo.ring1.rotation.x = PARAMETERS.paramBonesTwo.ring;
      bonesTwo.ring2.rotation.x = PARAMETERS.paramBonesTwo.ring;
      bonesTwo.ring3.rotation.x = PARAMETERS.paramBonesTwo.ring;
      bonesTwo.ring1.rotation.z = PARAMETERS.paramBonesTwo.ringz;
      bonesTwo.ring2.rotation.z = PARAMETERS.paramBonesTwo.ringz;
      bonesTwo.ring3.rotation.z = PARAMETERS.paramBonesTwo.ringz;

      bonesTwo.pinky1 = model.getObjectByName("Hand").skeleton.bones[19];
      bonesTwo.pinky2 = model.getObjectByName("Hand").skeleton.bones[20];
      bonesTwo.pinky3 = model.getObjectByName("Hand").skeleton.bones[21];
      bonesTwo.pinky1.rotation.x = PARAMETERS.paramBonesTwo.pinky;
      bonesTwo.pinky2.rotation.x = PARAMETERS.paramBonesTwo.pinky;
      bonesTwo.pinky3.rotation.x = PARAMETERS.paramBonesTwo.pinky;
      bonesTwo.pinky1.rotation.z = PARAMETERS.paramBonesTwo.pinkyz;
      bonesTwo.pinky2.rotation.z = PARAMETERS.paramBonesTwo.pinkyz;
      bonesTwo.pinky3.rotation.z = PARAMETERS.paramBonesTwo.pinkyz;
      break;
  }
};

// Gets window sizes and updates for responsiveness

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const onResize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener("resize", onResize);

// actually rendering the hand onto the screen

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// assigning basic controls and outline

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
control.target.set(0, 0.85, 0);
control.maxPolarAngle = Math.PI / 2;
control.minDistance = 2;
control.maxDistance = 8;

const outline = new OutlineEffect(renderer, {
  defaultThickness: 0.0035,
  defaultColor: [0, 0, 0],
  defaultAlpha: 0.8,
  defaultKeepAlive: true,
});

const animate = () => {
  requestAnimationFrame(animate);

  control.update();

  outline.render(scene, camera);
};

animate();

/*
 * Game logic has been made here
 * Score hover effect has been made here
 */

const scoreWin = document.querySelector(".hoverWin");
const scoreDraw = document.querySelector(".hoverDraw");
const scoreLoss = document.querySelector(".hoverLoss");

const win = document.getElementById("wins");
const draws = document.getElementById("draws");
const losses = document.getElementById("losses");

// opacity increases on hover and dissapears on non hover

win.addEventListener("mouseenter", () => {
  scoreWin.style.opacity = 1;
});

win.addEventListener("mouseleave", () => {
  scoreWin.style.opacity = 0;
});

draws.addEventListener("mouseenter", () => {
  scoreDraw.style.opacity = 1;
});

draws.addEventListener("mouseleave", () => {
  scoreDraw.style.opacity = 0;
});

losses.addEventListener("mouseenter", () => {
  scoreLoss.style.opacity = 1;
});

losses.addEventListener("mouseleave", () => {
  scoreLoss.style.opacity = 0;
});

// game logic

const buttonRock = document.getElementById("rock");
const buttonPaper = document.getElementById("paper");
const buttonScissor = document.getElementById("scissor");

let playerPick = [];
let computerPick = [];
let possibleAnswers = ["rock", "paper", "scissor"];

buttonRock.addEventListener("click", () => {
  playerPick.unshift(possibleAnswers[0]);
  computerPicker();
});

buttonPaper.addEventListener("click", () => {
  playerPick.unshift(possibleAnswers[1]);
  computerPicker();

  const duration = 0.8;

  GSAP.to(bonesOne.index1.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.index2.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.index3.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.middle1.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.middle2.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.middle3.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.pinky1.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.pinky2.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.pinky3.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });
});

buttonScissor.addEventListener("click", () => {
  playerPick.unshift(possibleAnswers[2]);
  computerPicker();

  const duration = 0.8; // Duration of the animation in seconds

  GSAP.to(bonesOne.index1.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.index2.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.index3.rotation, {
    x: 0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.middle1.rotation, {
    x: 0.1,
    z: -0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.middle2.rotation, {
    x: 0.1,
    z: -0.1,
    duration: duration,
    ease: "power1.inOut",
  });

  GSAP.to(bonesOne.middle3.rotation, {
    x: 0.1,
    z: -0.1,
    duration: duration,
    ease: "power1.inOut",
  });
});

const computerPicker = () => {
  let computerAns =
    possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
  console.log("computer answer", computerAns);
  computerPick.unshift(computerAns);
  console.log(playerPick, "and", computerPick);
  comparingAns();
};

const comparingAns = () => {
  if (playerPick[0] === computerPick[0]) {
    console.log("its a draw");
    changeScore("draw");
  } else if (
    (playerPick[0] === "rock" && computerPick[0] === "scissor") ||
    (playerPick[0] === "scissor" && computerPick[0] === "paper") ||
    (playerPick[0] === "paper" && computerPick[0] === "rock")
  ) {
    console.log("player wins");
    changeScore("win");
  } else {
    console.log("computer wins");
    changeScore("lose");
  }
};

let winInt = 0;
let drawInt = 0;
let lossInt = 0;

const changeScore = (caseString) => {
  switch (caseString) {
    case "win":
      winInt += 1;
      break;
    case "lose":
      lossInt += 1;
      break;
    case "draw":
      drawInt += 1;
      break;
    default:
      console.log("Unknown case");
      break;
  }

  // Ensure the score has at least two digits
  let formattedWin = winInt.toString().padStart(2, "0");
  win.textContent = formattedWin;

  let formattedDraw = drawInt.toString().padStart(2, "0");
  draws.textContent = formattedDraw;

  let formattedLoss = lossInt.toString().padStart(2, "0");
  losses.textContent = formattedLoss;
};

const toggle = document.getElementById("cb1");

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    canvas.style.zIndex = -10;
  } else {
    canvas.style.zIndex = 10;
  }
});

console.log(bonesOne);
console.log(bonesTwo);

function handAnimator(playerPick, ComputerPick) {}

function rock() {}

function scissors() {}

function paper() {}

function upNDownHand() {}

function returnNomral() {}
