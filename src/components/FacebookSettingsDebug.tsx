import React, { useEffect, useState } from 'react';
import { checkFacebookSettings, isValidPixelId, isValidAccessToken } from '../lib/facebook-settings-check';

interface FacebookSettings {
  fb_pixel_id?: string;
  fb_access_token?: string;
  fb_api_version?: string;
}

const FacebookSettingsDebug: React.FC = () => {
  const [settings, setSettings] = useState<FacebookSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // Use the utility function to check Facebook settings
        const result = await checkFacebookSettings();
        
        if (result.error && !result.settings) {
          throw new Error(result.error);
        }
        
        setSettings(result.settings);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Facebook Settings Debug</h2>
      {loading ? (
        <p>Loading settings...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : settings ? (
        <div>
          <h3>Facebook Settings from Database:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(settings, null, 2)}
          </pre>
          <div>
            <p>
              <strong>Pixel ID:</strong> {settings.fb_pixel_id || 'Not configured'}
              {settings.fb_pixel_id && (
                <span style={{ marginLeft: '10px', color: isValidPixelId(settings.fb_pixel_id) ? 'green' : 'red' }}>
                  {isValidPixelId(settings.fb_pixel_id) ? '✓ Valid format' : '✗ Invalid format'}
                </span>
              )}
            </p>
            <p>
              <strong>Access Token:</strong> 
              {settings.fb_access_token ? (
                <>
                  ✓ Configured
                  <span style={{ marginLeft: '10px', color: isValidAccessToken(settings.fb_access_token) ? 'green' : 'red' }}>
                    {isValidAccessToken(settings.fb_access_token) ? '✓ Valid format' : '✗ Invalid format'}
                  </span>
                </>
              ) : '✗ Not configured'}
            </p>
            <p><strong>API Version:</strong> {settings.fb_api_version || 'Not configured'}</p>
          </div>
        </div>
      ) : (
        <p>No Facebook settings found in the database.</p>
      )}
    </div>
  );
};

export default FacebookSettingsDebug;