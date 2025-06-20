import PocketBase from 'pocketbase';

const pb = new PocketBase("https://api.appsphere.pro");

export async function getProvincesAndLocalities() {
  try {
    const result = await pb.collection('parameters').getList(1, 500, {
      skipTotal: true,
      sort: 'sort_order',
      expand: 'parent',
    });
    const records = result.items;

    // Separar países y ciudades
    const countries = records.filter(r => r.type === 'province');
    console.log(`🌍 Total de países encontrados: ${countries.length}`);
    const cities = records.filter(r => r.type === 'locality');
    console.log(`🏙️ Total de ciudades encontradas: ${cities.length}`);
    // Agrupar las ciudades por ID de país
    const citiesByCountry: Record<string, object[]> = {};
    for (const city of cities) {
      const parentId = city.parent;
      if (!parentId) continue;

      if (!citiesByCountry[parentId]) {
        citiesByCountry[parentId] = [];
      }
      citiesByCountry[parentId].push(city);
    }


    return records;
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    return [];
  }

}


export async function getGroupsAndSpecies() {
  try {
    const records = await pb.collection('parameters').getFullList({
      sort: 'sort_order',
    });

    // Filtrar species y groups
    const species = records.filter(r => r.type === 'species').map(item => ({
      value: item.id,
      label: item.value,
    }));

    const groups = records.filter(r => r.type === 'group').map(item => ({
      value: item.id,
      label: item.value,
    }));

    return { species, groups };
  } catch (error) {
    console.error("❌ Error:", error.message);
    return { species: [], groups: [] };
  }
}
