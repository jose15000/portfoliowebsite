import * as THREE from 'three';
import { gridFragmentShader } from './gridShader';

export const THEMES = {
  dark: {
    fragment: gridFragmentShader,
    uniforms: {
      uColorDark: { value: new THREE.Color('#050914') },
      uColorLight: { value: new THREE.Color('#0a1526') },
    }
  }
} as const;

export type ThemeName = keyof typeof THEMES;