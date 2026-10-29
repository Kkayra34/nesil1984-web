import Link from "next/link";
import { cloudinaryReady } from "@/lib/cloudinary";
import { PartForm } from "../part-form";

export default function NewPartPage() {
  return (
    <div className="max-w-4xl">
      <Link href="/admin/parcalar" className="text-xs text-altin-700 hover:underline">
        ← Parçalar
      </Link>
      <h1 className="mt-2 font-display text-4xl text-bordo-800">Yeni parça</h1>
      <PartForm defaults={{}} uploadEnabled={cloudinaryReady()} />
    </div>
  );
}
