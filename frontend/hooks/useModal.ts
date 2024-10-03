import { useState, useCallback } from "react";

type UseModalReturnType = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModal = (): UseModalReturnType => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};
