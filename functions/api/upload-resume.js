/**
 * Cloudflare Pages Function — generates a Supabase Storage signed upload URL directly.
 *
 * No Supabase Edge Function needed. This calls the Supabase Storage REST API directly.
 *
 * Set these in Cloudflare Pages Dashboard → Settings → Environment Variables:
 *   NEXT_PUBLIC_SUPABASE_URL      (e.g. https://xxxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY     (from Supabase Project Settings → API → service_role)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY (fallback if service role not set - may fail if RLS blocks anon)
 */

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders(),
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { fileName, fileType } = body;

        if (!fileName || !fileType) {
            return jsonResponse({ error: "Missing fileName or fileType" }, 400);
        }

        const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
        // Prefer service role key (bypasses RLS). Falls back to anon key if not set.
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing env vars");
            return jsonResponse({ error: "Server configuration error" }, 500);
        }

        // Generate unique file path
        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const filePath = `resumes/${timestamp}-${sanitizedFileName}`;

        // Call Supabase Storage REST API to create a signed upload URL
        // Docs: https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl
        const storageResponse = await fetch(
            `${supabaseUrl}/storage/v1/object/upload/sign/resumes/${filePath}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                },
                body: '{}',
            }
        );

        if (!storageResponse.ok) {
            const errorText = await storageResponse.text();
            console.error("Supabase Storage error:", storageResponse.status, errorText);
            return jsonResponse({
                error: "Failed to create upload URL",
                details: errorText,
            }, storageResponse.status);
        }

        const storageData = await storageResponse.json();

        // Supabase returns { url: "https://...supabase.co/storage/v1/object/upload/sign/bucket/path?token=..." }
        const uploadUrl = storageData.url;

        if (!uploadUrl) {
            console.error("No URL in Supabase response:", storageData);
            return jsonResponse({ error: "No upload URL returned from storage" }, 500);
        }

        return jsonResponse({ uploadUrl, filePath });

    } catch (error) {
        console.error("upload-resume error:", error);
        return jsonResponse({ error: "Internal server error", details: error.message }, 500);
    }
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
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders(),
        },
    });
}
