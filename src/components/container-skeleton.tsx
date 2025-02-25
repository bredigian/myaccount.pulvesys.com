import { ProductoItemSkeleton } from './skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';

export const ProductosContainerSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead className='text-end'>Opciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 20 }, (_, i) => (
          <ProductoItemSkeleton key={`producto-item-skeleton-${i}`} />
        ))}
      </TableBody>
    </Table>
  );
};
