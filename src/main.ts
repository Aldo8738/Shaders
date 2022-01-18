// external dependencies
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// local from us provided utilities
import RenderWidget from "./lib/rendererWidget";
import { Application, createWindow } from "./lib/window";
import type * as utils from "./lib/utils";

// helper lib, provides exercise dependent prewritten Code
import * as helper from "./helper";

// load shaders
import basicVertexShader from "./shader/basic.v.glsl";
import basicFragmentShader from "./shader/basic.f.glsl";
import { Uniform, Vector3 } from "three";

// defines callback that should get called whenever the
// params of the settings get changed (eg. via GUI)
function callback(changed: utils.KeyValuePair<helper.Settings>) {
  const uniforms_ = model.material.uniforms;

  switch (changed.key) {
    case "ambient_color":
      uniforms_.uColor.value = new Vector3(
        changed.value[0] / 255,
        changed.value[1] / 255,
        changed.value[2] / 255
      );
      //console.log(changed.value);
      break;
    case "ambient_reflectance":
      uniforms_.ambientRefl.value = changed.value;
      break;
    case "shader":
      switch (changed.value) {
        case "Basic":
          uniforms_.shaderSelector.value = 0;
          break;
        case "Ambient":
          uniforms_.shaderSelector.value = 1;
          break;
        case "Normal":
          uniforms_.shaderSelector.value = 2;
          break;
        case "Toon":
          uniforms_.shaderSelector.value = 3;
          break;
        case "Lambert":
          uniforms_.shaderSelector.value = 4;
          break;
        case "Gouraud":
          uniforms_.shaderSelector.value = 5;
          break;
        case "Phong":
          uniforms_.shaderSelector.value = 6;
          break;
        case "Blinn-Phong":
          uniforms_.shaderSelector.value = 7;
          break;
      }
      break;
    case "lightX":
      light.translateX(changed.value / 30);
      uniforms_.lightPos.value = light.position;
      break;
    case "lightY":
      light.translateY(changed.value / 30);
      uniforms_.lightPos.value = light.position;
      break;
    case "lightZ":
      light.translateZ(changed.value / 30);
      uniforms_.lightPos.value = light.position;
      break;
    case "diffuse_color":
      uniforms_.diffColor.value = new Vector3(
        changed.value[0] / 255,
        changed.value[1] / 255,
        changed.value[2] / 255
      );
      break;
    case "diffuse_reflectance":
      uniforms_.diffRefl.value = changed.value;
      break;
    case "specular_color":
      uniforms_.specColor.value = new Vector3(
        changed.value[0] / 255,
        changed.value[1] / 255,
        changed.value[2] / 255
      );
      break;
    case "specular_reflectance":
      uniforms_.specRefl.value = changed.value;
      break;
    case "magnitude":
      uniforms_.magnitude.value = changed.value;
  }
}

var uniforms: { [uniform: string]: THREE.IUniform };
uniforms = {
  uColor: { value: new Vector3(0.6, 0, 0) },
  diffColor: { value: new Vector3(0.8, 0.09, 0.09) },
  specColor: { value: new Vector3(1, 1, 1) },
  ambientRefl: { value: 0.5 },
  diffRefl: { value: 1 },
  specRefl: { value: 1 },
  magnitude: { value: 128 },
  shaderSelector: { value: 0.0 },
  lightPos: { value: new Vector3(0, 0, 0) },
};

var geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 32);
var material_ = new THREE.RawShaderMaterial({
  uniforms: uniforms,
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
});
var model = new THREE.Mesh(geometry, material_);
// add light proxy
var lightgeo = new THREE.SphereGeometry(0.1, 32, 32);
var lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff8010 });
var light = new THREE.Mesh(lightgeo, lightMaterial);

function main() {
  var root = Application("Shader");
  root.setLayout([["renderer"]]);
  root.setLayoutColumns(["100%"]);
  root.setLayoutRows(["100%"]);

  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings
  var settings = new helper.Settings();
  helper.createGUI(settings);
  // adds the callback that gets called on params change
  settings.addCallback(callback);

  // ---------------------------------------------------------------------------
  // create RenderDiv
  var rendererDiv = createWindow("renderer");
  root.appendChild(rendererDiv);

  // create renderer
  var renderer = new THREE.WebGLRenderer({
    antialias: true, // to enable anti-alias and get smoother output
  });

  // create scene
  var scene = new THREE.Scene();
  var { material } = helper.setupGeometry(scene);

  scene.add(light);

  // create camera
  var camera = new THREE.PerspectiveCamera();
  helper.setupCamera(camera, scene);

  // create controls
  var controls = new OrbitControls(camera, rendererDiv);
  helper.setupControls(controls);

  // fill the renderDiv. In RenderWidget happens all the magic.
  // It handles resizes, adds the fps widget and most important defines the main animate loop.
  // You dont need to touch this, but if feel free to overwrite RenderWidget.animate
  var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
  // start the draw loop (this call is async)
  wid.animate();

  scene.add(model);
}

// call main entrypoint
main();
