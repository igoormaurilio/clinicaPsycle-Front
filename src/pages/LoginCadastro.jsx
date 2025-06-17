import React, { useState } from 'react';
import { cadastrarUsuario, loginUsuario } from '../service/AuthApi';
import { useNavigate } from 'react-router-dom';


const styles = {
  container: {
    maxWidth: '460px',
    margin: '60px auto',
    padding: '32px 40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#f9fafa', // fundo claro
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    color: '#00738c', // azul petróleo
    textAlign: 'center',
    marginBottom: '28px',
    fontSize: '28px',
    fontWeight: '600',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '15px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: '#ffffff',
    color: '#333',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  inputFocus: {
    borderColor: '#00738c',
    boxShadow: '0 0 0 3px rgba(0, 115, 140, 0.25)',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '15px',
    backgroundColor: '#ffffff',
    color: '#333',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '14px',
    marginTop: '20px',
    cursor: 'pointer',
    backgroundColor: '#00738c',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(0, 115, 140, 0.35)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#005a66',
    transform: 'scale(1.02)',
  },
  buttonDisabled: {
    width: '100%',
    padding: '14px',
    marginTop: '20px',
    cursor: 'not-allowed',
    backgroundColor: '#ccc',
    color: '#777',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
  },
  toggleButton: {
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: '#00738c',
    padding: '0',
    fontSize: '15px',
    fontWeight: '600',
  },
  toggleButtonHover: {
    color: '#005a66',
  },
  messageContainer: {
    marginTop: '22px',
    padding: '12px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
  },
  messageSuccess: {
    backgroundColor: '#e0f7f9',
    color: '#00738c',
    border: '1px solid #80deea',
  },
  messageError: {
    backgroundColor: '#ffe6e6',
    color: '#b00020',
    border: '1px solid #f44336',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '22px',
    color: '#555',
    fontSize: '14px',
  },
};




function InputField({ label, type, name, value, onChange, required = false, children }) {
  return (
    <div style={styles.field}>
      <label htmlFor={name} style={styles.label}>{label}</label>
      {children ? (
        <select 
          id={name} 
          name={name} 
          value={value} 
          onChange={onChange} 
          style={styles.select}
          required={required}
        >
          {children}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={styles.input}
          autoComplete={name === 'senha' ? 'current-password' : 'off'}
        />
      )}
    </div>
  );
}

export default function LoginCadastro() {
  const navigate = useNavigate();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    email: '',
    senha: '',
    tipoUsuario: 'PACIENTE',
    permissao: 'MEMBER',
  });
  const [formLogin, setFormLogin] = useState({
    email: '',
    senha: '',
  });
  const [mensagem, setMensagem] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (modoCadastro) {
      setFormCadastro((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormLogin((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ text: '', isError: false });
    setLoading(true);

    try {
      if (modoCadastro) {
        await cadastrarUsuario(formCadastro);
        setMensagem({ text: '✅ Cadastro realizado com sucesso! Faça login.', isError: false });
        setModoCadastro(false);
        setFormLogin({ email: formCadastro.email, senha: '' });
        setFormCadastro({
          nome: '',
          email: '',
          senha: '',
          tipoUsuario: 'PACIENTE',
          permissao: 'MEMBER',
        });
      } else {
        const data = await loginUsuario(formLogin);
        if (data.token) {
          localStorage.setItem('token', data.token);
          setMensagem({ text: '✅ Login realizado com sucesso!', isError: false });
          navigate('/dashboard');
        } else {
          setMensagem({ text: '❌ Erro: token não recebido', isError: true });
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido';
      setMensagem({ text: `❌ Erro: ${errorMsg}`, isError: true });
    } finally {
      setLoading(false);
    }
  }

  function alternarModo() {
    setMensagem({ text: '', isError: false });
    setModoCadastro((prev) => !prev);
    setFormCadastro({
      nome: '',
      email: '',
      senha: '',
      tipoUsuario: 'PACIENTE',
      permissao: 'MEMBER',
    });
    setFormLogin({ email: '', senha: '' });
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{modoCadastro ? 'Cadastro de Usuário' : 'ClinicaPsycle'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {modoCadastro && (
          <>
            <InputField
              label="Nome:"
              type="text"
              name="nome"
              value={formCadastro.nome}
              onChange={handleChange}
              required
            />
            <InputField
              label="Tipo de Usuário:"
              name="tipoUsuario"
              value={formCadastro.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="PACIENTE">Paciente</option>
              <option value="MEDICO">Médico</option>
              <option value="RECEPCIONISTA">Recepcionista</option>
            </InputField>
            <InputField
              label="Permissão:"
              name="permissao"
              value={formCadastro.permissao}
              onChange={handleChange}
              required
            >
              <option value="MEMBER">Membro</option>
              <option value="MODERADOR">Moderador</option>
              <option value="ADMIN">Administrador</option>
            </InputField>
          </>
        )}

        <InputField
          label="Email:"
          type="email"
          name="email"
          value={modoCadastro ? formCadastro.email : formLogin.email}
          onChange={handleChange}
          required
        />

        <InputField
          label="Senha:"
          type="password"
          name="senha"
          value={modoCadastro ? formCadastro.senha : formLogin.senha}
          onChange={handleChange}
          required
        />

        <button 
          type="submit" 
          disabled={loading} 
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? 'Aguarde...' : modoCadastro ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <p style={styles.toggleText}>
        {modoCadastro ? 'Já tem conta?' : 'Não tem conta?'}{' '}
        <button
          onClick={alternarModo}
          style={styles.toggleButton}
          type="button"
          aria-label={modoCadastro ? 'Ir para login' : 'Ir para cadastro'}
        >
          {modoCadastro ? 'Faça login' : 'Cadastre-se'}
        </button>
      </p>

      {mensagem.text && (
        <div style={{
          ...styles.messageContainer,
          ...(mensagem.isError ? styles.messageError : styles.messageSuccess)
        }}>
          {mensagem.text}
        </div>
      )}
    </div>
  );
}