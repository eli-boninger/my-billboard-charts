import { json, redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import crypto from "crypto";
import { getSession } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "My Billboard Charts" }];

export const action = () => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID || "",
    scope: process.env.SPOTIFY_SCOPES || "",
    redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URL || "",
    state: crypto.randomUUID(),
  });
  return redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
};

export const loader = async ({ request }) => {
  const session = await getSession(request);
  const res = await fetch("https://api.spotify.com/v1/me/top/artists", {
    headers: {
      Authorization: `Bearer ${session.get("spotify")}`,
    },
  });
  const jsonResult = await res.json();
  return json({ topTracks: jsonResult?.items });
};

export default function Home() {
  const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <h1>My billboard charts</h1>
      {!user?.spotifyAuthorized && (
        <Form method="post">
          <button type="submit">Authorize spotify</button>
        </Form>
      )}
      {data.topTracks.map((t) => (
        <p key={t.id}>{t.name}</p>
      ))}
    </>
  );
}
