/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ReactPaginationTable from 'src/components/tables/ReactPaginationTable';
import { createColumnHelper } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';
import { capitalizeFirstLetter } from './../../utils/stringUtils';
import { supabase } from '../../utils/supabase';
import { generateColumnConfig } from '../../utils/dataTypeDetector';

const columnHelper = createColumnHelper();

const TableList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\//, '');
  
  // State management
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('');
  const [columnConfig, setColumnConfig] = useState({});
  
  // Delete confirmation modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Reset states when currentPath changes
  useEffect(() => {
    setPageIndex(0);
    setPageSize(10);
    setSearch('');
    setSortBy('id');
    setSortOrder('asc');
    setIsInitialLoad(true);
    setShouldFetch(true);
  }, [currentPath]);

  const BCrumb = [
    {
      title: `${capitalizeFirstLetter(currentPath)} List`,
    },
  ];

  const ignoreData = ['id', 'created_at', 'updated_at'];

  const shouldIgnoreField = (fieldName) => {
    return ignoreData.some((ignoreField) => fieldName === ignoreField || fieldName.startsWith('_'));
  };

  const formatColumnHeader = (key) => {
    const words = key.split('_');
    return words
      .map((word) => {
        return word
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
      })
      .join(' ');
  };

  const renderCellValue = (info, dataType) => {
    const value = info?.getValue();

    const makeReadable = (text) => {
      if (!text) return '';
      return text
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    };

    const formatNestedObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Object.keys(obj).length === 0) return '{}';

      return Object.entries(obj)
        .map(([key, val]) => {
          const readableKey = makeReadable(key);

          if (Array.isArray(val)) {
            if (val.length === 0) return `${readableKey}: No items`;
            const firstItem = val[0];
            if (typeof firstItem !== 'object') {
              return `${readableKey}: ${firstItem}${
                val.length > 1 ? ` and ${val.length - 1} more` : ''
              }`;
            }
            return `${readableKey}: ${val.length} items`;
          } else if (val && typeof val === 'object') {
            if (Object.keys(val).length === 0) return `${readableKey}: {}`;
            const firstLevel = Object.entries(val)[0];
            if (firstLevel) {
              const [firstKey, firstVal] = firstLevel;
              const readableFirstKey = makeReadable(firstKey);
              if (typeof firstVal !== 'object') {
                return `${readableKey}: ${readableFirstKey} - ${firstVal}`;
              }
            }
            return `${readableKey}: View details`;
          }
          return `${readableKey}: ${val}`;
        })
        .join(' | ');
    };

    switch (dataType) {
      case 'boolean':
        return (
          <Chip label={value ? 'Yes' : 'No'} color={value ? 'success' : 'error'} size="small" />
        );
      case 'json':
        if (typeof value === 'object' && value !== null) {
          if (Object.keys(value).length === 0) return '{}';
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatNestedObject(value)}
              </Typography>
              <Chip
                label="See more"
                size="small"
                color="primary"
                onClick={() => handleOpenDialog(value, 'JSON Data')}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          );
        }
        return value || '-';
      case 'array':
        if (!Array.isArray(value) || value.length === 0) return '-';
        {
          const firstItem = value[0];
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {typeof firstItem !== 'object'
                  ? `${firstItem}${value.length > 1 ? ` and ${value.length - 1} more` : ''}`
                  : `${value.length} items`}
              </Typography>
              {value.length > 1 && (
                <Chip
                  label="See more"
                  size="small"
                  color="primary"
                  onClick={() => handleOpenDialog(value, 'Array Data')}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </Box>
          );
        }
      case 'datetime':
        return value ? new Date(value).toLocaleString() : '-';
      case 'decimal':
        return typeof value === 'number' ? value.toFixed(2) : '-';
      default:
        return value || '-';
    }
  };

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return;

    if (isInitialLoad) {
      setPageLoading(true);
    }
    
    try {
      let query = supabase
        .from(currentPath)
        .select('*', { count: 'exact' });

      if (search) {
        const searchColumns = Object.keys(columnConfig).filter(key => 
          columnConfig[key] === 'string' || columnConfig[key] === 'integer'
        );
        
        if (searchColumns.length > 0) {
          const searchFilters = searchColumns.map(column => 
            `${column}.ilike.%${search}%`
          );
          query = query.or(searchFilters.join(','));
        }
      }

      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: result, error, count } = await query;

      if (error) {
        console.error('Supabase error:', error);
        setData([]);
        setTotal(0);
      } else {
        setData(result || []);
        setTotal(count || 0);
        
        if (result && result.length > 0 && Object.keys(columnConfig).length === 0) {
          const config = generateColumnConfig(result);
          setColumnConfig(config);
        }
      }
    } catch (error) {
      setData([]);
      setTotal(0);
      console.error('Failed to fetch data:', error);
    } finally {
      setPageLoading(false);
      setIsInitialLoad(false);
      setShouldFetch(false);
    }
  }, [pageIndex, pageSize, search, sortBy, sortOrder, currentPath, shouldFetch, columnConfig]);

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
    }
  }, [fetchData, shouldFetch]);

  const handleAdd = () => {
    navigate(`/${currentPath}/add`, { 
      state: { 
        data: { column_config: columnConfig },
        mode: 'add'
      } 
    });
  };

  const handleView = (rowData) => {
    const dynamicId = rowData.id || rowData[`${currentPath}Id`];
    navigate(`/${currentPath}/view/${dynamicId}`, {
      state: {
        data: {
          records: rowData,
          column_config: columnConfig,
        },
        mode: 'view'
      },
    });
  };

  const handleEdit = (rowData) => {
    const dynamicId = rowData.id || rowData[`${currentPath}Id`];
    navigate(`/${currentPath}/edit/${dynamicId}`, {
      state: {
        data: {
          records: rowData,
          column_config: columnConfig,
        },
        mode: 'edit'
      },
    });
  };

  const handleDeleteClick = (rowData) => {
    setItemToDelete(rowData);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const dynamicId = itemToDelete.id || itemToDelete[`${currentPath}Id`];
      const { error } = await supabase
        .from(currentPath)
        .delete()
        .eq('id', dynamicId);

      if (error) {
        console.error('Delete error:', error);
        // You can add toast notification here
      } else {
        // Refresh the data
        setShouldFetch(true);
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = React.useMemo(() => {
    const columns = [];

    columns.push(
      columnHelper.accessor('row.index', {
        id: 'srNo',
        header: 'Sr No.',
        enableSorting: false,
        cell: (info) => {
          const rowIndex = info.row.index;
          return pageIndex * pageSize + rowIndex + 1;
        },
      }),
    );

    Object.entries(columnConfig).forEach(([key, dataType]) => {
      if (shouldIgnoreField(key)) return;

      columns.push(
        columnHelper.accessor(key, {
          header: () => formatColumnHeader(key),
          cell: (info) => renderCellValue(info, dataType),
          enableSorting: false,
        }),
      );
    });

    columns.push(
      columnHelper.accessor('id', {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => {
          const rowData = info.row.original;
          return (
            <Stack direction="row" spacing={1}>
              <span title={`View ${capitalizeFirstLetter(currentPath)} Details`}>
                <IconButton
                  color="primary"
                  onClick={() => handleView(rowData)}
                  size="small"
                >
                  <IconEye size={18} />
                </IconButton>
              </span>
              <span title={`Edit ${capitalizeFirstLetter(currentPath)}`}>
                <IconButton
                  color="secondary"
                  onClick={() => handleEdit(rowData)}
                  size="small"
                >
                  <IconEdit size={18} />
                </IconButton>
              </span>
              <span title={`Delete ${capitalizeFirstLetter(currentPath)}`}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(rowData)}
                  size="small"
                >
                  <IconTrash size={18} />
                </IconButton>
              </span>
            </Stack>
          );
        },
      }),
    );

    return columns;
  }, [navigate, columnConfig, currentPath, pageIndex, pageSize]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPageIndex(0);
      setShouldFetch(true);
    }, 500),
    [],
  );

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
    setShouldFetch(true);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(0);
    setShouldFetch(true);
  };

  const handleSortChange = (id, order) => {
    setSortBy(id);
    setSortOrder(order);
    setPageIndex(0);
    setShouldFetch(true);
  };

  const handleOpenDialog = (data, title) => {
    setDialogData(data);
    setDialogTitle(title);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogData(null);
    setDialogTitle('');
  };

  const formatDialogData = (data) => {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          {typeof item === 'object' ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(item, null, 2)}</pre>
          ) : (
            item
          )}
        </Box>
      ));
    } else if (typeof data === 'object') {
      return (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
      );
    }
    return data;
  };

  return (
    <PageContainer title={`${capitalizeFirstLetter(currentPath)} List`}>
      <Breadcrumb
        title={`${capitalizeFirstLetter(currentPath)} List`}
        items={BCrumb}
      >
        <Button
          variant="contained"
        //   sx={{ minWidth: 160, float: 'right', background: '#0d4c56', color: '#fff', boxShadow: 'none', '&:hover': { background: '#09353c' } }}
          onClick={() => navigate(`/${currentPath}/add`)}
        >
          Add {capitalizeFirstLetter(currentPath.slice(0, -1))}
        </Button>
      </Breadcrumb>
      <div>
        <ReactPaginationTable
          columns={columns}
          data={data}
          allData={{ records: data, totalElements: total }}
          total={total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onSearchChange={debouncedSearch}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortChange}
          title={`${capitalizeFirstLetter(currentPath)} List`}
          pageSizeOptions={[10, 20, 30, 40, 50]}
          buttonName="no button"
          buttonLink={`/${currentPath}/add`}
          isForm={false}
          form={null}
          isLoading={pageLoading}
        />
      </div>

      {/* JSON/Array Data Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>{dialogData && formatDialogData(dialogData)}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {currentPath}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default TableList;
