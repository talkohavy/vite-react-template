import { useCallback, useEffect, useRef, useState } from 'react';
import { API_GATEWAY_URL } from '@src/common/constants';
import { SocketEvents } from '@src/common/constants/websocket';
import { isServerMessage } from '@src/common/utils/isServerMessage';
import { isTopicMessage } from '@src/common/utils/isTopicMessage';
import { useWebSocket, WsConnectionStatus } from '@src/providers/WebSocketProvider';
import { WebRtcSignalTypes } from '../../../logic/constants';
import { handleCreateOfferIncomingMessage } from './utils/handleCreateOfferIncomingMessage';
import type { WebRtcSignalingPayload } from '../../../logic/types';
import type { ClientMessage } from '@src/common/types';

export function useReceiverTabLogic() {
  const {
    isConnected: isOpen,
    isConnecting,
    isConnectionAcknowledged,
    connect,
    disconnect,
    subscribeMessages,
    send,
    getSocket,
  } = useWebSocket();

  const [sessionId, setSessionId] = useState('');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageHandlerRef = useRef<{ handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void> } | null>(
    null,
  );

  const isConnectDisabled = isConnecting || isOpen || isConnectionAcknowledged || !sessionId.trim();
  const isDisconnectDisabled = !isOpen && !isConnectionAcknowledged && !isConnecting;

  const clearRemoteStreamAndVideo = useCallback(() => {
    const mediaStream = remoteStreamRef.current;

    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => void track.stop());
      remoteStreamRef.current = null;
    }

    setRemoteStream(null);

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.srcObject = null;
      videoElement.load();
    }
  }, []);

  useEffect(() => {
    return subscribeMessages(async (message) => {
      if (isServerMessage(message)) {
        if (message.type === WsConnectionStatus.ConnectionAcknowledged) {
          const message: ClientMessage<WebRtcSignalingPayload> = {
            event: SocketEvents.WebRtc,
            payload: { type: WebRtcSignalTypes.Receiver, sessionId },
          };

          send(JSON.stringify(message));
        }
        return;
      }

      if (isTopicMessage(message)) {
        const { data } = message;

        if (data.type === WebRtcSignalTypes.CreateOffer && data.sdp) {
          peerConnectionRef.current?.close();
          peerConnectionRef.current = null;
          messageHandlerRef.current = null;
          clearRemoteStreamAndVideo();

          const { peerConnection, handleIceCandidate } = handleCreateOfferIncomingMessage({
            send,
            sessionId,
            offerSdp: data.sdp,
            callbacks: {
              onRemoteStream: (stream) => {
                remoteStreamRef.current = stream;
                setRemoteStream(stream);
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                  videoRef.current.play().catch(() => {});
                }
              },
              onStreamCleared: clearRemoteStreamAndVideo,
            },
          });

          peerConnectionRef.current = peerConnection;
          messageHandlerRef.current = { handleIceCandidate };
        }

        if (data.type === WebRtcSignalTypes.IceCandidate && data.candidate) {
          await messageHandlerRef.current?.handleIceCandidate(data.candidate);
        }
      }
    });
  }, [getSocket, subscribeMessages, send, sessionId, clearRemoteStreamAndVideo]);

  const connectReceiver = () => {
    connect(API_GATEWAY_URL, {
      onConnectionClose: () => {
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        messageHandlerRef.current = null;
        clearRemoteStreamAndVideo();
      },
    });
  };

  const disconnectReceiver = () => {
    const socket = getSocket();
    const isClosable = socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING;

    if (isClosable) socket.close();

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    messageHandlerRef.current = null;
    clearRemoteStreamAndVideo();
  };

  const setVideoRef = (videoElement: HTMLVideoElement | null) => {
    videoRef.current = videoElement;

    if (videoElement && remoteStream) {
      videoElement.srcObject = remoteStream;
      videoElement.play().catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const isConnected = isOpen || isConnectionAcknowledged;

  return {
    hasRemoteStream: !!remoteStream,
    remoteStream,
    isConnected,
    isConnecting,
    isConnectDisabled,
    isDisconnectDisabled,
    connectReceiver,
    disconnectReceiver,
    setVideoRef,
    sessionId,
    setSessionId,
  };
}
