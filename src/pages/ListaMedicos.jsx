import React, { useState, useEffect } from 'react';
import { fetchDoctors, cadastrarMedico, excluirMedico } from '../service/DoctorsApi';
import '../styles/DoctorList.css'; 

export default function ListaDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Campos do formulário
  const [form, setForm] = useState({
    nome: '',
    especialidade: '',
    email: '',
    telefone: '',
    rm: ''
  });

  const carregarDoctors = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cadastrarMedico(form);
      setForm({ nome: '', especialidade: '', email: '', telefone: '', rm: '' }); // Limpa o form
      carregarDoctors(); // Atualiza lista
    } catch (error) {
      console.error('Erro ao cadastrar médico:', error);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este médico?')) {
      try {
        await excluirMedico(id);
        carregarDoctors();
      } catch (error) {
        console.error('Erro ao excluir médico:', error);
      }
    }
  };

  return (
    <div className="doctor-list-container"> {/* Aplica a classe do container principal */}
      <h2>Lista de Médicos</h2> {/* Título principal */}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="create-doctor-form"> {/* Aplica a classe do formulário */}
        <h3>Cadastrar Médico</h3> {/* Título do formulário */}
        <input name="nome" type="text" placeholder="Nome Completo" value={form.nome} onChange={handleChange} required />
        <input name="especialidade" type="text" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="telefone" type="tel" placeholder="Telefone (ex: (XX) XXXXX-XXXX)" value={form.telefone} onChange={handleChange} required />
        <input name="rm" type="text" placeholder="Registro Médico (RM)" value={form.rm} onChange={handleChange} required />
        <button type="submit">Cadastrar Médico</button> {/* Texto do botão mais descritivo */}
      </form>

      {/* Lista */}
      {loading ? (
        <p className="loading-message">Carregando médicos...</p> /* Aplica classe para mensagem de carregamento */
      ) : (
        <ul className="doctor-list-ul"> {/* Aplica a classe para a lista (UL) */}
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <div> {/* Adiciona uma div para o texto, para que o botão fique separado */}
                <strong>{doctor.nome}</strong> — {doctor.especialidade} — {doctor.email} — {doctor.telefone} — RM: {doctor.rm}
              </div>
              <button onClick={() => handleExcluir(doctor.id)} className="exclude-button"> {/* Aplica a classe para o botão de excluir */}
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}