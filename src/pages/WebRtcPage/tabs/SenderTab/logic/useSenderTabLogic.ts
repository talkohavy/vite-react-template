import { useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents } from '@src/common/constants/websocket';
import { isTopicMessage } from '@src/common/utils/isTopicMessage';
import { useWebSocket, WsConnectionStatus } from '@src/providers/WebSocketProvider';
import { WebRtcSignalTypes } from '../../../logic/constants';
import { attachStreamToVideo } from './utils/attachStreamToVideo';
import { generateSessionId } from './utils/generateSessionId';
import { getMediaStream, type ShareSource } from './utils/getMediaStream';
import { setupWebRtcPeerConnection } from './utils/setupWebRtcSending';
import type { WebRtcSignalingPayload } from '../../../logic/types';
import type { ClientMessage } from '@src/common/types';

export function useSenderTabLogic() {
  const {
    isConnected: isOpen,
    isConnectionAcknowledged,
    isConnecting,
    connect,
    disconnect,
    subscribeMessages,
    send,
    getSocket,
  } = useWebSocket();

  const [sessionId, setSessionId] = useState(generateSessionId);
  const [isSharing, setIsSharing] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageHandlerRef = useRef<{
    handleCreateAnswer: (sdp: RTCSessionDescriptionInit) => Promise<void>;
    handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  } | null>(null);

  const handleGenerateNewSession = () => {
    disconnect();
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
  };

  const isConnected = isOpen || isConnectionAcknowledged;
  const isConnectDisabled = isConnecting || isConnected;
  const isDisconnectDisabled = !isConnected && !isConnecting;
  const isStartSharingDisabled = !isConnected || isSharing;

  const connectSender = () => {
    connect(API_GATEWAY_URL);
  };

  useEffect(() => {
    return subscribeMessages(async (message) => {
      if (message.type === WsConnectionStatus.ConnectionAcknowledged) {
        const webRtcMessage: ClientMessage<WebRtcSignalingPayload> = {
          event: SocketEvents.WebRtc,
          payload: { type: WebRtcSignalTypes.Sender, sessionId },
        };

        send(JSON.stringify(webRtcMessage));
        return;
      }

      if (isTopicMessage(message)) {
        const { data } = message;

        if (data.type === WebRtcSignalTypes.CreateAnswer && data.sdp) {
          await messageHandlerRef.current?.handleCreateAnswer(data.sdp);
        }

        if (data.type === WebRtcSignalTypes.IceCandidate && data.candidate) {
          await messageHandlerRef.current?.handleIceCandidate(data.candidate);
        }
      }
    });
  }, [subscribeMessages, send, sessionId]);

  const disconnectSender = () => {
    disconnect();

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    messageHandlerRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => void track.stop());
    mediaStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;

    setIsSharing(false);
  };

  const startSharing = async (source: ShareSource) => {
    const socket = getSocket();
    const canShare = socket?.readyState === WebSocket.OPEN;

    if (!canShare) return;

    let mediaStream: MediaStream;
    try {
      mediaStream = await getMediaStream(source);
    } catch (err) {
      console.error(err);
      return;
    }

    mediaStreamRef.current = mediaStream;

    attachStreamToVideo(mediaStream, videoRef.current);

    const { peerConnection, handleCreateAnswer, handleIceCandidate } = setupWebRtcPeerConnection({
      send,
      sessionId,
      mediaStream,
    });

    peerConnectionRef.current = peerConnection;
    messageHandlerRef.current = { handleCreateAnswer, handleIceCandidate };

    setIsSharing(true);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    videoRef,
    isSharing,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    isStartSharingDisabled,
    connectSender,
    disconnectSender,
    startSharing,
    sessionId,
    handleGenerateNewSession,
  };
}
