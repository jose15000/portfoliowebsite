export const aquaFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  
  uniform float uTime;
  uniform sampler2D uTouchTexture;
  uniform vec3 uColorDark;  
  uniform vec3 uColorLight; 

  // Variáveis do CRT
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform float uGrainIntensity;
  
  // --- FUNÇÕES DE RUÍDO DA ÁGUA ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ; m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

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
    
    vec4 touch = texture2D(uTouchTexture, uv);
    vec2 mouseDistortion = (touch.rg - 0.5) * touch.b * 2.0;
    
    vec2 warpedUv = uv + vec2(-mouseDistortion.x, mouseDistortion.y) * 0.15;
    float t = uTime * 0.2;
    vec2 waterScale = warpedUv * 3.0; 
    
    waterScale.x += snoise(vec2(warpedUv.y * 2.0, t)) * 0.1;
    waterScale.y += snoise(vec2(warpedUv.x * 2.0, t + 10.0)) * 0.1;
    
    // CORREÇÃO: Forçando os floats a serem vec2 para evitar erro de placa de vídeo
    float caustics = 1.0 - abs(snoise(waterScale + vec2(t)));
    caustics = pow(caustics, 4.0); 
    
    float sparkles = snoise(warpedUv * 15.0 - vec2(uTime * 0.5));
    sparkles = pow(abs(sparkles), 18.0) * 2.0; 
    
    vec3 baseColor = mix(uColorDark, uColorLight, warpedUv.y + snoise(warpedUv + vec2(t))*0.2);
    
    float mouseGlow = pow(touch.b, 2.0);
    vec3 finalColor = baseColor + vec3(caustics * 0.8) + vec3(sparkles) + vec3(1.0) * mouseGlow * 1.5;
    
    // O VIDRO DO MONITOR
    vec2 fragCoord = uv * uResolution; 
    
    vec3 mask = shadowMask(fragCoord, 1.0 * uDpr);
    finalColor *= mix(vec3(0.20), mask, 1.0); 

    float scan = scanlineWeight(fragCoord, 1.0 * uDpr, 0.08);
    finalColor *= mix(1.0, scan, 0.1);

    float grain = fract(sin(dot(uv.xy, vec2(12.9898,78.233)) + uTime) * 43758.5453) - 0.5;
    finalColor += grain * uGrainIntensity;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;