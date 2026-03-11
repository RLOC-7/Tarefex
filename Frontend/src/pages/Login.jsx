import { useState } from 'react';


const Login = ({ onLogin, onGoRegister, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dados do formulário de login
    const loginData = {
      email: email,       // pegar do estado email
      password: password, // pegar do estado password
    };

    try {
      const response = await fetch("http://192.168.1.4:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro no login:", errorData);
        showToast(errorData.message || "Credenciais inválidas", "error");
        return;
      }

      const result = await response.json();
      console.log("Login bem-sucedido:", result);

      // Armazena token/usuário para manter sessão
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Chama onLogin para atualizar estado no App
      showToast(`Bem-vindo de volta, ${result.user.name}!`, "success");
      onLogin();

    } catch (error) {
      console.error("Erro de conexão com a API:", error);
      showToast("Erro de conexão com o servidor.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#191818] rounded-2xl shadow-xl">
        <div className="flex flex-row gap-3 pb-4">
          <div>
            <img src="/Logo.jpg" alt="Logo" width="50" />
          </div>
          <h1 className="text-3xl font-bold text-white my-auto">Tarefex</h1>
        </div>

        <div className="text-sm font-light text-gray-300 pb-8">
          Faça login para acessar seu gerenciador de tarefas
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="pb-2">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#0df215]">
              Email
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </span>
              <input
                type="email"
                name="email"
                id="email"
                className="pl-12 mb-2 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent block w-full p-2.5 py-3 px-4"
                placeholder="exemple@company.com"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#0df215]">
              Senha
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-lock"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••••"
                className="pl-12 mb-2 bg-gray-800 text-white border border-gray-700 sm:text-sm rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent block w-full p-2.5 py-3 px-4"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-[#22b222] hover:bg-[#1e9e1e] focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6 transition-colors"
          >
            Login
          </button>

          <div className="text-sm font-light text-gray-300">
            Ainda não tem uma conta?
            <button type="button" onClick={onGoRegister} className="font-medium text-[#22b222] hover:underline ml-1">
              Registre-se
            </button>
          </div>
        </form>

        <div className="relative flex py-8 items-center">
          <div className="grow border-t border-gray-700"></div>
          <span className="shrink mx-4 font-medium text-gray-500">OU</span>
          <div className="grow border-t border-gray-700"></div>
        </div>

        <div className="flex flex-row gap-2 justify-center">
          <button className="flex flex-row w-32 gap-2 bg-gray-800 p-2 rounded-md text-gray-200 hover:bg-gray-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
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
            <span className="font-medium mx-auto">Github</span>
          </button>

          <button className="flex flex-row w-32 gap-2 bg-gray-800 p-2 rounded-md text-gray-200 hover:bg-gray-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-twitter"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            <span className="font-medium mx-auto">Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;