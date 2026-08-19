import { redirect } from "next/navigation";

/** No landing page for an internal tool — go straight to the data. */
export default function Home() {
  redirect("/assessments");
}
