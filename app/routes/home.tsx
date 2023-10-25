import crypto from "crypto";
import { redirect } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { ResponsiveAppBar } from "~/components/home/AppBar";
import { useOptionalUser } from "~/utils";

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

export default function Home() {
  const user = useOptionalUser();

  return (
    <>
      {!user?.spotifyAuthorized && (
        <Form method="post">
          <button type="submit">Authorize spotify</button>
        </Form>
      )}
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
}
