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
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

interface MobileNavProps {
  children: ReactNode;
}

export default function MobileNav({ children }: MobileNavProps) {
  const { isOpen, onOpen, onClose }: UseDisclosureReturn = useDisclosure();

  /* eslint-disable */
  const toggleDrawer = () => {
    isOpen ? onClose() : onOpen();
  };

  return (
    <Box as="nav">
      <Box
        cursor="pointer"
        display={{ base: 'block', md: 'none' }}
        onClick={toggleDrawer}
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
          <Box display="flex" justifyContent="space-between">
            <DrawerHeader
              color="slategray"
              whiteSpace="nowrap"
              borderBottomWidth="1px"
            >
              Electronic Elephant
            </DrawerHeader>
            <CloseIcon className="mr-4 mt-5 cursor-pointer" onClick={onClose} />
          </Box>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
