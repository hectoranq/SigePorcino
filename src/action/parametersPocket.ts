import PocketBase from 'pocketbase';

const pb = new PocketBase("https://api.appsphere.pro");

export async function getProvincesAndLocalities() {
  try {
    const records = await pb.collection('parameters').getFullList({
      sort: 'sort_order',
      expand: 'parent', // Necesario si quieres que `parent` contenga el país completo
    });

    console.log(`📊 Total de registros obtenidos: ${records.length}`);

    // Separar países y ciudades
    const countries = records.filter(r => r.type === 'province');
    console.log(`🌍 Total de países encontrados: ${countries.length}`);
    const cities = records.filter(r => r.type === 'locality');
    console.log(`🏙️ Total de ciudades encontradas: ${cities.length}`);
    // Agrupar las ciudades por ID de país
    const citiesByCountry = {};
    for (const city of cities) {
      const parentId = city.parent;
      if (!parentId) continue;

      if (!citiesByCountry[parentId]) {
        citiesByCountry[parentId] = [];
      }
      citiesByCountry[parentId].push(city);
    }

    // Construir objeto final
    const data = countries.map(country => ({
    country: {
        value: country.id,
        label: country.value
    },
    cities: (citiesByCountry[country.id] || []).map(city => ({
        value: city.id,
        label: city.value
    }))
    }));

    console.log("✅ Resultado:", data);
    return data;
  } catch (error) {
    console.error("Error getProvincesAndLocalities:", error);
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

export async function getGroupsAndSpeciesGrouped() {
  try {
    const records = await pb.collection('parameters').getFullList({
      sort: 'sort_order',
    });

    // Filtrar groups y species
    const groups = records.filter(r => r.type === 'groups');
     console.log(`🌍 Total de groups encontrados: ${groups.length}`);
    const species = records.filter(r => r.type === 'species');
    console.log(`🌍 Total de species encontrados: ${species.length}`);
    // Agrupar species por ID de group (parent)
    const speciesByGroup = {};
    for (const specie of species) {
      const parentId = specie.parent;
      if (!parentId) continue;

      if (!speciesByGroup[parentId]) {
        speciesByGroup[parentId] = [];
      }
      speciesByGroup[parentId].push(specie);
    }

    // Construir objeto final
    const data = groups.map(group => ({
      group: {
        value: group.id,
        label: group.value
      },
      species: (speciesByGroup[group.id] || []).map(specie => ({
        value: specie.id,
        label: specie.value
      }))
    }));

    console.log("✅ Resultado agrupado groups-species:", data);
    return data;
  } catch (error) {
    console.error("Error getGroupsAndSpeciesGrouped:", error);
    return [];
  }
}