export const gridFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDpr; // Retornamos o Pixel Ratio para o grid
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uGrainIntensity;
  uniform sampler2D uTouchTexture;

  // --- FUNÇÕES DE RUÍDO ---
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // <- A SUA CORREÇÃO AQUI!
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  // --- FUNÇÕES DO CRT E DO GRID ---
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

  float gridPattern(vec2 fragCoordPx, float cellPx) {
    vec2 g = mod(fragCoordPx, cellPx);
    vec2 distToLine = min(g, cellPx - g);
    float d = min(distToLine.x, distToLine.y);
    return 1.0 - smoothstep(0.0, 2.0, d);
  }

 void main() {
    vec2 uv = vUv;
    
    // 1. TEXTURA DO MOUSE
    vec4 touch = texture2D(uTouchTexture, uv);
    
    // 2. CORREÇÃO DA DIREÇÃO DA ÁGUA
    vec2 mouseDistortion = (touch.rg - 0.5) * touch.b * 2.0;
    vec2 warpedUv = uv + vec2(-mouseDistortion.x, mouseDistortion.y) * 0.05;

    // 3. A SUA COR DE FUNDO ORIGINAL (Sólida e estática)
    vec3 bgColor = vec3(0.0588, 0.0902, 0.1647); 
    
    // O Blob Fino de Luz do mouse
    float thinBlob = pow(touch.b, 2.5);
    bgColor += vec3(0.0, 0.8, 1.0) * thinBlob * 1.5;

    // 4. O GRID DERRETENDO
    float cellPx = 105.0 * uDpr;
    vec2 warpedFragCoord = warpedUv * uResolution; 
    
    float grid = gridPattern(warpedFragCoord, cellPx);
    vec3 lineColor = vec3(0.5, 0.75, 1.0); 
    float lineAlpha = 0.15; 
    
    vec3 finalColor = mix(bgColor, lineColor, grid * lineAlpha);

    // 5. O VIDRO DO MONITOR (Estático)
    vec2 fragCoord = uv * uResolution; 
    
    vec3 mask = shadowMask(fragCoord, 1.0 * uDpr);
    finalColor *= mix(vec3(0.20), mask, 1.0); 

    float scan = scanlineWeight(fragCoord, 1.0 * uDpr, 0.08);
    finalColor *= mix(1.0, scan, 0.1);

    // Ruído de TV
   

    gl_FragColor = vec4(finalColor, 1.0);
  }
`