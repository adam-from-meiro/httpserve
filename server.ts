Deno.serve(async (req) => {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    if (req.body) {
        const body = await req.json();
        const {events} = body;
        return new Response(JSON.stringify(events), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    return new Response("Cannot find events", { status: 403 });
});
