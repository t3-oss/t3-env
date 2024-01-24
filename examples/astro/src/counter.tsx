import { env } from "./t3-env";

export function ClientComponent() {
    // Try changing PUBLIC_API_URL to PORT - the component will throw
    return <div>Client API Url:{env.PUBLIC_API_URL}</div>;
}
