import {PhotoIcon} from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="animate-pulse p-5 flex flex-col gap-5">
      <div className="w-full aspect-square border-neutral-700 border-4 rounded-md border-dashed flex justify-center items-center">
        <PhotoIcon className="text-neutral-700 h-28" />
      </div>
      <div className="flex gap-2 items-center">
        <div className="size-14 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-2 *:bg-neutral-700 *:h-5 *:rounded-md">
          <div className="w-40" />
          <div className="w-20" />
        </div>
      </div>
      <div className="bg-neutral-700 w-2/3 h-5 rounded-md" />
    </div>
  );
}