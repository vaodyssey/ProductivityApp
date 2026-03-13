import BottomSheetModal from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";

interface UseAppDrawerStateProps {
  ref: React.RefObject<BottomSheetModal | null>;
}

const useAppDrawerState = ({ ref }: UseAppDrawerStateProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (ref.current && !isDrawerOpen) {
      console.log("drawer open");
      ref.current.expand();
    } else if (ref.current && isDrawerOpen) {
      console.log("drawer close");
      ref.current.collapse();
    }
  }, [isDrawerOpen, ref]);

  return { isDrawerOpen, setIsDrawerOpen };
};

export default useAppDrawerState;
