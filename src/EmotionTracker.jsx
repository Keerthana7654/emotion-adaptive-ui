import React from 'react';

const EmotionTracker = ({ emotionHistory }) => {
  const emotionEmojis = {
    happy: '😄', sad: '😢', angry: '😠',
    surprised: '😲', neutral: '😐', fearful: '😨', disgusted: '🤢',
  };

  return (
    <div style={{ padding: '1rem',paddingLeft:'8rem', background: '#1a1a2e', borderRadius: '12px', color: 'white' }}>
      <h3>🎭 Emotion History</h3>
      {emotionHistory.length === 0 ? (
        <p style={{ color: '#aaa' }}>No emotions tracked yet...</p>
      ) : (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {emotionHistory.map((entry, index) => (
            <div key={index} style={{
              background: '#16213e', borderRadius: '8px',
              padding: '6px 12px', fontSize: '0.85rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
            }}>
              <span style={{ fontSize: '1.4rem' }}>{emotionEmojis[entry.emotion] || '🙂'}</span>
              <span style={{ textTransform: 'capitalize' }}>{entry.emotion}</span>
              <span style={{ color: '#888', fontSize: '0.7rem' }}>{entry.time}</span>
               <span style={{ color: '#888', fontSize: '0.7rem' }}>{entry.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionTracker;