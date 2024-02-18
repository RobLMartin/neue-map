import { useParams } from "@remix-run/react";
import NavItem from "./nav.item";
import {
  BarChartIcon,
  // UploadIcon,
  FileTextIcon,
  MagnifyingGlassIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";
export default function Sidebar() {
  const { datasetId } = useParams();
  return (
    <div className="h-[calc(100vh-71px)]">
      <div className="flex-grow flex flex-col justify-end items-center">
        <NavItem
          to={`/datasets`}
          icon={<FileTextIcon height={28} width={28} />}
          title="Datasets"
        />
        <NavItem
          to={`/${datasetId}/search`}
          icon={<MagnifyingGlassIcon height={28} width={28} />}
          title="Search"
        />
        <NavItem
          to={`/${datasetId}`}
          icon={<GlobeIcon height={28} width={28} />}
          title="Map"
        />
        <NavItem
          to={`/${datasetId}/charts`}
          icon={<BarChartIcon height={28} width={28} />}
          title="Charts"
        />

        {/* <NavItem
          to="/upload"
          icon={<UploadIcon height={28} width={28} />}
          title="Upload"
        /> */}
      </div>
    </div>
  );
}
