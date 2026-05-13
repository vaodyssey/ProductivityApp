import { Capsule } from "@/models/Capsule";
import { readCapsuleById } from "@/utils/expo/sqlite/capsules-repository";
import { parseNumberFromString } from "@/utils/number";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseCapsuleProps {
  methods: UseFormReturn<Capsule, any, Capsule>;
  id?: string;
}
export const useCapsule = ({ methods, id }: UseCapsuleProps) => {
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
