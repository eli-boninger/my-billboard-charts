import { redirect, type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import crypto from "crypto";
import { getTopTracks } from "~/services/spotifyService";
import { requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";
import superjson from "superjson";
import { TopItemAndRank } from "~/models/topItem.server";
import { TopItemsList } from "~/components/tracks/TopItemsList";

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
  const tracks = await getTopTracks(request, userId);
  return superjson.stringify(tracks);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const tracks = superjson.parse<TopItemAndRank[]>(data);

  return <TopItemsList items={tracks || []} />;
}
