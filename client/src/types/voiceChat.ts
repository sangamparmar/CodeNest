import { User } from './user';
import SimplePeer from 'simple-peer';

export interface VoiceCallPeer {
  peerInstance: SimplePeer.Instance;
  username: string;
  isMuted: boolean;
  isSpeaking: boolean;
  audioElement?: HTMLAudioElement;
}

export interface VoiceChatContextType {
  isInVoiceCall: boolean;
  isVoiceCallActive: boolean;
  isMicMuted: boolean;
  audioLevel: number;
  peers: Record<string, VoiceCallPeer>;
  callError: string | null;
  startVoiceChat: () => Promise<void>;
  stopVoiceChat: () => void;
  toggleMicrophone: () => void;
  getCallParticipants: () => User[];
}

export interface VoiceChatState {
  isInVoiceCall: boolean;
  isVoiceCallActive: boolean;
  isMicMuted: boolean;
  audioLevel: number;
  peers: Record<string, VoiceCallPeer>;
  callError: string | null;
}