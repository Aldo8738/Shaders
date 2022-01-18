
// defines the precision
precision highp float;

// we have access to the same uniforms as in the vertex shader
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
out vec4 fragColor;
// = camera position in world space
uniform vec3 cameraPosition;


//My Uniforms
uniform float ambientRefl;
uniform float diffRefl;
uniform float specRefl;

uniform vec3 uColor;
uniform vec3 diffColor;
uniform vec3 specColor;

uniform vec3 lightPos;
uniform float magnitude;

uniform int shaderSelector;

//My Ins & Outs

in vec3 normal_sh;
in vec3 fNormal;
in vec3 fPosition;
in vec3 diffPos;
in vec3 gouraud;
in vec3 norm_N;
in vec3 v;


// main function gets executed for every pixel
void main()
{

  //Toon shader
  vec3 n = normalize(fNormal);
  float intensity = dot(normalize(fPosition), n);
  vec3 toon;

  if (intensity > 0.95) {
    toon = vec3(0.54,0.71,0.91);
  }else if (intensity > 0.6) {
    toon = vec3(0.26,0.57,0.9);
  }else if (intensity > 0.3) {
    toon = vec3(0.21,0.43,0.7);
  } else {
    toon = vec3(.2,0.25,0.41);
  }

  // Diffuse 
  float diffIntensity = dot(normalize(diffPos), n);
  vec3 diff = vec3(diffColor*diffIntensity)*diffRefl;

  // Phong 
  vec4 lightPosition = viewMatrix * vec4(lightPos, 1.0);
  vec3 L = normalize(lightPosition.xyz - v);
  vec3 E = normalize(-v);
  vec3 R = normalize(-reflect(L,norm_N));
  
  // * 3.0 => so it will be more visible
  vec3 Phong =  specColor * pow(max(dot(R,E),0.0),magnitude) * specRefl *3.0;
  
  //Blinn-Phong
  vec3 H = normalize(E+L);

 // Shader Selector
  vec3 vOutput;
  switch (shaderSelector) {
    case 0:
      vOutput = vec3(0,0,0);
      break;
    case 1:
      vOutput = uColor*ambientRefl;
      break;
    case 2:
      vOutput = normal_sh*ambientRefl;
      break;
    case 3:
      vOutput = toon*ambientRefl;
      break;
    case 4: 
      vOutput = vec3(0,0,0) + diff;
      break;
    case 5: 
      vOutput =  (gouraud + diff + uColor)*ambientRefl;
      break;

    case 6:
      vOutput = (uColor + diff + Phong)*ambientRefl;
     break;
    case 7:
      // * 3.0 so it will be more visible
      vec3 L_blinn = specColor * pow(max(dot(H,norm_N), 0.0) ,magnitude) *specRefl *3.0;
      vOutput = (uColor + diff + L_blinn)*ambientRefl;
      break;
     }
		
     fragColor = vec4(vOutput, 1.0);
	

}