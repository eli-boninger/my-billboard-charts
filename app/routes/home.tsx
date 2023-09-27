import { redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "My Billboard Charts" }];

export const action = () => {
  const scope = "user-read-private user-read-email";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    scope: scope,
    redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URL || "",
    state: "lkasjdf",
  });
  return redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
};

export default function Home() {
  const user = useOptionalUser();
  return (
    <>
      <h1>My billboard charts</h1>
      {!user?.spotifyAuthorized && (
        <Form method="post">
          <button type="submit">Authorize spotify</button>
        </Form>
      )}
    </>
  );
}
