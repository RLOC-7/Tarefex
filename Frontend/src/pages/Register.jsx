import { useState } from "react";

const Register = ({ onGoLogin, showToast }) => {

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    birth: "",
    password: "",
    razaoSocial: "",
  });

  // Atualiza o estado do formulário
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      name: formData.name,
      lastname: formData.lastname,
      email: formData.email,
      birth: formData.birth,
      password: formData.password,
      cadStatus: false,
      razaoSocial: formData.razaoSocial
    };

    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro ao registrar usuário:", errorData);
        showToast(errorData.message || "Erro ao registrar usuário.", "error");
        return;
      }

      const result = await response.json();
      console.log("Usuário registrado com sucesso:", result);
      showToast("Conta criada com sucesso! Faça login.", "success");
      setFormData({
        name: "",
        lastname: "",
        email: "",
        birth: "",
        password: "",
        razaoSocial: "",
      });
      setTimeout(() => onGoLogin(), 1500);

    } catch (error) {
      console.error("Erro de conexão com a API:", error);
      showToast("Erro de conexão com o servidor.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="flex flex-col w-full max-w-md bg-[#191818] p-8 md:p-10 rounded-2xl shadow-xl border border-gray-800">
        {/* Header */}
        <div className="flex flex-row gap-3 pb-4 items-center">
          <img src="/Logo.jpg" alt="Logo" width="50" />
          <h1 className="text-3xl font-bold text-white">Tarefex</h1>
        </div>
        <p className="text-sm font-light text-gray-300 pb-8">
          Crie sua conta para acessar o sistema
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-[#20ff03]"
            >
              Nome
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Seu nome"
                autoComplete="off"
                value={formData.name}
                onChange={handleChange}
                className="pl-12 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20ff03] block w-full p-3"
                required
              />
            </div>
          </div>

          {/* sobrenome */}
          <div>
            <label
              htmlFor="lastname"
              className="block mb-1 text-sm font-medium text-[#20ff03]"
            >
              Sobrenome
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Seu Sobrenome"
                autoComplete="off"
                value={formData.lastname}
                onChange={handleChange}
                className="pl-12 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20ff03] block w-full p-3"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-[#20ff03]"
            >
              Email
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                className="pl-12 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20ff03] block w-full p-3"
                required
              />
            </div>
          </div>

          {/* nascimento */}
          <div>
            <label
              htmlFor="birth"
              className="block mb-1 text-sm font-medium text-[#20ff03]"
            >
              Nascimento
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="date"
                name="birth"
                id="birth"
                placeholder="DD/MM/AAAA"
                autoComplete="off"
                value={formData.birth}
                onChange={handleChange}
                className="pl-12 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20ff03] block w-full p-3"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-[#20ff03]"
            >
              Senha
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-lock"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="pl-12 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20ff03] block w-full p-3"
                required
              />
            </div>
          </div>

          {/* Razao Social */}
          <div>
            <label
              htmlFor="razao_social"
              className="block mb-1 text-sm font-medium text-[#20ff03]"
            >
              Razao Social
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                name="razaoSocial"
                id="razaoSocial"
                placeholder="Razão Social"
                autoComplete="off"
                value={formData.razaoSocial}
                onChange={handleChange}
                className="pl-12 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20ff03] block w-full p-3"
                required
              />
            </div>
          </div>


          {/* Botão de cadastro */}
          <button
            type="submit"
            className="w-full bg-[#22b222] hover:bg-[#1e9e1e] transition-all text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Criar Conta
          </button>
        </form>

        {/* Link para Login */}
        <p className="text-sm font-light text-gray-300 text-center mt-4">
          Já tem uma conta?{" "}
          <button type="button" onClick={onGoLogin}
            className="font-medium text-[#22b222] hover:underline"
          >
            Faça login
          </button>
        </p>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
          <div className="grow border-t border-gray-700"></div>
          <span className="shrink mx-4 font-medium text-gray-400">OU</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="flex flex-row gap-3 justify-center">
          <button className="flex flex-row items-center gap-2 bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-md text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <span className="font-medium">Github</span>
          </button>

          <button className="flex flex-row items-center gap-2 bg-gray-700 hover:bg-gray-600 transition-colors px-4 py-2 rounded-md text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-twitter"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            <span className="font-medium">Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
