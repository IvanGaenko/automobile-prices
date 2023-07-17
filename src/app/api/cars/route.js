import getCars from "@/lib/getCars";

export async function GET(request) {
  const { search } = new URL(request.url);
  console.log("request.url", search);

  const data = await getCars(search);

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
    status: 200,
    statusText: "OK",
  });
}
