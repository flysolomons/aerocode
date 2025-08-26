// Server-side utility functions
import { headers } from 'next/headers';

// Function to get user's country code from IP server-side
export const getUserCountryCodeServer = async (): Promise<string | null> => {
  try {
    const headersList = await headers();
    
    // Try to get IP from various headers (depending on your deployment setup)
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
    
    // Extract IP address (x-forwarded-for can contain multiple IPs)
    let ip = forwardedFor?.split(',')[0].trim() || realIp || cfConnectingIp;
    
    // Skip IP detection for localhost/private IPs during development
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      console.log('Local IP detected, skipping geolocation');
      return null;
    }
    
    console.log('Detected IP:', ip);
    
    const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.warn('GeoJS API responded with status:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('GeoJS response:', data);
    
    return data.country_code || null;
  } catch (error) {
    console.warn('Failed to get user location server-side:', error);
    return null;
  }
};