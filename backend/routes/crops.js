const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get all crop varieties (only coffee)
router.get('/varieties', verifyToken, async (req, res) => {
  try {
    const { data: varieties, error } = await supabase
      .from('crop_varieties')
      .select('*')
      .or('variety_type.ilike.%café%,variety_type.ilike.%coffee%,name.ilike.%café%,name.ilike.%coffee%')
      .order('name');

    if (error) throw error;

    res.json({ varieties });
  } catch (error) {
    console.error('Get varieties error:', error);
    res.status(500).json({ error: 'Failed to fetch varieties' });
  }
});

// Get all locations for a user
router.get('/locations', verifyToken, async (req, res) => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('name');

    if (error) throw error;

    res.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get all crops for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: crops, error } = await supabase
      .from('crops')
      .select(`
        *,
        crop_varieties(name, variety_type),
        locations(name, location_type)
      `)
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ crops });
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
});

// Get single crop
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { data: crop, error } = await supabase
      .from('crops')
      .select(`
        *,
        crop_varieties(name, variety_type),
        locations(name, location_type),
        sensor_data(*)
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.userId)
      .single();

    if (error) throw error;

    res.json({ crop });
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({ error: 'Failed to fetch crop' });
  }
});

// Create new crop
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      name,
      variety_id,
      location_id,
      planting_date,
      expected_harvest_date,
      notes
    } = req.body;

    if (!name || !variety_id || !location_id || !planting_date) {
      return res.status(400).json({ 
        error: 'Name, variety, location and planting date are required' 
      });
    }

    const { data: crop, error } = await supabase
      .from('crops')
      .insert([
        {
          name,
          variety_id,
          location_id,
          user_id: req.user.userId,
          planting_date,
          expected_harvest_date,
          notes,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      message: 'Crop created successfully',
      crop 
    });
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ error: 'Failed to create crop' });
  }
});

// Update crop
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: crop, error } = await supabase
      .from('crops')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      message: 'Crop updated successfully',
      crop 
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ error: 'Failed to update crop' });
  }
});

// Create new location
router.post('/locations', verifyToken, async (req, res) => {
  try {
    const {
      name,
      location_type,
      description,
      address
    } = req.body;

    if (!name || !location_type) {
      return res.status(400).json({ 
        error: 'Name and location type are required' 
      });
    }

    const { data: location, error } = await supabase
      .from('locations')
      .insert([
        {
          name,
          location_type,
          description,
          address,
          user_id: req.user.userId,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      message: 'Location created successfully',
      location 
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// Update location
router.put('/locations/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: location, error } = await supabase
      .from('locations')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      message: 'Location updated successfully',
      location 
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Delete crop
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('crops')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) throw error;

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ error: 'Failed to delete crop' });
  }
});

module.exports = router;
