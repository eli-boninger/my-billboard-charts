import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addUserSpotifyAuth } from "~/models/user.server";
import {
  addSpotifyTokenToSession,
  getSession,
  requireUserId,
} from "~/session.server";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (state === null) {
    redirect(
      "/#" +
        new URLSearchParams({
          error: "state_mismatch",
        }).toString()
    );
    return {};
  } else {
    const params = new URLSearchParams({
      code: code || "",
      redirect_uri: process.env.SPOTIFY_AUTH_REDIRECT_URL || "s",
      grant_type: "authorization_code",
    });
    const res = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_API_TOKEN}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (res.status === 200) {
      const json = await res.json();
      addUserSpotifyAuth(userId, json?.refresh_token);
      return await addSpotifyTokenToSession(
        request,
        json?.access_token,
        "/home"
      );
    } else {
      return {};
    }
  }
};

export default function Callback() {
  const loaderData = useLoaderData<typeof loader>();
  return <div>Action failed</div>;
}
