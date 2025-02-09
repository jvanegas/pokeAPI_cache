import { fetchPokeApi } from '../utils/request.js';

export const getPokemonByName = async (name) => {
  const resourceUri = `pokemon/${name}`;
  const { statusCode, body, headers } = await fetchPokeApi(resourceUri);
  if (statusCode < 200 || statusCode >= 300)
    throw new Error('Error fetching data');
  return { statusCode, body, headers };
};

export const getAbilityByName = async (name) => {
  const resourceUri = `ability/${name}`;
  const { statusCode, body, headers } = await fetchPokeApi(resourceUri);
  if (statusCode < 200 || statusCode >= 300)
    throw new Error('Error fetching data');
  return { statusCode, body, headers };
};
