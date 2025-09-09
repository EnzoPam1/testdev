"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3  uColorStops[3];
uniform vec2  uResolution;
uniform float uBlend;
uniform float uOverscan;   // <— zoom léger pour éviter les bords

out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x,289.0); }
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

struct ColorStop{ vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor){\
  int index=0; for(int i=0;i<2;i++){ ColorStop c=colors[i]; bool b=c.position<=factor; index=int(mix(float(index),float(i),float(b))); }\
  ColorStop c=colors[index]; ColorStop n=colors[index+1];\
  float range=n.position-c.position; float t=(factor-c.position)/range; finalColor=mix(c.color,n.color,t);\
}

void main(){
  // uv plein écran
  vec2 uv = gl_FragCoord.xy / uResolution;

  // overscan : zoom léger autour du centre pour pousser les bords hors écran
  vec2 suv = (uv - 0.5) * uOverscan + 0.5;

  // rampe de couleur (clamp pour éviter artefacts hors [0..1])
  vec3 rampColor;
  {
    ColorStop colors[3];
    colors[0] = ColorStop(uColorStops[0], 0.0);
    colors[1] = ColorStop(uColorStops[1], 0.5);
    colors[2] = ColorStop(uColorStops[2], 1.0);
    float fx = clamp(suv.x, 0.0, 1.0);
    COLOR_RAMP(colors, fx, rampColor);
  }

  float h = snoise(vec2(suv.x * 2.0 + uTime * 0.06, uTime * 0.15)) * 0.5 * uAmplitude;
  h = exp(h);
  h = (suv.y * 2.0 - h + 0.2);
  float intensity = 0.6 * h;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  opacity?: number;
  overscan?: number;
}

export default function AuroraBackground({
  colorStops = ["#CB90F1", "#F6AEAE", "#C174F2"],
  amplitude = 0.9,
  blend = 0.45,
  speed = 0.35,
  opacity = 0.32,
  overscan = 1.12,
}: AuroraProps) {
  const ctnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.opacity = String(opacity);

    let program: Program | undefined;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, ctn.clientWidth);
      const height = Math.max(1, ctn.clientHeight);
      renderer.setSize(width, height, dpr);
      if (program) program.uniforms.uResolution.value = [width * dpr, height * dpr];
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(ctn);

    const geometry = new Triangle(gl);
    if ((geometry as any).attributes?.uv) delete (geometry as any).attributes.uv;

    const toStops = (stops: string[]) =>
      stops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uAmplitude:  { value: amplitude },
        uColorStops: { value: toStops(colorStops) },
        uResolution: { value: [1, 1] },
        uBlend:      { value: blend },
        uOverscan:   { value: overscan },
      },
      transparent: true as any,
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!program) return;
      program.uniforms.uTime.value = (t * 0.003) * speed;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    setSize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, speed, opacity, overscan, colorStops]);

  return (
    <div
      ref={ctnRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
