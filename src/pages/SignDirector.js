// src/SignDirector.js
import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { API_URL, postDirectorSignature } from './api';

export default function SignDirector() {
    const { token } = useParams();
    const navigate = useNavigate();
    const padRef = useRef(null);
    const [busy, setBusy] = useState(false);

    const submit = async () => {
        if (!padRef.current || padRef.current.isEmpty()) {
            return alert('Please draw your signature.');
        }
        setBusy(true);
        try {
            const signature = padRef.current.getCanvas().toDataURL('image/png');
            const res = await postDirectorSignature(token, signature);

            if (res.nextDocToken) {
                window.location.href = `/sign-director/${res.nextDocToken}`;
            } else if (res.complete) {
                alert('All documents signed! Redirecting to home...');
                navigate('/');
            } else {
                alert('Director signature completed!');
            }
        } catch (e) {
            console.error('Submit error:', e);
            alert(`Failed to submit signature: ${e.message}`);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
            <h2>Director Counter-Signature</h2>

            <iframe
                title="Agreement"
                src={`${API_URL}/api/sign/preview/${token}`}
                style={{ width: '100%', height: 640, border: '1px solid #ddd' }}
            />

            <div style={{ marginTop: 16 }}>
                <SignatureCanvas
                    ref={padRef}
                    penColor="black"
                    canvasProps={{ width: 680, height: 200, style: { border: '1px dashed #999' } }}
                />
                <div style={{ marginTop: 10 }}>
                    <button onClick={() => padRef.current.clear()}>Clear</button>
                    <button onClick={submit} disabled={busy} style={{ marginLeft: 8 }}>
                        {busy ? 'Submitting…' : 'Sign & Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
