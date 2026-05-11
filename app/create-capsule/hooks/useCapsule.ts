import { readCapsuleById } from "@/utils/expo/sqlite/capsules-repository";
import { parseNumberFromString } from "@/utils/number";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const useCapsule = (id?: string) => {
  const methods = useFormContext();
  const equipHookFormWithExistingCapsule = async () => {
    const idNumber = parseNumberFromString(id);
    if (!idNumber) return;
    const capsule = await readCapsuleById(idNumber);
    if (!capsule) return;
    methods.reset(capsule);
  };

  useEffect(() => {
    if (!id) return;
    equipHookFormWithExistingCapsule();
  }, [id]);
};
