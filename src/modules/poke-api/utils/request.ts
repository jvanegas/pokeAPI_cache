import { request } from 'undici';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions<T> = {
  method: Method;
  body?: T;
};

type ApiResponse<T> = {
  statusCode: number;
  body: T;
  headers;
};

const POKE_API_URL = 'https://pokeapi.co/api/v2';

export const fetchPokeApi = async <RequestBody, ResponseBody>(
  resourceUir: string,
  options: RequestOptions<RequestBody> = { method: 'GET' },
): Promise<ApiResponse<ResponseBody>> => {
  console.log('Here');
  const { method } = options;
  const requestBody = JSON.stringify(options.body);
  const { statusCode, body, headers } = await request(
    `${POKE_API_URL}/${resourceUir}`,
    { method, body: requestBody },
  );
  const responseBody = await body.json();
  return { statusCode, body: responseBody as ResponseBody, headers };
};
