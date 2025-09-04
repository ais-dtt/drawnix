import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for your drawings table
export interface Drawing {
  id: string;
  task_name: string;
  created_at: string;
  json_data?: any;
}

// Database operations
export const drawingsService = {
  // Get all drawings
  async getDrawings(): Promise<Drawing[]> {
    const { data, error } = await supabase
      .from('drawings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get drawing by ID
  async getDrawing(id: string): Promise<Drawing | null> {
    const { data, error } = await supabase
      .from('drawings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new drawing
  async createDrawing(taskName: string, jsonData?: any): Promise<Drawing> {
    // If jsonData is a string, parse it first
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    const { data, error } = await supabase
      .from('drawings')
      .insert([
        {
          task_name: taskName,
          json_data: parsedData
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update drawing
  async updateDrawing(id: string, updates: Partial<Omit<Drawing, 'id' | 'created_at'>>): Promise<Drawing> {
    const { data, error } = await supabase
      .from('drawings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete drawing
  async deleteDrawing(id: string): Promise<void> {
    const { error } = await supabase
      .from('drawings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
