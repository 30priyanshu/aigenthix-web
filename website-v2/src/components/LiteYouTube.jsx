import React, { useState, useCallback } from 'react';

const PLAY_BTN_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 68,
    height: 48,
    background: 'rgba(0,0,0,0.8)',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
    border: 'none',
    padding: 0,
};

const WRAPPER_STYLE = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    background: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: 'pointer',
};

function extractVideoId(src) {
    if (!src) return null;
    const match = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

const LiteYouTube = ({ src, title = 'Video' }) => {
    const [activated, setActivated] = useState(false);
    const videoId = extractVideoId(src);

    const activate = useCallback(() => setActivated(true), []);

    if (!videoId) return null;

    if (activated) {
        return (
            <div style={WRAPPER_STYLE}>
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                />
            </div>
        );
    }

    return (
        <div style={WRAPPER_STYLE} onClick={activate} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && activate()} aria-label={`Play ${title}`}>
            <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                loading="lazy"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', minHeight: '100%', objectFit: 'cover' }}
            />
            <button style={PLAY_BTN_STYLE} aria-label="Play video">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </button>
        </div>
    );
};

export default LiteYouTube;
