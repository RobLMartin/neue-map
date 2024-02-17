import DropZone from "~/components/drop.zone";
export default function AppIndex() {
  return (
    <div className="w-full h-full grid place-content-center">
      <div>Please select or upload a dataset</div>
      <DropZone />
    </div>
  );
}
