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
      // console.log("Login bem-sucedido:", result);

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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[120px]"></div>

      <div className="flex flex-row w-full max-w-5xl bg-gray-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl">

        {/* Lado Esquerdo: Visual/Intro (Oculto em mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600/20 to-gray-900 p-12 flex-col justify-between relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Tarefex</h2>
            </div>

            <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
              Sua produtividade <br />
              <span className="text-green-400">em outro nível.</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-sm">
              Gerencie suas tarefas com a precisão de um profissional e suba de ranking a cada conclusão.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SYSTEM ONLINE</span>
              <span>v0.1.0</span>
            </div>
          </div>

          {/* Abstract pattern overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="w-full lg:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <span className="text-3xl">📝</span>
            <h1 className="text-3xl font-black text-white">Tarefex</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-400 text-sm">Insira suas credenciais para acessar seu painel.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Email Corporativo
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all hover:bg-white/10"
                  placeholder="Seu email principal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Senha Segura
                </label>
                <a href="#" className="text-[10px] text-green-500 hover:text-green-400 uppercase font-bold tracking-tighter">Esqueceu a senha?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all hover:bg-white/10"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all transform active:scale-[0.98] mt-4"
            >
              ENTRAR NO SISTEMA
            </button>

            <p className="text-center text-sm text-gray-500">
              Não possui acesso?
              <button type="button" onClick={onGoRegister} className="text-green-500 hover:text-green-400 font-bold ml-1 transition-colors">
                Criar conta gratuita
              </button>
            </p>
          </form>

          {/* Social Divider */}
          <div className="relative flex py-8 items-center">
            <div className="grow border-t border-white/5"></div>
            <span className="shrink mx-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">Ou continuar com</span>
            <div className="grow border-t border-white/5"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-gray-300 hover:bg-white/10 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              <span className="text-xs font-bold uppercase tracking-tighter">Github</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-gray-300 hover:bg-white/10 transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              <span className="text-xs font-bold uppercase tracking-tighter">Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;