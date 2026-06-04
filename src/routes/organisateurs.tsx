import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/organisateurs")({
  beforeLoad: () => {
    throw redirect({ to: "/organisateurs/comment-ca-marche" });
  },
});
