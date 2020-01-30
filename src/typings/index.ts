import { ColorResult } from 'react-color';

export interface FrameInfo {
  frame: number
  opacity?: number
  color?: ColorResult['rgb']
}

export * from './d3-type';