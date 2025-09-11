// src/hooks/useSigningLogic.js

import { useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './api';

export default function useSigningLogic(apiFunction, redirectUrl) {
    const { token } = useParams();
    const navigate = useNavigate();
    const padRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [clientName, setClientName] = useState('');

    // Fetch client name for greeting
    const fetchClientName = useCallback(async () => {
        try {
            const r = await fetch(`${API_URL}hearty-happiness-production.up.railway.app/api/sign/session/${token}`);
            if (r.ok) {
                const { name } = await r.json();
                if (name) setClientName(name);
            }
        } catch {
            /* ignore errors */
        }
    }, [token]);

    // Handle submit
    const submit = useCallback(async () => {
        if (!padRef.current || padRef.current.isEmpty()) {
            setMessage('Please draw your signature.');
            return;
        }

        setBusy(true);
        setMessage('Submitting...');

        try {
            const signature = padRef.current.getTrimmedCanvas().toDataURL('image/png');
            const result = await apiFunction(token, signature);

            // API response logic (multi-doc signing)
            if (result.nextDocToken) {
                setMessage('✅ Document signed. Redirecting to the next one...');
                setTimeout(() => navigate(`/sign/${result.nextDocToken}`), 1000);
            } else if (result.complete) {
                setMessage('✅ All documents signed! Redirecting...');
                setTimeout(() => navigate(redirectUrl), 1000);
            } else {
                // Fallback (single doc case)
                setMessage('✅ Signing complete! The document has been updated.');
                setTimeout(() => navigate(redirectUrl), 1000);
            }
        } catch (e) {
            console.error('Submit error:', e);
            setMessage(`❌ Failed to submit signature: ${e.message}`);
        } finally {
            setBusy(false);
        }
    }, [apiFunction, token, navigate, padRef, redirectUrl]);

    // Clear the signature pad
    const clearPad = useCallback(() => {
        if (padRef.current) {
            padRef.current.clear();
        }
        setMessage('');
    }, []);

    return {
        token,
        padRef,
        busy,
        message,
        clientName,
        submit,
        clearPad,
        fetchClientName,
        setMessage
    };
}
