"use client";

export default function EmptyContent({ errorMessage }) {
  return errorMessage ? (
    <div>{errorMessage}</div>
  ) : (
    <div>No data on such criterias.</div>
  );
}
