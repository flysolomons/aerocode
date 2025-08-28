// Recaptcha.tsx
import React, { useEffect, useState } from 'react';

interface RecaptchaProps {
  siteKey: string;
  action: string;
  onToken: (token: string) => void; // Callback to pass token to parent
}

const Recaptcha: React.FC<RecaptchaProps> = ({ siteKey, action, onToken }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, [siteKey]);

  useEffect(() => {
    if (scriptLoaded && (window as any).grecaptcha) {
      (window as any).grecaptcha.ready(() => {
        (window as any).grecaptcha
          .execute(siteKey, { action })
          .then((token: string) => {
            onToken(token); // Pass token to parent
            const recaptchaInput = document.getElementById('g-recaptcha-response') as HTMLInputElement | null;
            if (recaptchaInput) {
              recaptchaInput.value = token;
            } else {
              console.error('reCAPTCHA input element not found');
            }
          })
          .catch((error: any) => {
            console.error('reCAPTCHA error:', error);
          });
      });
    }
  }, [scriptLoaded, siteKey, action, onToken]);

  return (
    <div className="mt-2">
      <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response" />
    </div>
  );
};

export default Recaptcha;