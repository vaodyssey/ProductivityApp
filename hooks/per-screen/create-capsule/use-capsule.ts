import { Capsule } from "@/models/capsule";
import CapsuleRepository from "@/repository/capsule-repository";
import { parseNumberFromString } from "@/utils/number";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseCapsuleProps {
  methods: UseFormReturn<Capsule, any, Capsule>;
  id?: string;
}
export const useCapsule = ({ methods, id }: UseCapsuleProps) => {
  const db = useSQLiteContext();
  const capsuleRepository = new CapsuleRepository(db);
  const equipHookFormWithExistingCapsule = async () => {
    const idNumber = parseNumberFromString(id);
    if (!idNumber) return;
    const capsule = await capsuleRepository.getById(idNumber);
    if (!capsule) return;
    methods.reset(capsule);
  };

  useEffect(() => {
    if (!id) return;
    equipHookFormWithExistingCapsule();
  }, [id]);
};
