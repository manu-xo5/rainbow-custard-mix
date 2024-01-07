import Loader from "@/icons/Loader";

export function LoaderScreen() {
  return (
    <div className="absolute inset-0 pointer-events-none grid place-items-center">
      <Loader className="fill-text-primary" />
    </div>
  );
}
