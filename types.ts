
export interface BusinessResult {
  text: string;
  links: GroundingLink[];
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
