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
  Button
} from '@chakra-ui/react';
import { IAdminTableProps } from '@/types';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';

import { deleteProduct, updateProduct } from '@/actions/clientActions';

export const AdminTable: React.FC<IAdminTableProps> = ({ caption, columns, data, isLoading }) => {
  const [editableData, setEditableData] = useState(data);

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data) {
      setEditableData(data);
    }
  }, [data]);

  const handleInputChange = (productId: number, key: string, value: string) => {
    const updates = { [key]: value };
    dispatch(updateProduct({ productId, updates }));
  };


  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id))
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
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {!isLoading && editableData.length > 0 ? (
            editableData.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((col) => (
                  <Td key={col.key}>
                    {col.key === 'createdAt' || col.key === 'updatedAt' ? (
                      row[col.key] ? new Date(row[col.key]).toLocaleString() : 'N/A'
                    ) : (
                      <Input
                        value={row[col.key]}
                        onChange={(e) => handleInputChange(row.id, col.key, e.target.value)}
                        size="sm"
                      />
                    )}
                  </Td>
                ))}
                <Td>
                  <Button colorScheme="red" size="sm" onClick={() => handleDelete(row.id)}>
                    Delete
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
