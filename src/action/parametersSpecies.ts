import PocketBase from 'pocketbase';

const pb = new PocketBase("https://api.appsphere.pro");


export async function getGroupsAndSpeciesGrouped() {
  try {
    const records = await pb.collection('parameters').getFullList({
      sort: 'sort_order',
    });

    // Filtrar groups y species
    const groups = records.filter(r => r.type === 'groups');
     console.log(`🌍 Total de groups encontrados: ${groups.length}`);
    const species = records.filter(r => r.type === 'species');
    console.log(`🌍 Total de species encontrados: ${groups.length}`);
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
    console.error("❌ Error:", error.message);
    return [];
  }
}