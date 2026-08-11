export const aquaFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  
  uniform float uTime;
  uniform sampler2D uTouchTexture;
  uniform sampler2D uBackgroundImage; // <-- Recebe a imagem do React

  // Variáveis do CRT
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform float uGrainIntensity;
  
  // --- FUNÇÕES DO CRT ---
  vec3 shadowMask(vec2 fragCoord, float cell) {
    float maskDark  = 0.55;
    float maskLight = 1.35;
    float x = mod(fragCoord.x / cell, 3.0);
    vec3 m = vec3(maskDark);
    if (x < 1.0)      m.r = maskLight;
    else if (x < 2.0) m.g = maskLight;
    else              m.b = maskLight;
    return m;
  }

  float gaus(float pos, float scale) {
    return exp2(scale * pos * pos);
  }

  float scanlineWeight(vec2 fragCoord, float lineHeight, float hardness) {
    float pos = fragCoord.y / lineHeight;
    float dist = fract(pos) - 0.5;
    return gaus(dist, hardness);
  }

  void main() {
    vec2 uv = vUv;
    
    // 1. LEITURA DO MOUSE
    vec4 touch = texture2D(uTouchTexture, uv);
    vec2 mouseDistortion = (touch.rg - 0.5) * touch.b * 2.0;
    
    // 2. ENTORTANDO A IMAGEM
    // Nós somamos a distorção do mouse na coordenada UV original
    vec2 warpedUv = uv + vec2(-mouseDistortion.x, mouseDistortion.y) * 0.15;
    
    // Lemos a cor exata da imagem nessa coordenada distorcida
    vec4 imageColor = texture2D(uBackgroundImage, warpedUv);
    vec3 baseColor = imageColor.rgb;
    
    // Adicionamos um pouco de brilho extra no rastro do mouse
    float mouseGlow = pow(touch.b, 2.0);
    vec3 finalColor = baseColor + vec3(1.0) * mouseGlow * 0.5; 
    
    // 3. O VIDRO DO MONITOR (CRT)
    vec2 fragCoord = uv * uResolution; 
    
    vec3 mask = shadowMask(fragCoord, 1.0 * uDpr);
    finalColor *= mix(vec3(0.20), mask, 1.0); 

    float scan = scanlineWeight(fragCoord, 1.0 * uDpr, 0.02);
    finalColor *= mix(1.0, scan, 0.1);

    float grain = fract(sin(dot(uv.xy, vec2(12.9898,78.233)) + uTime) * 43758.5453) - 0.5;
    finalColor += grain * uGrainIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;