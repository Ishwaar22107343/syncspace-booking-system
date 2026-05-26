import { supabase } from "../lib/supabase";

export default async function HomePage() {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  console.log(data);
  console.log(error);

  return (
    <main>
      <h1>SyncSpace</h1>
    </main>
  );
}