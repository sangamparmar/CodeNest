// Import polyfills first
import '../polyfill';

// Improved dynamic import function for SimplePeer with browser compatibility detection
export async function getSimplePeer(): Promise<any> {
  try {
    // Check for WebRTC support
    const supportsWebRTC = Boolean(
      window.RTCPeerConnection &&
      window.RTCSessionDescription &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
    
    if (!supportsWebRTC) {
      console.warn('WebRTC is not fully supported in this browser');
      return null;
    }
    
    // Safari-specific detection (Safari has special WebRTC quirks)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Dynamic import of SimplePeer
    const SimplePeerModule = await import('simple-peer');
    const SimplePeer = SimplePeerModule.default;
    
    if (isSafari) {
      console.log('Safari detected, applying specific WebRTC optimizations');
      // Safari needs specific config - will be used in createPeer function
    }
    
    return SimplePeer;
  } catch (error) {
    console.error('Error loading SimplePeer:', error);
    return null;
  }
}

// Get optimized ICE server configuration based on browser
export function getOptimizedICEServers() {
  // Base STUN servers that work across browsers
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ];
  
  // Add TURN servers for better NAT traversal
  const turnServers = [
    {
      urls: 'turn:numb.viagenie.ca',
      username: 'webrtc@live.com',
      credential: 'muazkh'
    },
    { 
      urls: 'turn:relay.metered.ca:80',
      username: 'your_username', // These would need to be replaced with actual credentials
      credential: 'your_credential'
    },
    {
      urls: 'turn:relay.metered.ca:443?transport=tcp',
      username: 'your_username',
      credential: 'your_credential'
    }
  ];
  
  return [...iceServers, ...turnServers];
}

// Check connection quality between peers
export function checkConnectionQuality(peer: any) {
  if (!peer || !peer.getStats) return null;
  
  return new Promise((resolve) => {
    try {
      peer.getStats((err: any, stats: any) => {
        if (err) {
          console.error('Error getting WebRTC stats:', err);
          resolve({ quality: 'unknown', data: null });
          return;
        }
        
        const statsData = {
          bytesReceived: 0,
          bytesSent: 0,
          packetsLost: 0,
          roundTripTime: 0,
          quality: 'unknown'
        };
        
        if (stats && stats.length) {
          stats.forEach((report: any) => {
            if (report.type === 'outbound-rtp') {
              statsData.bytesSent = report.bytesSent;
            } else if (report.type === 'inbound-rtp') {
              statsData.bytesReceived = report.bytesReceived;
              statsData.packetsLost = report.packetsLost || 0;
            } else if (report.type === 'candidate-pair' && report.state === 'succeeded') {
              statsData.roundTripTime = report.currentRoundTripTime * 1000; // Convert to ms
            }
          });
          
          // Determine quality based on packet loss and RTT
          if (statsData.packetsLost > 20) {
            statsData.quality = 'poor';
          } else if (statsData.roundTripTime > 300) {
            statsData.quality = 'fair';
          } else {
            statsData.quality = 'good';
          }
        }
        
        resolve(statsData);
      });
    } catch (error) {
      console.error('Error in checkConnectionQuality:', error);
      resolve({ quality: 'unknown', data: null });
    }
  });
}