#version 300 es

// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision
precision highp float;

// = object.matrixWorld
uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
uniform mat3 normalMatrix;

// = camera position in world space
uniform vec3 cameraPosition;


// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;
in vec2 uv;

//My Uniforms & Outs
uniform vec3 lightPos;
uniform float specRefl;
uniform vec3 specColor;



out vec3 fNormal;
out vec3 fPosition;
out vec3 normal_sh;
out vec3 diffPos;
out vec3 gouraud;
out vec3 v;
out vec3 norm_N;



// main function gets executed for every vertex
void main()
{
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  
  //Normal
  vec4 temp = modelMatrix * vec4(normal,1.0);
  normal_sh = temp.xyz;
  
  // Toon
  vec4 objPos = modelViewMatrix * vec4(position, 1.0);
  vec4 cameraPos = viewMatrix * vec4(cameraPosition, 1.0);
  fPosition = cameraPos.xyz - objPos.xyz;
  vec3 N = normalMatrix * normal;
  fNormal = N;

  // Diffuse
  vec4 lightPosition = viewMatrix * (2.,2.,3.));
  diffPos = lightPosition.xyz - objPos.xyz;

  //  Specular
  vec3 L = normalize(lightPosition.xyz - objPos.xyz);
  vec3 E = normalize(-objPos.xyz);
  vec3 R = normalize(-reflect(L,normalize(N)));
  
  // Gourad
  vec3 Ispec = specColor * pow(max(dot(R,E),0.0),50.) * specRefl * 3.0;
  gouraud = Ispec;

  // Phong
  v = objPos.xyz;
  norm_N = normalize(normalMatrix * normal);

}
