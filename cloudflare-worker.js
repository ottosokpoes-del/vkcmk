// Cloudflare Worker for Performance Optimization
// This worker handles caching, compression, and optimization

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env);
    }
    
    if (url.pathname.startsWith('/static/') || url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
      return handleStaticRequest(request, env);
    }
    
    if (url.pathname.startsWith('/images/')) {
      return handleImageRequest(request, env);
    }
    
    return handlePageRequest(request, env);
  }
};

async function handleApiRequest(request, env) {
  // Bypass cache for API requests but add security headers
  const response = await fetch(request);
  
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
  
  return newResponse;
}

async function handleStaticRequest(request, env) {
  const url = new URL(request.url);
  
  // Check cache first
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);
  
  if (response) {
    return response;
  }
  
  // Fetch from origin
  response = await fetch(request);
  
  if (response.status === 200) {
    // Clone response for caching
    const responseToCache = response.clone();
    
    // Add cache headers
    const newResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: {
        ...responseToCache.headers,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'Accept-Encoding'
      }
    });
    
    // Cache the response
    ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
    
    return newResponse;
  }
  
  return response;
}

async function handleImageRequest(request, env) {
  const url = new URL(request.url);
  
  // Check if WebP is supported
  const acceptHeader = request.headers.get('Accept') || '';
  const supportsWebP = acceptHeader.includes('image/webp');
  const supportsAVIF = acceptHeader.includes('image/avif');
  
  // Check cache first
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);
  
  if (response) {
    return response;
  }
  
  // Fetch from origin
  response = await fetch(request);
  
  if (response.status === 200) {
    // Clone response for caching
    const responseToCache = response.clone();
    
    // Add optimization headers
    const newResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: {
        ...responseToCache.headers,
        'Cache-Control': 'public, max-age=2592000',
        'Vary': 'Accept-Encoding',
        'X-Content-Type-Options': 'nosniff'
      }
    });
    
    // Cache the response
    ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
    
    return newResponse;
  }
  
  return response;
}

async function handlePageRequest(request, env) {
  const url = new URL(request.url);
  
  // Check cache for HTML pages
  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  let response = await cache.match(cacheKey);
  
  if (response) {
    return response;
  }
  
  // Fetch from origin
  response = await fetch(request);
  
  if (response.status === 200) {
    // Clone response for caching
    const responseToCache = response.clone();
    
    // Add security and performance headers
    const newResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: {
        ...responseToCache.headers,
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
      }
    });
    
    // Cache the response for 1 hour
    ctx.waitUntil(cache.put(cacheKey, newResponse.clone()));
    
    return newResponse;
  }
  
  return response;
}
