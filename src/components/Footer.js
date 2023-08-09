import Link from "next/link";

export default function Footer({ data, altData }) {
  return (
    <footer className="w-full flex flex-col justify-center items-center my-3">
      <p>
        Data based on {data.profile} site{" "}
        <Link href={data.src} className="underline">
          {data.name}
        </Link>
        .
      </p>
      <p className="text-sm break-words">
        Also check{" "}
        <Link href={altData.path} className="underline">
          {altData.profile} rankings
        </Link>{" "}
        based on{" "}
        <Link href={altData.src} className="underline">
          {altData.name}
        </Link>
        .
      </p>
    </footer>
  );
}
