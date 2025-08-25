import { useCallback, useRef } from "react";

const GA_ENDPOINT = process.env.GA_ENDPOINT;
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;
const SESSION_EXPIRATION_IN_MIN = 30;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

const EVENTS = {
    POPUP_IMPRESSION: 'popup_impression',
    PREFERENCE_PAGE_IMPRESSION: 'preference_page_impression',
    CAMERA_CHANGE: 'camera_change',
    PREFERENCE_CHANGE: 'preference_change',
    VIRTUAL_CAMERA_USAGE: 'virtual_camera_usage',
    ERROR: 'error',
};

export default function useGALogger() {
    const clientId = useRef(null);
    const sessionId = useRef(null);

    const getOrCreateClientId = useCallback(async () => {
        if (clientId.current != null) {
            return clientId.current;
        }

        const result = await chrome.storage.local.get('clientId');
        let clientIdValue = result.clientId;
        if (!clientIdValue) {
            clientIdValue = self.crypto.randomUUID();
            clientId.current = clientIdValue;
            await chrome.storage.local.set({ clientId: clientIdValue });
        }
        return clientIdValue;
    }, []);

    const getOrCreateSessionId = useCallback(async () => {
        if (sessionId.current != null) {
            return sessionId.current;
        }

        let { sessionData } = await chrome.storage.session.get('sessionData');
        const currentTimeInMs = Date.now();
        if (sessionData && sessionData.timestamp) {
            const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
            if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
                sessionData = null;
            } else {
                sessionData.timestamp = currentTimeInMs;
                await chrome.storage.session.set({ sessionData });
            }
        }
        if (!sessionData) {
            sessionData = {
                session_id: currentTimeInMs.toString(),
                timestamp: currentTimeInMs.toString(),
            };
            await chrome.storage.session.set({ sessionData });
        }
        sessionId.current = sessionData.session_id;
        return sessionId.current;
    }, []);



    const logEvent = useCallback(async ({ name, params = {} }) => {
        try {
            console.log('Logging event to GA:', { GA_ENDPOINT, GA_MEASUREMENT_ID, GA_API_SECRET });
            await fetch(
                `${GA_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        client_id: await getOrCreateClientId(),
                        events: [
                            {
                                name,
                                params: {
                                    ...params,
                                    engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                                    session_id: await getOrCreateSessionId(),
                                },
                            },
                        ],
                    }),
                }
            );
        } catch (error) {
            console.error('Error logging event to GA:', error);
        }
    }, [getOrCreateClientId, getOrCreateSessionId]);

    const logPopupImpression = useCallback(() => {
        logEvent({ name: EVENTS.POPUP_IMPRESSION }).then();
    }, [logEvent]);

    const logPreferencePageImpression = useCallback(() => {
        logEvent({ name: EVENTS.PREFERENCE_PAGE_IMPRESSION }).then();
    }, [logEvent]);

    const logCameraChange = useCallback(() => {
        logEvent({ name: EVENTS.CAMERA_CHANGE }).then();
    }, [logEvent]);

    const logPreferenceChange = useCallback(({ preference }) => {
        logEvent({ name: EVENTS.PREFERENCE_CHANGE, params: { preference } }).then();
    }, [logEvent]);

    const logVirtualCameraUsage = useCallback(() => {
        logEvent({ name: EVENTS.VIRTUAL_CAMERA_USAGE }).then();
    }, [logEvent]);

    const logError = useCallback(({ error, source, label }) => {
        logEvent({ name: EVENTS.ERROR, params: { error, source, label } }).then();
    }, [logEvent]);

    return {
        logPopupImpression,
        logPreferencePageImpression,
        logCameraChange,
        logPreferenceChange,
        logVirtualCameraUsage,
        logError,
    };
}
