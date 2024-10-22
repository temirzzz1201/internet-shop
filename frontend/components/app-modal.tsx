import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { IModalProps } from '@/types';

interface AppModalProps extends IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function AppModal({ children, isOpen, onClose, title }: AppModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost"  mr={3}>Добавить в корзину</Button>
          <Button colorScheme="blue" >Удалить</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AppModal;
