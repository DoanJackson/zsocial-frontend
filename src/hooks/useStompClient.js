import { useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { SOCKET_URL } from '@/constants/socketConfig';

// --- Module-Level Singletons ---
let stompClient = null;
let connectionState = 'DISCONNECTED'; // 'CONNECTING', 'CONNECTED', 'DISCONNECTED'

// Track subscriptions across the app so we can automatically re-subscribe on reconnect
// and queue subscriptions requested before connection is established.
const managedSubscriptions = new Map();
let subIdCounter = 0;

export const useStompClient = () => {
    
    /**
     * Initialize connection only once. 
     * Applies heartbeat configurations to prevent mobile connections from dropping silently.
     */
    const connect = useCallback((token) => {
        if (connectionState === 'CONNECTED' || connectionState === 'CONNECTING') {
            console.log('[useStompClient] Already connected or connecting.');
            return;
        }

        connectionState = 'CONNECTING';

        // Fix for testing on mobile devices over LAN:
        // Replace 'localhost' with the actual IP address the mobile device is using to access the app
        let resolvedUrl = SOCKET_URL;
        if (resolvedUrl && resolvedUrl.includes('localhost') && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
            resolvedUrl = resolvedUrl.replace('localhost', window.location.hostname);
            console.log(`[useStompClient] Rewrote localhost to ${window.location.hostname} for mobile LAN access`);
        }

        stompClient = new Client({
            // Use SockJS fallback directly
            webSocketFactory: () => new SockJS(resolvedUrl),
            connectHeaders: { Authorization: `Bearer ${token}` },
            // Mobile-centric connection timeouts and heartbeats
            reconnectDelay: 5000, 
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            
            onConnect: () => {
                console.log('[useStompClient] STOMP Connected.');
                connectionState = 'CONNECTED';
                
                // Process any pending subscriptions (queued while connecting or from a reconnect block)
                managedSubscriptions.forEach((subParams) => {
                    if (!subParams.stompSub) {
                        try {
                            const sub = stompClient.subscribe(subParams.destination, subParams.callback);
                            subParams.stompSub = sub;
                            console.log(`[useStompClient] Applied subscription on connect: ${subParams.destination}`);
                        } catch (err) {
                            console.error(`[useStompClient] Failed to apply subscription to ${subParams.destination}`, err);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('[useStompClient] STOMP Broker Error:', frame.headers['message'], frame.body);
            },
            onWebSocketError: (event) => {
                console.error('[useStompClient] Underlying WebSocket Error:', event);
            },
            onDisconnect: () => {
                console.log('[useStompClient] STOMP Disconnected.');
                connectionState = 'DISCONNECTED';
                // Clear the raw stomp.js subscription objects so they can be re-bound on next connect
                managedSubscriptions.forEach(subParams => {
                    subParams.stompSub = null;
                });
            }
        });

        stompClient.activate();
    }, []);

    /**
     * Terminate the singleton STOMP connection entirely 
     */
    const disconnect = useCallback(() => {
        if (stompClient) {
            stompClient.deactivate();
            stompClient = null;
            connectionState = 'DISCONNECTED';
            managedSubscriptions.clear();
            console.log('[useStompClient] Manually disconnected & cleaned up.');
        }
    }, []);

    /**
     * Robust subscribe method. 
     * Queues the subscription if the client is still connecting.
     * Returns an unsubscribe() function.
     */
    const subscribe = useCallback((destination, callback) => {
        const id = ++subIdCounter;
        const subParams = { destination, callback, stompSub: null };
        managedSubscriptions.set(id, subParams);

        if (connectionState === 'CONNECTED' && stompClient) {
            try {
                const sub = stompClient.subscribe(destination, callback);
                subParams.stompSub = sub;
                console.log(`[useStompClient] Subscribed active immediately: ${destination}`);
            } catch (err) {
                console.warn(`[useStompClient] Active subscribe failed immediately: ${err.message}`);
            }
        } else {
            console.log(`[useStompClient] Queued subscription (stomp not ready): ${destination}`);
        }

        // Return the unsubscribe closure
        return () => {
            const params = managedSubscriptions.get(id);
            if (params && params.stompSub) {
                try {
                    params.stompSub.unsubscribe();
                    console.log(`[useStompClient] Explicitly Unsubscribed: ${destination}`);
                } catch(e) {
                    console.warn(`[useStompClient] Cleanup unsubscribe error: ${e.message}`);
                }
            }
            managedSubscriptions.delete(id);
        };
    }, []);

    const isConnected = useCallback(() => {
        return connectionState === 'CONNECTED';
    }, []);

    return { connect, disconnect, subscribe, isConnected };
};
