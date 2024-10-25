import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Input,
  Button,
} from '@chakra-ui/react';
import { IAdminTableProps } from '@/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteProduct, updateProduct } from '@/actions/clientActions';

import React, { useState } from 'react';

const AdminTable: React.FC<IAdminTableProps> = ({
  caption,
  columns,
  data,
  isLoading,
  deleteFlag,
  updateFlag,
}) => {
  const dispatch = useAppDispatch();

  const tableData = Array.isArray(data) ? data : [];

  const [editValues, setEditValues] = useState<{
    [key: number]: { [key: string]: string };
  }>({});

  const handleInputChange = (productId: number, key: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [key]: value,
      },
    }));
  };

  const handleSave = (productId: number) => {
    const updates = editValues[productId] || {};
    dispatch(updateProduct({ productId, updates, updateFlag }));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteProduct({ productId: id, deleteFlag }));
  };

  return (
    <TableContainer>
      <Table variant="striped" size="sm" colorScheme="teal">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            {columns.map((col) => (
              <Th key={col.key}>{col.label}</Th>
            ))}
            <Th>Управление</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isLoading && tableData.length > 0 ? (
            tableData.map((row) => (
              <Tr key={row.id}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {['createdAt', 'updatedAt'].includes(col.key) ? (
                      row[col.key] ? (
                        new Date(row[col.key]).toLocaleString()
                      ) : (
                        'N/A'
                      )
                    ) : (
                      <Input
                        value={
                          editValues[row.id]?.[col.key] || row[col.key] || ''
                        }
                        onChange={(e) =>
                          handleInputChange(row.id, col.key, e.target.value)
                        }
                        size="sm"
                      />
                    )}
                  </Td>
                ))}
                <Td>
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => handleSave(row.id)}
                    mr="3"
                  >
                    Сохранить
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                  >
                    Удалить
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length + 1} textAlign="center">
                No data available
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default AdminTable;
