import { redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import crypto from "crypto";
import TopTabs from "~/components/home/TopTabs";
import { getTopArtists, getTopSongs } from "~/services/spotifyService";
import { requireUserId } from "~/session.server";
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

export const loader = async ({ request }: { request: Request }) => {
  const userId = await requireUserId(request);
  const songs = await getTopSongs(request, userId);
  const artists = await getTopArtists(request, userId);
  return { songs, artists };
};

export default function Index() {
  const user = useOptionalUser();
  const { songs, artists } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>My billboard charts</h1>
      {!user?.spotifyAuthorized && (
        <Form method="post">
          <button type="submit">Authorize spotify</button>
        </Form>
      )}
      <TopTabs topTracks={songs} topArtists={artists} />
    </>
  );
}
