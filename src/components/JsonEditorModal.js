/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import CodeIcon from '@mui/icons-material/Code';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';

const JsonEditorModal = ({ open, onClose, onSave, initialData, title, isView }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [mode, setMode] = useState('tree');
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  //   const originalKeys = initialData ? Object.keys(initialData) : [];
  const initializeEditor = () => {
    if (containerRef.current) {
      // Initialize the editor
      const options = {
        mode: mode,
        modes: ['tree', 'code'],
        onChangeJSON: (json) => {
          console.info('JSON changed:', json);
        },
        onModeChange: (newMode) => {
          setMode(newMode);
        },
        navigationBar: true,
        statusBar: true,
        mainMenuBar: isView ? false : true,
        enableSort: false,
        enableTransform: isView ? false : true,
        indentation: 2,
        search: true,

        // onEditable: (node) => {
        //   const isOriginalKey = originalKeys.includes(node.field);
        //   return {
        //     field: !isOriginalKey, // prevent renaming original keys
        //     value: !isView,
        //   };
        // },

        // onCreateMenu: (items, node) => {
        //   return items.filter((item) => {
        //     if (item.text === 'Remove') {
        //       return !originalKeys.includes(node.field); // prevent deleting original keys
        //     }
        //     return true;
        //   });
        // },
        onChange: (json) => {
          // If initialData exists, restore the original keys
          if (initialData) {
            const originalKeys = Object.keys(initialData);
            const currentKeys = Object.keys(json);

            // Check if any keys were modified
            const keysModified =
              originalKeys.some((key) => !currentKeys.includes(key)) ||
              currentKeys.some((key) => !originalKeys.includes(key));

            if (keysModified) {
              // Restore the original data structure
              editorRef.current.set(initialData);
              toast.error('Key names cannot be modified');
              return;
            }
          }
        },
        onEvent: (node, event) => {
          if (
            event.type === 'click' &&
            event.target &&
            event.target.className.includes('jsoneditor-field')
          ) {
            // Get the current JSON data
            const jsonData = editorRef.current.get();
            // Get the value at the node's path
            const value = node.path.reduce((obj, key) => obj[key], jsonData);
            setSelectedNode({ ...node, value });
            setContextMenu({
              mouseX: event.clientX,
              mouseY: event.clientY,
            });
          }
        },
      };

      try {
        // Create new editor instance
        const editor = new JSONEditor(containerRef.current, options);
        editorRef.current = editor;

        // Set initial data
        if (initialData) {
          editor.set(initialData);
        }

        // Make editor read-only in view mode
        if (isView) {
          editor.setMode('preview');
        } else {
          editor.setMode(mode);
        }

        setIsEditorReady(true);
      } catch (error) {
        console.error('Failed to initialize JSON editor:', error);
      }
    }
  };

  useEffect(() => {
    let timeoutId = null;

    if (open) {
      timeoutId = setTimeout(initializeEditor, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsEditorReady(false);
      }
    };
  }, [open, initialData, mode]);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      if (editorRef.current) {
        if (isView) {
          // In view mode, set to view mode first, then change the display mode
          editorRef.current.setMode('view');
          editorRef.current.setMode(newMode);
        } else {
          editorRef.current.setMode(newMode);
        }
      }
    }
  };

  const handleCopy = () => {
    try {
      if (editorRef.current) {
        const jsonData = editorRef.current.get();
        const jsonString = JSON.stringify(jsonData, null, 2);
        navigator.clipboard
          .writeText(jsonString)
          .then(() => {
            toast.success('JSON copied to clipboard!');
          })
          .catch(() => {
            toast.error('Failed to copy JSON');
          });
      }
    } catch (error) {
      console.error('Failed to copy JSON:', error);
      toast.error('Failed to copy JSON');
    }
  };

  const handleCopyNode = () => {
    if (selectedNode) {
      try {
        let copyContent;

        // Get the current JSON data
        const jsonData = editorRef.current.get();
        // Get the value at the node's path
        const value = selectedNode.path.reduce((obj, key) => obj[key], jsonData);

        if (selectedNode.field) {
          // For key-value pairs, copy both key and value
          copyContent = { [selectedNode.field]: value };
        } else {
          // For simple values, copy just the value
          copyContent = value;
        }

        const jsonString = JSON.stringify(copyContent, null, 2);

        navigator.clipboard
          .writeText(jsonString)
          .then(() => {
            toast.success('Node copied to clipboard!');
          })
          .catch(() => {
            toast.error('Failed to copy node');
          });
      } catch (error) {
        console.error('Failed to copy node:', error);
        toast.error('Failed to copy node');
      }
    }
    setContextMenu(null);
  };

  const handleSave = () => {
    try {
      if (editorRef.current) {
        const jsonData = editorRef.current.get();
        onSave(jsonData);
        onClose();
      }
    } catch (error) {
      console.error('Invalid JSON data:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="json-editor-modal"
      aria-describedby="modal-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: '900px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: '1px solid #eee',
          }}
        >
          <Typography variant="h6" component="h2">
            {title || 'Edit JSON Data'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Copy JSON">
              <IconButton
                onClick={handleCopy}
                size="small"
                sx={{
                  color: '#004852',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 72, 82, 0.1)',
                  },
                }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="editor mode"
              size="small"
              disabled={isView}
            >
              <ToggleButton value="tree" aria-label="tree mode">
                <AccountTreeIcon sx={{ mr: 1 }} />
                Tree
              </ToggleButton>
              <ToggleButton value="code" aria-label="code mode">
                <CodeIcon sx={{ mr: 1 }} />
                Code
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            height: 'calc(100% - 120px)',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #ddd',
            borderRadius: '4px',
            '& .jsoneditor': {
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            },
            '& .jsoneditor-menu': {
              backgroundColor: '#004852',
              borderBottom: '1px solid #004852',
              '& button': {
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            },
            '& .jsoneditor-navigation-bar': {
              backgroundColor: '#e3f2fd',
              borderBottom: '1px solid #bbdefb',
            },
            '& .jsoneditor-statusbar': {
              backgroundColor: '#e3f2fd',
              borderTop: '1px solid #bbdefb',
              color: '#004852',
            },
            '& .jsoneditor-tree': {
              height: 'calc(100% - 30px)',
            },
            '& .jsoneditor-field': {
              color: '#004852',
              cursor: 'context-menu',
            },
            '& .jsoneditor-value': {
              color: '#2e7d32',
            },
            '& .jsoneditor-readonly': {
              color: '#757575',
            },
            '& .jsoneditor-separator': {
              color: '#757575',
            },
            '& .jsoneditor-highlight': {
              backgroundColor: '#e3f2fd',
            },
            '& .jsoneditor-selected': {
              backgroundColor: '#bbdefb',
            },
            '& .jsoneditor-field.jsoneditor-highlight': {
              backgroundColor: '#e3f2fd',
            },
            '& .jsoneditor-value.jsoneditor-highlight': {
              backgroundColor: '#e3f2fd',
            },
          }}
        />

        <Menu
          open={contextMenu !== null}
          onClose={() => setContextMenu(null)}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
          }
        >
          <MenuItem onClick={handleCopyNode}>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy Node</ListItemText>
          </MenuItem>
        </Menu>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            pt: 2,
            borderTop: '1px solid #eee',
          }}
        >
          <Button onClick={onClose}>Close</Button>
          {!isView && (
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              disabled={!isEditorReady}
            >
              Save
            </Button>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default JsonEditorModal;
