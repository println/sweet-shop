import { Injectable } from '@angular/core';
import * as LZString from 'lz-string';
import { AppState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CompressionService {

  constructor() { }

  compressState(state: AppState): string {
    const jsonString = JSON.stringify(state);
    return LZString.compressToEncodedURIComponent(jsonString);
  }

  decompressState(compressed: string): AppState | null {
    try {
      const jsonString = LZString.decompressFromEncodedURIComponent(compressed);
      if (!jsonString) return null;
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error decompressing state', e);
      return null;
    }
  }
}
