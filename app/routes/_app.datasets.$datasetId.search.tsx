import DataTable from "../components/data-table";

export default function () {
  return (
    <div className="flex h-[calc(100vh-71px)] w-[calc(100vw-78px)]">
      <div className="w-full overflow-x-auto">
        <DataTable />
      </div>
    </div>
  );
}
