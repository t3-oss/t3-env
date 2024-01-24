"use client";

import { env } from "~/env";

export default function Page() {
    return (
        <>
            <h1>Node.js Runtime</h1>
            <h2>t3-env</h2>
            <pre>{JSON.stringify(env, null, 4)}</pre>

            <h2>process.env</h2>
            <pre>{JSON.stringify(process.env, null, 4)}</pre>
        </>
    );
}
