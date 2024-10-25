'use client';
import { ReactNode } from 'react';
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface MobileNavProps {
  children: ReactNode;
}

export default function MobileNav({ children }: MobileNavProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="nav">
      <Box
        display={{ base: 'block', md: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '25px',
            height: '2px',
            background: 'white',
            marginBottom: '5px',
          }}
        />
        <motion.div
          initial={{ opacity: 1 }}
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '25px',
            height: '2px',
            background: 'white',
            marginBottom: '5px',
          }}
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: '25px', height: '2px', background: 'white' }}
        />
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Electronic Elephant
          </DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
