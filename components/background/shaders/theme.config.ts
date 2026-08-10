import * as THREE from 'three';
import { gridFragmentShader } from './gridShader';
import { aquaFragmentShader } from './aquaShader';


export const THEMES = {
  dark: {
    fragment: gridFragmentShader,
    uniforms: {
      uColorDark: { value: new THREE.Color('#050914') },
      uColorLight: { value: new THREE.Color('#0a1526') },
    }
  },
  aqua: {
    fragment: aquaFragmentShader,
    uniforms: {
      uColorDark: { value: new THREE.Color('#0022ff') },
      uColorLight: { value: new THREE.Color('#00eeff') },
    }
  }
};

export type ThemeName = keyof typeof THEMES;