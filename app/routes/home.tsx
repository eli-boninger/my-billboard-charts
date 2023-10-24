import { Form, Outlet } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Home() {
  const user = useOptionalUser();

  return (
    <>
      {!user?.spotifyAuthorized && (
        <Form method="post">
          <button type="submit">Authorize spotify</button>
        </Form>
      )}
      <div>My billboard charts</div>
      <Outlet />
    </>
  );
}
