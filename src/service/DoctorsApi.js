import axios from 'axios';

const BASE_URL = 'https://psycle-c8dbgyaqhugahxfe.brazilsouth-01.azurewebsites.net';

export async function fetchDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}/medicos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar médicos:', error.response?.data || error.message);
    throw error;
  }
}

export async function getMedicoById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/medicos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar médico com id ${id}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function excluirMedico(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/medicos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir médico com id ${id}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function cadastrarMedico(dadosMedico) {
  try {
    const response = await axios.post(`${BASE_URL}/medicos`, dadosMedico);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar médico:', error.response?.data || error.message);
    throw error;
  }
}


