export type RealtimeMessageType =
  | 'PING'
  | 'PONG'
  | 'CAMERA_DATA'
  | 'COMMAND'
  | 'ACK'
  | 'ERROR';

export interface RealtimeEnvelope<T = unknown> {
  id: string;
  correlationId: string;
  type: RealtimeMessageType;
  timestamp: number;
  payload?: T;
}

export enum RealtimeConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RETRYING = 'RETRYING',
  FAILED = 'FAILED'
}

