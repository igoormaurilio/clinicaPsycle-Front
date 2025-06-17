import React, { useEffect, useState } from 'react';
import { getPatients, createPatient, deletePatient } from '../service/PatientApi';
import '../styles/PatientList.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPatient, setNewPatient] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
  });

  // Estado para o modal customizado
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(null);

  async function fetchPatients() {
    setLoading(true);
    setError('');
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError('Erro ao carregar pacientes: ' + (err.message || 'Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  function handleChange(e) {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  }

  const showAlert = (message) => {
    setModalMessage(message);
    setModalCallback(() => () => setShowModal(false));
    setShowModal(true);
  };

  const showConfirm = (message, onConfirm) => {
    setModalMessage(message);
    setModalCallback(() => {
      return () => {
        onConfirm();
        setShowModal(false);
      };
    });
    setShowModal(true);
  };

  async function handleCreate(e) {
    e.preventDefault();

    if (!newPatient.nome || !newPatient.email || !newPatient.telefone || !newPatient.dataNascimento) {
      showAlert('Por favor, preencha todos os campos obrigatórios para criar o paciente.');
      return;
    }

    try {
      await createPatient(newPatient);
      setNewPatient({ nome: '', email: '', telefone: '', dataNascimento: '' });
      fetchPatients();
      showAlert('Paciente criado com sucesso!');
    } catch (err) {
      setError('Erro ao criar paciente: ' + (err.message || 'Verifique os dados e tente novamente.'));
      showAlert('Erro ao criar paciente.');
    }
  }

  async function handleDelete(id) {
    showConfirm('Deseja realmente deletar este paciente?', async () => {
      try {
        await deletePatient(id);
        fetchPatients();
        showAlert('Paciente deletado com sucesso!');
      } catch (err) {
        setError('Erro ao deletar paciente: ' + (err.message || 'Por favor, tente novamente.'));
        showAlert('Erro ao deletar paciente.');
      }
    });
  }

  function renderTable() {
    if (patients.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan="5" className="no-records-message">
              Nenhum paciente encontrado.
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {patients.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nome}</td>
            <td>{p.email}</td>
            <td>{p.telefone}</td>
            <td>
              <button className="delete-button" onClick={() => handleDelete(p.id)}>Deletar</button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <div className="patient-list-container">
      <h2>Lista de Pacientes</h2>

      <form onSubmit={handleCreate} className="create-patient-form">
        <h3>Cadastrar Novo Paciente</h3>
        <input
          name="nome"
          placeholder="Nome Completo"
          value={newPatient.nome}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={handleChange}
          required
        />
        <input
          name="telefone"
          type="tel"
          placeholder="Telefone (ex: (XX) XXXXX-XXXX)"
          value={newPatient.telefone}
          onChange={handleChange}
          required
        />
        <input
          name="dataNascimento"
          type="date"
          value={newPatient.dataNascimento}
          onChange={handleChange}
          required
        />
        <button type="submit">Adicionar Paciente</button>
      </form>

      <div className="action-buttons">
        <button onClick={fetchPatients} disabled={loading}>
          Atualizar Lista
        </button>
      </div>

      {loading && <p className="loading-message">Carregando pacientes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <table className="patient-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          {renderTable()}
        </table>
      )}

      {/* Modal customizado para alertas/confirmações */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{modalCallback && modalCallback.toString().includes('setShowModal(false)') ? 'Aviso' : 'Confirmação'}</h4>
            <p>{modalMessage}</p>
            <div className="modal-buttons">
              <button onClick={() => {
                if (modalCallback) modalCallback();
                setShowModal(false);
              }}>OK</button>
              {modalCallback && !modalCallback.toString().includes('setShowModal(false)') && (
                <button className="cancel-button" onClick={() => setShowModal(false)}>Cancelar</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}