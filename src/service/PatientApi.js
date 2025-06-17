import axios from 'axios';

const BASE_URL = 'https://psycle-c8dbgyaqhugahxfe.brazilsouth-01.azurewebsites.net';

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}/pacientes`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error.response?.data || error.message);
    throw error;
  }
}

export async function getPacienteById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/pacientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar paciente com id ${id}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function createPatient(patientData) {
  try {
    const response = await axios.post(`${BASE_URL}/pacientes`, patientData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar paciente:', error.response?.data || error.message);
    throw error;
  }
}

export async function deletePatient(id) {
  try {
    await axios.delete(`${BASE_URL}/pacientes/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar paciente com id ${id}:`, error.response?.data || error.message);
    throw error;
  }
}
