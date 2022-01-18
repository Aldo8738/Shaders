import basicVertexShader from './shader/basic.v.glsl';
import basicFragmentShader from './shader/basic.f.glsl';

var scene = new THREE.Scene();
var uniforms: { [uniform: string] : THREE.IUniform };
uniforms = {
    magnitude: { value:2 }
    w_coord:   { value:1.}
}

var geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 32)
var material = new THREE.RawShaderMaterial( {
    uniforms: uniforms,
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader
});
var model = new THREE.Mesh(geometry, material);
scene.add(model);


// (dummy example: pass constant w coordinate)
uniform float w_coord;
// position is set by three.js
//attribute vec3 position;


