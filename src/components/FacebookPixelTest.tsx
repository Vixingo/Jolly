import React, { useEffect, useState } from 'react';
import { getFacebookSettings } from '../lib/facebook-tracking';

const FacebookPixelTest: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const fbSettings = await getFacebookSettings();
        setSettings(fbSettings);
        console.log('Facebook settings loaded:', fbSettings);
      } catch (err) {
        console.error('Error loading Facebook settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '5px' }}>
      <h2>Facebook Pixel Test</h2>
      {loading ? (
        <p>Loading Facebook settings...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : settings ? (
        <div>
          <p><strong>Pixel ID:</strong> {settings.pixel_id}</p>
          <p><strong>API Version:</strong> {settings.api_version}</p>
          <p><strong>Access Token:</strong> {settings.access_token ? '✓ Configured' : '✗ Missing'}</p>
        </div>
      ) : (
        <p style={{ color: 'orange' }}>No Facebook settings found in database</p>
      )}
    </div>
  );
};

export default FacebookPixelTest;