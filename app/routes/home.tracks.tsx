import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTopTracks } from "~/services/spotifyService";
import { requireUserId } from "~/session.server";
import superjson from "superjson";
import type { TopItemAndRank } from "~/models/topItem.server";
import { TopItemsList } from "~/components/home/TopItemsList";

export const meta: V2_MetaFunction = () => [{ title: "My Billboard Charts" }];

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
