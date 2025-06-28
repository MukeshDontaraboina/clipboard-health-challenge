const axios = require('axios');

async function fetchTopWorkplaces() {
  try {
    const WORKPLACES_URL = 'http://localhost:3000/workplaces';
    const SHIFTS_URL = 'http://localhost:3000/shifts';

    const workplacesResponse = await axios.get(WORKPLACES_URL);
    const workplacesData = workplacesResponse.data.data;

    const shiftsResponse = await axios.get(SHIFTS_URL);
    const shiftsData = shiftsResponse.data.data;

    const workplaceShiftCounts = {};

    shiftsData.forEach(shift => {
      if (shift.workerId && shift.workplaceId) {
        if (!workplaceShiftCounts[shift.workplaceId]) {
          workplaceShiftCounts[shift.workplaceId] = 0;
        }
        workplaceShiftCounts[shift.workplaceId]++;
      }
    });

    const workplacesWithShifts = workplacesData.map(wp => ({
      name: wp.name,
      shifts: workplaceShiftCounts[wp.id] || 0,
    }));

    workplacesWithShifts.sort((a, b) => b.shifts - a.shifts);

    const topThree = workplacesWithShifts.slice(0, 3);

    console.log(JSON.stringify(topThree, null, 2));
  } catch (error) {
    console.error('Error fetching data:', error.message);
    process.exit(1);
  }
}

fetchTopWorkplaces();
