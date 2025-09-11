// src/SignClient.js
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { API_URL, postClientSignature } from './api';

export default function SignClient() {
    const { token } = useParams();
    const padRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [signMethod, setSignMethod] = useState('draw'); // draw | text | upload
    const [typedName, setTypedName] = useState('');
    const [message, setMessage] = useState('');
    const [pdfUrl, setPdfUrl] = useState(`${API_URL}/api/sign/preview/${token}`);

    useEffect(() => {
        setPdfUrl(`${API_URL}/api/sign/preview/${token}`);
    }, [token]);

    const handleUploadImage = (e) => {
        const file = e.target.files?.[0];
        if (!file || !padRef.current) return;

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = padRef.current.getCanvas();
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };

    const submit = async () => {
        if (signMethod === 'draw' && (!padRef.current || padRef.current.isEmpty())) {
            return alert('Please draw your signature.');
        }
        if (signMethod === 'text' && !typedName.trim()) {
            return alert('Please type your name.');
        }

        setBusy(true);
        setMessage('Submitting...');

        try {
            let signature;
            if (signMethod === 'draw' || signMethod === 'upload') {
                signature = padRef.current.getCanvas().toDataURL('image/png');
            } else {
                const canvas = padRef.current.getCanvas();
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '48px cursive';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
                signature = canvas.toDataURL('image/png');
            }

            const result = await postClientSignature(token, signature);

            if (result.nextDocToken) {
                // next client doc
                window.location.replace(`/sign/${result.nextDocToken}`);
            } else {
                // client finished → backend emails director links
                alert('✅ All client documents signed!');
                window.location.replace('/');
            }
        } catch (e) {
            console.error('Submit error:', e);
            alert(`❌ Failed to submit signature: ${e.message}`);
        } finally {
            setBusy(false);
        }
    };

    const clearPad = () => {
        padRef.current?.clear();
        setTypedName('');
        setMessage('');
    };

    return (
        <div style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
            <h2>Sign Agreement</h2>

            <iframe
                title="Agreement"
                src={pdfUrl}
                style={{ width: '100%', height: 640, border: '1px solid #ddd', marginBottom: 16 }}
            />

            <div style={{ marginBottom: 16 }}>
                <label><input type="radio" value="draw" checked={signMethod === 'draw'} onChange={() => setSignMethod('draw')} /> Draw</label>
                <label style={{ marginLeft: 10 }}><input type="radio" value="text" checked={signMethod === 'text'} onChange={() => setSignMethod('text')} /> Type Name</label>
                <label style={{ marginLeft: 10 }}><input type="radio" value="upload" checked={signMethod === 'upload'} onChange={() => setSignMethod('upload')} /> Upload Image</label>
            </div>

            {signMethod === 'draw' && (
                <SignatureCanvas ref={padRef} penColor="black" canvasProps={{ width: 680, height: 200, style: { border: '1px dashed #999' } }} />
            )}

            {signMethod === 'text' && (
                <>
                    <input
                        type="text"
                        placeholder="Type your name"
                        value={typedName}
                        onChange={(e) => setTypedName(e.target.value)}
                        style={{ width: '100%', height: 40, fontSize: 20, textAlign: 'center', border: '1px dashed #999' }}
                    />
                    <SignatureCanvas ref={padRef} penColor="black" canvasProps={{ width: 680, height: 200, style: { display: 'none' } }} />
                </>
            )}

            {signMethod === 'upload' && (
                <>
                    <input type="file" accept="image/*" onChange={handleUploadImage} />
                    <SignatureCanvas ref={padRef} penColor="black" canvasProps={{ width: 680, height: 200, style: { border: '1px dashed #999' } }} />
                </>
            )}

            <div style={{ marginTop: 10 }}>
                <button onClick={clearPad}>Clear</button>
                <button onClick={submit} disabled={busy} style={{ marginLeft: 8 }}>
                    {busy ? 'Submitting…' : 'Sign & Continue'}
                </button>
            </div>

            {message && <p style={{ marginTop: 8 }}>{message}</p>}
        </div>
    );
}
