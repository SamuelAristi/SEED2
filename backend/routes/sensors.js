const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get all sensors for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: sensors, error } = await supabase
      .from('sensors')
      .select(`
        *,
        locations(name, location_type)
      `)
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ sensors });
  } catch (error) {
    console.error('Get sensors error:', error);
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
});

// Get sensor data for a specific sensor
router.get('/:id/data', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 100 } = req.query;

    let query = supabase
      .from('sensor_data')
      .select('*')
      .eq('sensor_id', id)
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));

    if (start_date) {
      query = query.gte('timestamp', start_date);
    }
    if (end_date) {
      query = query.lte('timestamp', end_date);
    }

    const { data: sensorData, error } = await query;

    if (error) throw error;

    res.json({ sensorData });
  } catch (error) {
    console.error('Get sensor data error:', error);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

// Add new sensor data
router.post('/:id/data', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { temperature, humidity, ph, light_intensity, soil_moisture } = req.body;

    const { data: sensorData, error } = await supabase
      .from('sensor_data')
      .insert([
        {
          sensor_id: id,
          temperature,
          humidity,
          ph,
          light_intensity,
          soil_moisture,
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      message: 'Sensor data added successfully',
      sensorData 
    });
  } catch (error) {
    console.error('Add sensor data error:', error);
    res.status(500).json({ error: 'Failed to add sensor data' });
  }
});

// Create new sensor
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      name,
      sensor_type,
      location_id,
      status = 'active'
    } = req.body;

    if (!name || !sensor_type || !location_id) {
      return res.status(400).json({ 
        error: 'Name, sensor type and location are required' 
      });
    }

    const { data: sensor, error } = await supabase
      .from('sensors')
      .insert([
        {
          name,
          sensor_type,
          location_id,
          user_id: req.user.userId,
          status,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ 
      message: 'Sensor created successfully',
      sensor 
    });
  } catch (error) {
    console.error('Create sensor error:', error);
    res.status(500).json({ error: 'Failed to create sensor' });
  }
});

// Update sensor
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: sensor, error } = await supabase
      .from('sensors')
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
      message: 'Sensor updated successfully',
      sensor 
    });
  } catch (error) {
    console.error('Update sensor error:', error);
    res.status(500).json({ error: 'Failed to update sensor' });
  }
});

module.exports = router;
