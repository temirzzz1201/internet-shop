import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { AppModalProps } from '@/types';



function AppModal({ children, isOpen, onClose, title }: AppModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AppModal;
