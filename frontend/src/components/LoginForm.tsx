"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../assets/logo-mulher-segura.png';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/v1/login/', {
        email,
        "password": senha,
      });

      if (response.status === 200) {
        // Salva o token retornado pela API
        localStorage.setItem('token', response.data);
        // Redireciona para o dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-xl shadow-lg flex flex-col items-center w-full max-w-sm gap-6 border border-blue-200"
      >
        <Image src={logo} alt="Logo Mulher Segura" width={100} height={100} className="mb-2" />
        <h2 className="mb-2 text-2xl font-bold text-blue-700 text-center">Mulher Segura</h2>
        <div className="w-full">
          <label className="block mb-1 text-blue-700 font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 text-blue-700 font-medium">Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold shadow"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

//