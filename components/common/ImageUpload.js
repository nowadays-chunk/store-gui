import React, { useState } from 'react';
import { styled } from '@mui/system';
import api from '../../utils/api';

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
});

const Label = styled('label')({
    fontWeight: 'bold',
    fontSize: '0.875rem'
});

const UploadButton = styled('label')({
    display: 'inline-block',
    padding: '0.5rem 1rem',
    background: '#e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
    ':hover': { background: '#cbd5e1' }
});

const Preview = styled('img')({
    maxWidth: '100px',
    maxHeight: '100px',
    borderRadius: '4px',
    marginTop: '0.5rem',
    objectFit: 'cover'
});

export default function ImageUpload({ label, value, onChange }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            // Note: api.js helper might need adjustment for FormData content-type, 
            // but usually axios/fetch handles it if body is FormData.
            // Our api util usually sets JSON content type, so we might need a workaround or direct fetch.
            // Assuming api wrapper handles requests. If it sets 'Content-Type': 'application/json' globally, it might break.
            // Let's use standard fetch for upload to be safe or assuming the api utility is smart.
            // Let's use the local storage token from api util logic if possible, 
            // but for now let's try direct fetch with token.

            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type, browser sets it with boundary for FormData
                },
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onChange(data.url); // Pass back the URL
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container>
            {label && <Label>{label}</Label>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <UploadButton>
                    {uploading ? 'Uploading...' : 'Choose Image'}
                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                </UploadButton>
                {value && (
                    <div>
                        <Preview src={`http://localhost:5000${value}`} alt="Preview" />
                        <button type="button" onClick={() => onChange('')} style={{ display: 'block', fontSize: '0.7rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>
                )}
            </div>
        </Container>
    );
}
