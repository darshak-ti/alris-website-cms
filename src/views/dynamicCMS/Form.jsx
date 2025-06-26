/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IconArrowLeft, IconDeviceFloppy, IconEye, IconEdit, IconEyeOff } from '@tabler/icons';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { supabase } from '../../utils/supabase';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import JsonEditorModal from '../../components/JsonEditorModal';
import Toastify from '../../components/Toastify/Toastify';

const Form = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const currentPath = location.pathname.split('/')[1]; // Get table name from URL
  const mode = location.state?.mode || 'add'; // add, edit, or view
  
  const [formData, setFormData] = useState({});
  const [columnConfig, setColumnConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [currentJsonField, setCurrentJsonField] = useState('');
  const [values, setValues] = useState({});

  // Get data from location state
  const { data } = location.state || {};

  useEffect(() => {
    if (data?.column_config) {
      setColumnConfig(data.column_config);
    }
    
    if (mode === 'edit' || mode === 'view') {
      if (data?.records) {
        setFormData(data.records);
        setValues(data.records);
      } else if (id) {
        fetchRecord();
      }
    }
  }, [data, mode, id]);

  const fetchRecord = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data: record, error } = await supabase
        .from(currentPath)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        Toastify.error('Failed to fetch record');
        console.error('Fetch error:', error);
      } else {
        setFormData(record);
        setValues(record);
        
        // Generate column config if not available
        if (Object.keys(columnConfig).length === 0) {
          const config = {};
          Object.keys(record).forEach(key => {
            if (!key.startsWith('_') && !['id', 'created_at', 'updated_at'].includes(key)) {
              config[key] = detectDataType(record[key]);
            }
          });
          setColumnConfig(config);
        }
      }
    } catch (error) {
      Toastify.error('Failed to fetch record');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectDataType = (value) => {
    if (value === null || value === undefined) return 'string';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'decimal';
    }
    if (typeof value === 'string') {
      if (isValidDate(value)) return 'datetime';
      if (isValidJSON(value)) return 'json';
      return 'string';
    }
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'json';
    return 'string';
  };

  const isValidDate = (str) => {
    const date = new Date(str);
    return date instanceof Date && !isNaN(date) && str.length > 0;
  };

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJsonEdit = (field) => {
    setCurrentJsonField(field);
    setIsJsonModalOpen(true);
  };

  const handleJsonSave = (jsonValue) => {
    setFormData(prev => ({
      ...prev,
      [currentJsonField]: jsonValue
    }));
    setValues(prev => ({
      ...prev,
      [currentJsonField]: jsonValue
    }));
    setIsJsonModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result;
      
      if (mode === 'add') {
        const { data, error } = await supabase
          .from(currentPath)
          .insert([formData])
          .select();

        if (error) throw error;
        result = data;
      } else if (mode === 'edit') {
        const { data, error } = await supabase
          .from(currentPath)
          .update(formData)
          .eq('id', id)
          .select();

        if (error) throw error;
        result = data;
      }

      Toastify.success(`${mode === 'add' ? 'Created' : 'Updated'} successfully!`);
      setTimeout(() => {
        navigate(`/${currentPath}`);
      }, 1500);
    } catch (error) {
      Toastify.error(`Failed to ${mode === 'add' ? 'create' : 'update'}: ${error.message}`);
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (fieldName, dataType) => {
    const value = formData[fieldName] || '';
    const isDisabled = mode === 'view';
    const isJsonOrArray = dataType === 'json' || dataType === 'array';
    const preview =
      dataType === 'json'
        ? (typeof value === 'object' && value !== null ? JSON.stringify(value) : value || '{}')
        : Array.isArray(value)
        ? JSON.stringify(value)
        : value;

    if (isJsonOrArray) {
      return (
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            {capitalizeFirstLetter(fieldName.replace(/_/g, ' '))}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            {dataType === 'json' ? 'JSON Object' : 'Array'} - Click to {isDisabled ? 'view' : 'edit'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              value={preview}
              fullWidth
              InputProps={{ readOnly: true }}
              size="small"
              sx={{ 
                background: '#f8f9fa',
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }
              }}
            />
            <Button
              size="small"
              variant="outlined"
              startIcon={isDisabled ? <IconEye /> : <IconEdit />}
              onClick={() => handleJsonEdit(fieldName)}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              {isDisabled ? 'View' : 'Edit'}
            </Button>
          </Box>
        </Box>
      );
    }

    switch (dataType) {
      case 'boolean':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              {capitalizeFirstLetter(fieldName.replace(/_/g, ' '))}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(value)}
                  onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                  disabled={isDisabled}
                  color="primary"
                />
              }
              label={
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Toggle {fieldName.replace(/_/g, ' ').toLowerCase()}
                </Typography>
              }
            />
          </Box>
        );
      
      case 'datetime':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              {capitalizeFirstLetter(fieldName.replace(/_/g, ' '))}
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={value ? new Date(value).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              disabled={isDisabled}
              InputLabelProps={{ shrink: true }}
              size="small"
              placeholder="Select date and time"
            />
          </Box>
        );
      
      case 'decimal':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              {capitalizeFirstLetter(fieldName.replace(/_/g, ' '))}
            </Typography>
            <TextField
              fullWidth
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => handleInputChange(fieldName, parseFloat(e.target.value) || 0)}
              disabled={isDisabled}
              size="small"
              placeholder="Enter decimal number"
            />
          </Box>
        );
      
      case 'integer':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              {capitalizeFirstLetter(fieldName.replace(/_/g, ' '))}
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={value}
              onChange={(e) => handleInputChange(fieldName, parseInt(e.target.value) || 0)}
              disabled={isDisabled}
              size="small"
              placeholder="Enter whole number"
            />
          </Box>
        );
      
      default:
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              {capitalizeFirstLetter(fieldName.replace(/_/g, ' '))}
            </Typography>
            <TextField
              fullWidth
              value={value}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              disabled={isDisabled}
              multiline={dataType === 'text'}
              rows={dataType === 'text' ? 4 : 1}
              size="small"
              placeholder={`Enter ${fieldName.replace(/_/g, ' ').toLowerCase()}`}
            />
          </Box>
        );
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: capitalizeFirstLetter(currentPath.replace(/_/g, ' ')),
        to: `/${currentPath}`,
      },
    ];

    if (mode === 'add') {
      items.push({ title: 'Add New' });
    } else if (mode === 'edit') {
      items.push({ title: 'Edit' });
    } else if (mode === 'view') {
      items.push({ title: 'View Details' });
    }

    return items;
  };

  if (loading) {
    return (
      <PageContainer title={`${capitalizeFirstLetter(currentPath.replace(/_/g, ' '))} ${mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View'}`}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`${capitalizeFirstLetter(currentPath.replace(/_/g, ' '))} ${mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View'}`}>
      <Breadcrumb
        title={`${capitalizeFirstLetter(currentPath.replace(/_/g, ' '))} ${mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View'}`}
        items={getBreadcrumbItems()}
      />

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {Object.entries(columnConfig).map(([fieldName, dataType]) => {
                  // Skip internal fields
                  if (fieldName.startsWith('_') || ['id', 'created_at', 'updated_at'].includes(fieldName)) {
                    return null;
                  }

                  return (
                    <Grid item xs={12} md={6} key={fieldName}>
                      {renderField(fieldName, dataType)}
                    </Grid>
                  );
                })}
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<IconArrowLeft />}
                  onClick={() => navigate(`/${currentPath}`)}
                >
                  Back
                </Button>
                
                {mode !== 'view' && (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <IconDeviceFloppy />}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : mode === 'add' ? 'Create' : 'Update'}
                  </Button>
                )}
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>

      <JsonEditorModal
        open={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onSave={handleJsonSave}
        initialData={currentJsonField ? values[currentJsonField] : {}}
        title={`${mode === 'view' ? 'View' : 'Edit'} ${
          currentJsonField ? currentJsonField.replace(/_/g, ' ').toUpperCase() : ''
        }`}
        isView={mode === 'view' ? true : false}
      />
    </PageContainer>
  );
};

export default Form;