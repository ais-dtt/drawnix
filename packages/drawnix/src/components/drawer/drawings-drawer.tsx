import React, { useState, useEffect } from 'react';
import { PlaitBoard, PlaitElement, Viewport, PlaitTheme, ThemeColorMode, BoardTransforms } from '@plait/core';
import { drawingsService, Drawing } from '../../lib/supabase';
import { serializeAsJSON, parseJSON } from '../../data/json';
import './drawings-drawer.scss';

// Icons for the drawer
const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.854 4.854a.5.5 0 0 0-.708-.708L8 8.293 3.854 4.146a.5.5 0 1 0-.708.708L7.293 9l-4.147 4.146a.5.5 0 0 0 .708.708L8 9.707l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 9l4.147-4.146z"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L10.5 8.207l-3-3L12.146.146zM11.207 9.5L7 13.707V10.5a.5.5 0 0 0-.5-.5H3.207L11.207 9.5zM2 3.5A1.5 1.5 0 0 1 3.5 2h5.793L8 3.293 2.707 8.586A1 1 0 0 0 2.5 9.293V12.5A.5.5 0 0 0 3 13h3.207a1 1 0 0 0 .707-.293L13.5 6.121V3.5A1.5 1.5 0 0 0 12 2H6.207L2 6.207V3.5z"/>
  </svg>
);

interface DrawingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  board: PlaitBoard;
}

export const DrawingsDrawer: React.FC<DrawingsDrawerProps> = ({ isOpen, onClose, board }) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load drawings on mount
  useEffect(() => {
    if (isOpen) {
      loadDrawings();
    }
  }, [isOpen]);

  const loadDrawings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await drawingsService.getDrawings();
      setDrawings(data);
    } catch (err) {
      setError('Failed to load drawings');
      console.error('Error loading drawings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createNewDrawing = async () => {
    try {
      setError(null);
      const currentData = serializeAsJSON(board);
      const newDrawing = await drawingsService.createDrawing(
        `Drawing ${new Date().toLocaleString()}`,
        currentData
      );
      setDrawings(prev => [newDrawing, ...prev]);
      setSelectedDrawingId(newDrawing.id);
    } catch (err) {
      setError('Failed to create drawing');
      console.error('Error creating drawing:', err);
    }
  };

  const deleteDrawing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drawing?')) return;
    
    try {
      setError(null);
      await drawingsService.deleteDrawing(id);
      setDrawings(prev => prev.filter(d => d.id !== id));
      if (selectedDrawingId === id) {
        setSelectedDrawingId(null);
      }
    } catch (err) {
      setError('Failed to delete drawing');
      console.error('Error deleting drawing:', err);
    }
  };

  const loadDrawing = async (drawing: Drawing) => {
    try {
      setError(null);
      if (drawing.json_data) {
        const jsonString = typeof drawing.json_data === 'string' 
          ? drawing.json_data 
          : JSON.stringify(drawing.json_data);
        
        const data = await parseJSON(board, jsonString);
        
        // Clear and load the drawing
        board.children = data.elements;
        board.viewport = data.viewport || { zoom: 1 };
        board.theme = { themeColorMode: ThemeColorMode.default };
        
        // Force board update
        BoardTransforms.fitViewport(board);
        setSelectedDrawingId(drawing.id);
      }
    } catch (err) {
      setError('Failed to load drawing');
      console.error('Error loading drawing:', err);
    }
  };

  const saveCurrentDrawing = async () => {
    if (!selectedDrawingId) {
      // Create new drawing if none selected
      await createNewDrawing();
      return;
    }

    try {
      setError(null);
      const currentData = serializeAsJSON(board);
      await drawingsService.updateDrawing(selectedDrawingId, {
        json_data: currentData
      });
      // Refresh the drawing in the list
      await loadDrawings();
    } catch (err) {
      setError('Failed to save drawing');
      console.error('Error saving drawing:', err);
    }
  };

  const startEditing = (drawing: Drawing) => {
    setEditingId(drawing.id);
    setEditingName(drawing.task_name);
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      setError(null);
      await drawingsService.updateDrawing(editingId, {
        task_name: editingName.trim()
      });
      setDrawings(prev => prev.map(d => 
        d.id === editingId ? { ...d, task_name: editingName.trim() } : d
      ));
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      setError('Failed to update drawing name');
      console.error('Error updating drawing name:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawings-drawer-overlay">
      <div className="drawings-drawer">
        {/* Header */}
        <div className="drawings-drawer-header">
          <h2>My Drawings</h2>
          <button className="close-button" onClick={onClose} aria-label="Close drawer">
            <CloseIcon />
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="drawings-drawer-actions">
          <button 
            className="create-button" 
            onClick={createNewDrawing}
            disabled={loading}
          >
            <PlusIcon />
            New Drawing
          </button>
          <button 
            className="save-button" 
            onClick={saveCurrentDrawing}
            disabled={loading}
          >
            <SaveIcon />
            {selectedDrawingId ? 'Update Current' : 'Save Current'}
          </button>
        </div>

        {/* Drawings list */}
        <div className="drawings-list">
          {loading ? (
            <div className="loading">Loading drawings...</div>
          ) : drawings.length === 0 ? (
            <div className="empty-state">
              <p>No drawings yet</p>
              <p>Create your first drawing!</p>
            </div>
          ) : (
            drawings.map((drawing) => (
              <div 
                key={drawing.id} 
                className={`drawing-item ${selectedDrawingId === drawing.id ? 'selected' : ''}`}
              >
                <button 
                  className="delete-button" 
                  onClick={() => deleteDrawing(drawing.id)}
                  aria-label="Delete drawing"
                >
                  <DeleteIcon />
                </button>
                
                <div className="drawing-content" onClick={() => loadDrawing(drawing)}>
                  {editingId === drawing.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyPress}
                      className="edit-input"
                      autoFocus
                    />
                  ) : (
                    <>
                      <div className="drawing-name">{drawing.task_name}</div>
                      <div className="drawing-date">
                        {new Date(drawing.created_at).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
                
                {editingId !== drawing.id && (
                  <button 
                    className="edit-button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(drawing);
                    }}
                    aria-label="Edit drawing name"
                  >
                    <EditIcon />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
