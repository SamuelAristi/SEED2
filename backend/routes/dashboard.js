const express = require('express');
const supabase = require('../config/supabase');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get dashboard overview data
router.get('/overview', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total crops count
    const { count: totalCrops } = await supabase
      .from('crops')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get active crops count
    const { count: activeCrops } = await supabase
      .from('crops')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    // Get total sensors count
    const { count: totalSensors } = await supabase
      .from('sensors')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get recent sensor data (last 24 hours) - filtered by user's sensors
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentSensorData } = await supabase
      .from('sensor_data')
      .select(`
        *,
        sensors!inner(user_id)
      `)
      .eq('sensors.user_id', userId)
      .gte('timestamp', yesterday.toISOString())
      .order('timestamp', { ascending: false })
      .limit(50);

    // Calculate average metrics
    const metrics = {
      temperature: 0,
      humidity: 0,
      ph: 0,
      light_intensity: 0,
      soil_moisture: 0
    };

    if (recentSensorData && recentSensorData.length > 0) {
      const totals = recentSensorData.reduce((acc, data) => {
        acc.temperature += data.temperature || 0;
        acc.humidity += data.humidity || 0;
        acc.ph += data.ph || 0;
        acc.light_intensity += data.light_intensity || 0;
        acc.soil_moisture += data.soil_moisture || 0;
        return acc;
      }, { temperature: 0, humidity: 0, ph: 0, light_intensity: 0, soil_moisture: 0 });

      const count = recentSensorData.length;
      metrics.temperature = Math.round((totals.temperature / count) * 10) / 10;
      metrics.humidity = Math.round((totals.humidity / count) * 10) / 10;
      metrics.ph = Math.round((totals.ph / count) * 10) / 10;
      metrics.light_intensity = Math.round((totals.light_intensity / count) * 10) / 10;
      metrics.soil_moisture = Math.round((totals.soil_moisture / count) * 10) / 10;
    }

    // Get crops by status
    const { data: cropsByStatus } = await supabase
      .from('crops')
      .select('status')
      .eq('user_id', userId);

    const statusCounts = cropsByStatus?.reduce((acc, crop) => {
      acc[crop.status] = (acc[crop.status] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      overview: {
        totalCrops: totalCrops || 0,
        activeCrops: activeCrops || 0,
        totalSensors: totalSensors || 0,
        recentDataPoints: recentSensorData?.length || 0
      },
      metrics,
      cropsByStatus: statusCounts
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get sensor data for charts
router.get('/charts/sensor-data', verifyToken, async (req, res) => {
  try {
    const { days = 7, sensor_id } = req.query;
    const userId = req.user.userId;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let query = supabase
      .from('sensor_data')
      .select(`
        *,
        sensors!inner(name, sensor_type, user_id)
      `)
      .eq('sensors.user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (sensor_id) {
      query = query.eq('sensor_id', sensor_id);
    }

    const { data: sensorData, error } = await query;

    if (error) throw error;

    // Group data by date for charting
    const chartData = {};
    sensorData?.forEach(data => {
      const date = new Date(data.timestamp).toDateString();
      if (!chartData[date]) {
        chartData[date] = {
          date,
          temperature: [],
          humidity: [],
          ph: [],
          light_intensity: [],
          soil_moisture: []
        };
      }
      chartData[date].temperature.push(data.temperature);
      chartData[date].humidity.push(data.humidity);
      chartData[date].ph.push(data.ph);
      chartData[date].light_intensity.push(data.light_intensity);
      chartData[date].soil_moisture.push(data.soil_moisture);
    });

    // Calculate averages for each day
    const processedData = Object.values(chartData).map(dayData => ({
      date: dayData.date,
      temperature: dayData.temperature.length > 0 
        ? Math.round((dayData.temperature.reduce((a, b) => a + b, 0) / dayData.temperature.length) * 10) / 10 
        : 0,
      humidity: dayData.humidity.length > 0 
        ? Math.round((dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length) * 10) / 10 
        : 0,
      ph: dayData.ph.length > 0 
        ? Math.round((dayData.ph.reduce((a, b) => a + b, 0) / dayData.ph.length) * 10) / 10 
        : 0,
      light_intensity: dayData.light_intensity.length > 0 
        ? Math.round((dayData.light_intensity.reduce((a, b) => a + b, 0) / dayData.light_intensity.length) * 10) / 10 
        : 0,
      soil_moisture: dayData.soil_moisture.length > 0 
        ? Math.round((dayData.soil_moisture.reduce((a, b) => a + b, 0) / dayData.soil_moisture.length) * 10) / 10 
        : 0
    }));

    res.json({ chartData: processedData });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Get alerts and notifications
router.get('/alerts', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get recent sensor data to check for alerts - filtered by user's sensors
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentData } = await supabase
      .from('sensor_data')
      .select(`
        *,
        sensors!inner(name, sensor_type, user_id)
      `)
      .eq('sensors.user_id', userId)
      .gte('timestamp', yesterday.toISOString())
      .order('timestamp', { ascending: false });

    const alerts = [];

    // Check for critical values
    recentData?.forEach(data => {
      if (data.temperature && (data.temperature < 15 || data.temperature > 35)) {
        alerts.push({
          type: 'temperature',
          severity: 'high',
          message: `Temperature ${data.temperature}°C is outside optimal range (15-35°C)`,
          sensor: data.sensors?.name,
          timestamp: data.timestamp
        });
      }

      if (data.humidity && (data.humidity < 30 || data.humidity > 80)) {
        alerts.push({
          type: 'humidity',
          severity: 'medium',
          message: `Humidity ${data.humidity}% is outside optimal range (30-80%)`,
          sensor: data.sensors?.name,
          timestamp: data.timestamp
        });
      }

      if (data.ph && (data.ph < 5.5 || data.ph > 7.5)) {
        alerts.push({
          type: 'ph',
          severity: 'high',
          message: `pH ${data.ph} is outside optimal range (5.5-7.5)`,
          sensor: data.sensors?.name,
          timestamp: data.timestamp
        });
      }

      if (data.soil_moisture && data.soil_moisture < 20) {
        alerts.push({
          type: 'soil_moisture',
          severity: 'high',
          message: `Soil moisture ${data.soil_moisture}% is critically low`,
          sensor: data.sensors?.name,
          timestamp: data.timestamp
        });
      }
    });

    res.json({ alerts: alerts.slice(0, 10) }); // Return last 10 alerts
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;
