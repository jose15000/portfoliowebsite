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
    vec2 warpedUv = uv + vec2(-mouseDistortion.x, mouseDistortion.y) * 0.15;
    vec4 imageColor = texture2D(uBackgroundImage, warpedUv);
    vec3 baseColor = imageColor.rgb;
    
    float mouseGlow = pow(touch.b, 2.0);
    vec3 finalColor = baseColor + vec3(1.0) * mouseGlow * 0.5; 
    
    // 3. O VIDRO DO MONITOR (CRT) - CALIBRADO PARA UI
    vec2 fragCoord = uv * uResolution; 
    
    // Suavizamos a grade de pixels. 
    // Em vez de 1.0 (100% de força), baixamos para 0.35 (35%).
    vec3 mask = shadowMask(fragCoord, 1.0 * uDpr);
    finalColor *= mix(vec3(1.0), mask, 0.35); 

    // Clareamos o fundo das scanlines (de 0.6 para 1.0) para não escurecer a imagem
    float scan = scanlineWeight(fragCoord, 0.4 * uDpr, 0.02);
    finalColor *= mix(1.0, scan, 0.15);

    // Como removemos a "escuridão" pesada das máscaras acima, 
    // não precisamos mais estourar o brilho. Reduzimos de 3.0 para um leve 1.15.
    finalColor *= 1.08;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;