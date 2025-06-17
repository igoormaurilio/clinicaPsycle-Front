import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConsultas, createConsulta, deleteConsulta } from '../service/ConsultaApi';
import { getPatients } from '../service/PatientApi';
import { fetchDoctors } from '../service/DoctorsApi';
import '../styles/Dashboard.css'; 

export default function Dashboard() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const [idPaciente, setIdPaciente] = useState('');
  const [idMedico, setIdMedico] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [especialidade, setEspecialidade] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      setError('');
      try {
        const consultasResponse = await getConsultas();
        let consultasData = [];
        if (Array.isArray(consultasResponse)) {
          consultasData = consultasResponse;
        } else if (Array.isArray(consultasResponse.content)) {
          consultasData = consultasResponse.content;
        } else if (Array.isArray(consultasResponse.dados)) {
          consultasData = consultasResponse.dados;
        } else {
          consultasData = [];
        }
        setConsultas(consultasData);

        const pacientesList = await getPatients();
        setPacientes(pacientesList || []);

        const medicosList = await fetchDoctors();
        setMedicos(medicosList || []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  async function atualizarConsultas() {
    try {
      const atualizadas = await getConsultas();
      let consultasData = [];
      if (Array.isArray(atualizadas)) {
        consultasData = atualizadas;
      } else if (Array.isArray(atualizadas.content)) {
        consultasData = atualizadas.content;
      } else if (Array.isArray(atualizadas.dados)) {
        consultasData = atualizadas.dados;
      } else {
        consultasData = [];
      }
      setConsultas(consultasData);
    } catch (err) {
      console.error('Erro ao atualizar consultas:', err);
     
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!idPaciente || !idMedico || !dataConsulta) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const novaConsulta = {
        idMedico: Number(idMedico),
        idPaciente: Number(idPaciente),
        dataConsulta,
        especialidade,
      };

      await createConsulta(novaConsulta);
      alert('Consulta agendada com sucesso!');
      await atualizarConsultas();

      // Clear form fields
      setIdPaciente('');
      setIdMedico('');
      setDataConsulta('');
      setEspecialidade('');
    } catch (err) {
      console.error('Erro ao criar consulta:', err);
      alert('Erro ao agendar consulta. Verifique os dados e tente novamente.');
    }
  }

  async function handleDelete(id) {
    if (!id) {
      alert('ID da consulta inválido.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    try {
      await deleteConsulta(id);
      alert('Consulta cancelada com sucesso!');
      await atualizarConsultas();
    } catch (err) {
      console.error('Erro ao excluir consulta:', err);
      alert('Erro ao cancelar consulta. Por favor, tente novamente.');
    }
  }

  if (loading) return <p className="loading-message">Carregando dados...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container"> {/* Aplicando a classe do container principal */}
      <h1>Painel da Clínica</h1>

      <div className="dashboard-buttons"> {/* Aplicando a classe para os botões de navegação */}
        <button onClick={() => navigate('/medicos')}> {/* Removendo style inline */}
          Área de Médicos
        </button>
        <button onClick={() => navigate('/pacientes')}> {/* Removendo style inline */}
          Área de Pacientes
        </button>
      </div>

      <h2>Próximas Consultas</h2>

      <table className="consultas-table"> {/* Aplicando a classe da tabela */}
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Data / Hora</th>
            <th>Especialidade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(consultas) && consultas.length > 0 ? (
            consultas.map((c) => (
              <tr key={c.id || `${c.idPaciente}-${c.idMedico}-${c.dataConsulta}`}>
                <td>{c.nomePaciente || 'N/A'}</td>
                <td>{c.nomeMedico || 'N/A'}</td>
                <td>{new Date(c.dataConsulta).toLocaleString('pt-BR')}</td>
                <td>{c.especialidade || 'Não informada'}</td>
                <td>{c.status || 'Agendada'}</td>
                <td>
                  {c.id ? (
                    <button className="delete-button" onClick={() => handleDelete(c.id)}> {/* Aplicando a classe do botão de exclusão */}
                      Cancelar
                    </button>
                  ) : (
                    <span className="no-id-span">ID ausente</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}> {/* Mantive o style inline aqui para a mensagem "Nenhuma consulta..." */}
                Nenhuma consulta agendada para o momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Agendar Nova Consulta</h2>

      <form onSubmit={handleSubmit} className="form-container"> {/* Aplicando a classe do formulário */}
        <label>
          Paciente:
          <select value={idPaciente} onChange={(e) => setIdPaciente(e.target.value)} required>
            <option value="">Selecione um paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Médico:
          <select value={idMedico} onChange={(e) => setIdMedico(e.target.value)} required>
            <option value="">Selecione um médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} ({m.especialidade || 'Geral'})
              </option>
            ))}
          </select>
        </label>

        <label>
          Data e Hora:
          <input
            type="datetime-local"
            value={dataConsulta}
            onChange={(e) => setDataConsulta(e.target.value)}
            required
          />
        </label>

        <label>
          Especialidade (opcional):
          <input
            type="text"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            placeholder="Ex: Psicologo"
          />
        </label>

        <button type="submit"> {/* Removendo style inline */}
          Confirmar Agendamento
        </button>
      </form>
    </div>
  );
}