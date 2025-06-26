/* eslint-disable react/prop-types */
import * as React from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TableHead,
  Box,
  MenuItem,
  Button,
  IconButton,
  Toolbar,
  TextField,
  InputAdornment,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Stack } from '@mui/system';
import DownloadCard from 'src/components/shared/DownloadCard';
import { useLocation, useNavigate } from 'react-router-dom';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconFilter,
} from '@tabler/icons';

const EnhancedTableToolbar = (props) => {
  const { handleSearch, search, buttonName, buttonLink, navigate, allData } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        minHeight: '64px',
      }}
    >
      <Box sx={{ flex: '0 1 auto', mr: 2, maxWidth: '300px' }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size="1.1rem" />
              </InputAdornment>
            ),
          }}
          placeholder="Search"
          size="small"
          onChange={handleSearch}
          value={search}
          fullWidth
        />
      </Box>
      <IconFilter size="1.5rem" />
      {buttonName && buttonName !== 'no button' && (
        <Box sx={{ flex: '1 0 auto' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(buttonLink, { state: { data: allData } })}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {buttonName}
          </Button>
        </Box>
      )}
    </Toolbar>
  );
};

const ReactPaginationTable = ({
  columns,
  data = [],
  allData = [],
  total,
  pageIndex,
  pageSize,
  onPageChange,
  onSearchChange,
  onPageSizeChange,
  onSortChange,
  title,
  pageSizeOptions = [10, 20, 30, 40, 50],
  buttonName,
  buttonLink,
  isForm = false,
  form = null,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, '');
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(null);
  const tableContainerRef = React.useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 });

  const handleSearch = (event) => {
    setSearch(event.target.value);
    onSearchChange(event.target.value);
  };

  React.useEffect(() => {
    setSearch('');
    setSortBy(`${currentPath}Id`);
    setSortOrder('asc');
  }, [currentPath]);

  // Save scroll position before data changes
  React.useEffect(() => {
    const handleScroll = () => {
      if (tableContainerRef.current) {
        setScrollPosition({
          x: tableContainerRef.current.scrollLeft,
          y: tableContainerRef.current.scrollTop
        });
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Reset scroll position when data changes
  React.useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [data, pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        onPageChange(newState.pageIndex);
        onPageSizeChange(newState.pageSize);
      }
    },
  });

  const handleSort = (columnId) => {
    const newOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(columnId);
    setSortOrder(newOrder);
    onSortChange(columnId, newOrder);
  };

  if (!table) {
    return null;
  }

  return (
    <DownloadCard
      title={title}
      Action={
        <EnhancedTableToolbar
          numSelected={1}
          search={search}
          handleSearch={handleSearch}
          buttonName={buttonName}
          buttonLink={buttonLink}
          navigate={navigate}
          allData={allData}
        />
      }
    >
      <Grid>
        <Grid size={12}>
          <div style={{ padding: '0 20px', width: '100%' }}>
            <TableContainer
              ref={tableContainerRef}
              sx={{
                maxHeight: '350px',
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                width: '100%',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}
              className="table-container"
            >
              <Table
                sx={{
                  whiteSpace: 'nowrap',
                  minWidth: '100%',
                }}
              >
                <TableHead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id} align="center">
                          <Typography
                            variant="h6"
                            mb={1}
                            className={
                              header.column.getCanSort() && header.column.columnDef.enableSorting !== false
                                ? 'cursor-pointer select-none'
                                : ''
                            }
                            onClick={() => {
                              if (header.column.getCanSort() && header.column.columnDef.enableSorting !== false) {
                                handleSort(header.column.id);
                              }
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {(() => {
                              if (sortBy === header.column.id && header.column.columnDef.enableSorting !== false) {
                                return sortOrder === 'asc' ? ' 🔼' : ' 🔽';
                              }
                              return null;
                            })()}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        <Typography variant="body1">No data available</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} align="center">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack gap={1} p={3} alignItems="center" direction="row" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                {isForm && form}
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body1">Page</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {pageIndex + 1} of {Math.ceil(total / pageSize)}
                  </Typography>
                </Stack>

                <CustomSelect
                  value={pageSize}
                  onChange={(e) => {
                    onPageSizeChange(Number(e.target.value));
                  }}
                >
                  {pageSizeOptions.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </CustomSelect>

                <IconButton size="small" onClick={() => onPageChange(0)} disabled={pageIndex === 0}>
                  <IconChevronsLeft />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onPageChange(pageIndex - 1)}
                  disabled={pageIndex === 0}
                >
                  <IconChevronLeft />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onPageChange(pageIndex + 1)}
                  disabled={pageIndex >= Math.ceil(total / pageSize) - 1}
                >
                  <IconChevronRight />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onPageChange(Math.ceil(total / pageSize) - 1)}
                  disabled={pageIndex >= Math.ceil(total / pageSize) - 1}
                >
                  <IconChevronsRight />
                </IconButton>
              </Box>
            </Stack>
          </div>
        </Grid>
      </Grid>
    </DownloadCard>
  );
};

export default ReactPaginationTable;
