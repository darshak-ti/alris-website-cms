/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Divider,
} from '@mui/material';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { supabase } from '../../utils/supabase';
import JsonEditorModal from '../../components/JsonEditorModal';
import { useNavigate, useLocation } from 'react-router-dom';
import Toastify from '../../components/Toastify/Toastify';

const AddPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: {},
    slug: '',
    synonyms_slug: [],
  });
  const [saving, setSaving] = useState(false);
  const [isContentJsonModalOpen, setIsContentJsonModalOpen] = useState(false);
  const [isSynonymsJsonModalOpen, setIsSynonymsJsonModalOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // Get table name from URL

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContentJsonEdit = () => {
    setIsContentJsonModalOpen(true);
  };

  const handleSynonymsJsonEdit = () => {
    setIsSynonymsJsonModalOpen(true);
  };

  const handleContentJsonSave = (jsonValue) => {
    setFormData((prev) => ({
      ...prev,
      content: jsonValue,
    }));
    setIsContentJsonModalOpen(false);
  };

  const handleSynonymsJsonSave = (jsonValue) => {
    setFormData((prev) => ({
      ...prev,
      synonyms_slug: jsonValue,
    }));
    setIsSynonymsJsonModalOpen(false);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }

      // Insert into Supabase
      const { data, error } = await supabase.from(currentPath).insert([formData]).select();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A page with this slug already exists');
        }
        throw error;
      }

      Toastify.success('Page created successfully!');
      setTimeout(() => {
        navigate(`/${currentPath}`);
      }, 1500);
    } catch (error) {
      Toastify.error(`Failed to create page: ${error.message}`);
      console.error('Submit error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getBreadcrumbItems = () => {
    return [
      {
        title: `{currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}`,
        to: `/${currentPath}`,
      },
      {
        title: `Add New ${currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}`,
      },
    ];
  };

  const contentPreview =
    typeof formData.content === 'object' && formData.content !== null
      ? JSON.stringify(formData.content, null, 2)
      : '{}';

  const synonymsPreview = Array.isArray(formData.synonyms_slug)
    ? JSON.stringify(formData.synonyms_slug, null, 2)
    : '[]';

  return (
    <PageContainer title={`Add New ${currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}`}>
      <Breadcrumb title={`Add New ${currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}`} items={getBreadcrumbItems()} />

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Title Field */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                  >
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter page title"
                    size="small"
                    required
                  />
                </Grid>

                {/* Slug Field */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                  >
                    Slug *
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="Enter page slug"
                    size="small"
                    required
                    helperText="URL-friendly version of the title (auto-generated from title)"
                  />
                </Grid>

                {/* Content JSON Field */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                  >
                    Content (JSON)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
                  >
                    JSON Object - Click to edit
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField
                      value={contentPreview}
                      fullWidth
                      InputProps={{ readOnly: true }}
                      size="small"
                      multiline
                      rows={4}
                      sx={{
                        background: '#f8f9fa',
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '12px',
                        },
                      }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleContentJsonEdit}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      Edit JSON
                    </Button>
                  </Box>
                </Grid>

                {/* Synonyms Slug JSON Field */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                  >
                    Synonyms Slug (JSON)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
                  >
                    JSON Array - Click to edit
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField
                      value={synonymsPreview}
                      fullWidth
                      InputProps={{ readOnly: true }}
                      size="small"
                      multiline
                      rows={4}
                      sx={{
                        background: '#f8f9fa',
                        '& .MuiInputBase-input': {
                          fontFamily: 'monospace',
                          fontSize: '12px',
                        },
                      }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleSynonymsJsonEdit}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      Edit JSON
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<IconArrowLeft />}
                  onClick={() => navigate(`/${currentPath}`)}
                  disabled={saving}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} /> : <IconDeviceFloppy />}
                  disabled={saving}
                >
                  {saving ? 'Creating...' : `Create ${currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}`}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* Content JSON Editor Modal */}
      <JsonEditorModal
        open={isContentJsonModalOpen}
        onClose={() => setIsContentJsonModalOpen(false)}
        onSave={handleContentJsonSave}
        initialValue={formData.content}
        title="Edit Content JSON"
      />

      {/* Synonyms JSON Editor Modal */}
      <JsonEditorModal
        open={isSynonymsJsonModalOpen}
        onClose={() => setIsSynonymsJsonModalOpen(false)}
        onSave={handleSynonymsJsonSave}
        initialValue={formData.synonyms_slug}
        title="Edit Synonyms Slug JSON"
      />
    </PageContainer>
  );
};

export default AddPage; 