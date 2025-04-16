"use client";

import dynamic from "next/dynamic";

// Mirror the props your EditableProfile now expects:
type EditableProfileClientProps = {
  initialName: string;
  initialEmail: string;
  initialCity: string;
  initialGender: "male" | "female";
  initialProfilePicture?: string;
  /** Optional custom label for the cancel button */
  cancelButtonText?: string;
};

// Tell next/dynamic about the prop type:
const EditableProfile = dynamic<EditableProfileClientProps>(
  () => import("@/components/profile/EditableProfile"),
  { ssr: false }
);

export default function EditableProfileClient(
  props: EditableProfileClientProps
) {
  return <EditableProfile {...props} />;
}
