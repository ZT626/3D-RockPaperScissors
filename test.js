/*
 * -- imports library and shit --
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import GSAP from "gsap";
import { Pane } from "tweakpane";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";
import { checker } from "three/examples/jsm/nodes/Nodes.js";

/* reminder to self - can change colour here */
const PARAMETERS = {
  bg: 0xffffff,
  hand: 0xf8db27,
  shirt: 0xffffff,
  coat: [0x0000ff, 0xff0000],
};

let objects = [];
let fingerBones = [];

// basic setup

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

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true, // reminder this is an experiment please try changing this if there are bugs
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//loading the hand onto the scene and assigning materials

const loader = new GLTFLoader();
loader.load(
  "/handKiril.glb",
  (gltf) => {
    console.log("Model loaded:", gltf);
    scene.add(gltf.scene);

    gltf.scene.rotation.z = -Math.PI / 2; // Rotate the hand 90 degrees along the x-axis
    gltf.scene.scale.set(0.3, 0.3, 0.3); // Scale down if too large
    gltf.scene.position.set(-1, 1, 0); // Adjust position if necessary

    whatObjectsAreThere(gltf.scene);
    settingMaterial(gltf.scene);
  },
  undefined,
  (error) => {
    console.error("An error happened", error);
  }
);

loader.load(
  "/handKiril.glb",
  (gltf2) => {
    console.log("Model loaded:", gltf2);
    scene.add(gltf2.scene);

    gltf2.scene.rotation.z = Math.PI / 2; // Rotate the hand 90 degrees along the x-axis
    gltf2.scene.scale.set(0.3, 0.3, 0.3); // Scale down if too large
    gltf2.scene.position.set(1, 1, 0); // Adjust position if necessary

    whatObjectsAreThere(gltf2.scene);
    settingMaterialTwo(gltf2.scene);
  },
  undefined,
  (error) => {
    console.error("An error happened", error);
  }
);

const materials = {
  hand: new THREE.MeshToonMaterial(),
  shirt: new THREE.MeshToonMaterial(),
  coatOne: new THREE.MeshToonMaterial(),
  coatTwo: new THREE.MeshToonMaterial(),
};

const settingMaterial = (model) => {
  materials.hand.color = new THREE.Color(PARAMETERS.hand);
  materials.hand.roughness = 0.7;
  materials.hand.emissive = new THREE.Color(PARAMETERS.hand);
  materials.hand.emissiveIntensity = 0.3;

  materials.shirt.color = new THREE.Color(PARAMETERS.shirt);
  materials.coatOne.color = new THREE.Color(PARAMETERS.coat[0]);

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("Hand")) {
        child.material = materials.hand;
      } else if (child.name.includes("Shirt")) {
        child.material = materials.shirt;
      } else if (child.name.includes("Vest")) {
        child.material = materials.coatOne;
      }
    } else if (child.isBone) {
      if (child.name.includes("Bone")) {
        fingerBones.push(child);
      } // this also pushes bones onto the thing!
    }
  });
};
// for the differant hand
const settingMaterialTwo = (model) => {
  materials.hand.color = new THREE.Color(PARAMETERS.hand);
  materials.hand.roughness = 0.7;
  materials.hand.emissive = new THREE.Color(PARAMETERS.hand);
  materials.hand.emissiveIntensity = 0.3;

  materials.shirt.color = new THREE.Color(PARAMETERS.shirt);
  materials.coatTwo.color = new THREE.Color(PARAMETERS.coat[1]);

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name.includes("Hand")) {
        child.material = materials.hand;
      } else if (child.name.includes("Shirt")) {
        child.material = materials.shirt;
      } else if (child.name.includes("Vest")) {
        child.material = materials.coatTwo;
      }
    } else if (child.isBone) {
      if (child.name.includes("Bone")) {
        fingerBones.push(child);
      } // this also pushes bones onto the thing!
    }
  });
};

// resizing capabilities for the canvas

window.addEventListener("resize", () => {
  onResize();
});

const onResize = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// outline effect for hand

const outline = new OutlineEffect(renderer, {
  defaultThickness: 0.0035,
  defaultColor: [0, 0, 0],
  defaultAlpha: 0.8,
  defaultKeepAlive: true,
});

// actually puttes the project on the scene - if i forget

const animate = () => {
  requestAnimationFrame(animate);

  outline.render(scene, camera);
};

animate();

function whatObjectsAreThere(model) {
  model.traverse((child) => {
    objects.push(child);
  });
}
console.info("Total objects", objects);
console.info("Bones", fingerBones);

// GSAP test lmfao - goofy ahh shiz pls work

// hoverable scores
const scoreWin = document.querySelector(".hoverWin");
const scoreDraw = document.querySelector(".hoverDraw");
const scoreLoss = document.querySelector(".hoverLoss");

const win = document.getElementById("wins");
const draws = document.getElementById("draws");
const losses = document.getElementById("losses");

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

// Game logic
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
});

buttonScissor.addEventListener("click", () => {
  playerPick.unshift(possibleAnswers[2]);
  computerPicker();
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
