export const fetchHouseholdData = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch('http://127.0.0.1:8000/admin/dashboard/households', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed: ${error.message}`);
        if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, delay));
        else throw error;
      }
    }
  };
  