'use client';
import { useEffect } from 'react';

const LogVisitor = () => {
  useEffect(() => {
    const logVisit = async () => {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();

      await fetch('/api/log-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          page: window.location.pathname,
        }),
      });
    };

    logVisit();
  }, []);

  return null;
};

export default LogVisitor;
