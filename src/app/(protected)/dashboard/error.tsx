'use client';

export default function Error({ error }: { error: Error }) {
  return <p className="text-red-500">{error.message}</p>;
}