import axios from 'axios';

const BASE_URL = 'https://psycle-c8dbgyaqhugahxfe.brazilsouth-01.azurewebsites.net'; // ajuste se necessário

export async function getConsultas() {
  try {
    const response = await axios.get(`${BASE_URL}/consultas`);
    const data = response.data;

    if (Array.isArray(data.dados)) {
      return data.dados;
    } else {
      console.warn('Formato inesperado na resposta:', data);
      return [];
    }
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return [];
  }
}

export async function createConsulta(consulta) {
  try {
    const response = await axios.post(`${BASE_URL}/consultas`, consulta);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Erro ao criar consulta:', error.response.data);
    } else {
      console.error('Erro desconhecido:', error.message);
    }
    throw error;
  }
}

export async function deleteConsulta(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/consultas/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Erro ao deletar consulta:', error.response.data);
    } else {
      console.error('Erro desconhecido ao deletar consulta:', error.message);
    }
    throw error;
  }
}
