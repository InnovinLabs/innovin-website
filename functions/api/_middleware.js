/**
 * Cloudflare Pages middleware — runs before every /api/* function.
 * Handles CORS preflight, Turnstile verification, and rate limiting.
 *
 * Env vars needed in Cloudflare Pages Dashboard:
 *   TURNSTILE_SECRET_KEY  — from Cloudflare Dashboard → Turnstile → Site → Secret Key
 */

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function getRateLimitKey(request) {
    return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
}

function isRateLimited(key) {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(key, { windowStart: now, count: 1 });
        return false;
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }
    return false;
}

// Periodic cleanup to prevent memory leaks in long-running workers
function cleanupRateLimitMap() {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
            rateLimitMap.delete(key);
        }
    }
}

async function verifyTurnstileToken(token, secretKey, ip) {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret: secretKey,
            response: token,
            remoteip: ip || "",
        }),
    });
    return response.json();
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
}

// Endpoints that require Turnstile (the final submission endpoints, not upload-resume)
const TURNSTILE_PROTECTED = ["/api/applications", "/api/contact-messages"];

export async function onRequest(context) {
    const { request, env, next } = context;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // Only apply protections to POST requests
    if (request.method !== "POST") {
        return next();
    }

    const url = new URL(request.url);
    const ip = getRateLimitKey(request);

    // Rate limiting on all POST endpoints
    if (isRateLimited(ip)) {
        cleanupRateLimitMap();
        return jsonResponse({ error: "Too many requests. Please try again later." }, 429);
    }

    // Turnstile verification only on protected endpoints
    if (TURNSTILE_PROTECTED.includes(url.pathname)) {
        const turnstileSecret = env.TURNSTILE_SECRET_KEY;

        if (!turnstileSecret) {
            console.error("TURNSTILE_SECRET_KEY not configured");
            return jsonResponse({ error: "Server configuration error" }, 500);
        }

        // Clone the request so the downstream handler can also read the body
        const clonedRequest = request.clone();
        let turnstileToken;

        try {
            const body = await clonedRequest.json();
            turnstileToken = body.turnstileToken;
        } catch {
            return jsonResponse({ error: "Invalid request body" }, 400);
        }

        if (!turnstileToken) {
            return jsonResponse({ error: "CAPTCHA verification required" }, 400);
        }

        const verification = await verifyTurnstileToken(turnstileToken, turnstileSecret, ip);

        if (!verification.success) {
            console.error("Turnstile verification failed:", verification["error-codes"]);
            return jsonResponse({ error: "CAPTCHA verification failed. Please try again." }, 403);
        }
    }

    // Periodic cleanup
    if (Math.random() < 0.05) {
        cleanupRateLimitMap();
    }

    return next();
}
