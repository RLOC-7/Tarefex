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
      const response = await fetch("http://192.168.1.4:8080/api/user", {
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

      // const result = await response.json();
      // console.log("Usuário registrado com sucesso:", result);
      // showToast("Conta criada com sucesso! Faça login.", "success");
      // setFormData({
      //   name: "",
      //   lastname: "",
      //   email: "",
      //   birth: "",
      //   password: "",
      //   razaoSocial: "",
      // });
      setTimeout(() => onGoLogin(), 1500);

    } catch (error) {
      console.error("Erro de conexão com a API:", error);
      showToast("Erro de conexão com o servidor.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[120px]"></div>

      <div className="flex flex-row w-full max-w-6xl bg-gray-900/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl">

        {/* Lado Esquerdo: Visual/Intro (Oculto em mobile) */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-green-600/20 to-gray-900 p-12 flex-col justify-between relative border-r border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Tarefex</h2>
            </div>

            <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
              Comece sua jornada <br />
              <span className="text-green-400">de alta performance.</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-sm">
              Crie sua conta em poucos segundos e junte-se a milhares de profissionais que dominam o tempo.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-sm text-gray-300 italic">"O melhor sistema que já usei para organizar meus projetos de engenharia."</p>
              <p className="text-xs text-purple-500 font-bold mt-2">— NU BANK</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-sm text-gray-300 italic">"O melhor simples direto e divertido!"</p>
              <p className="text-xs text-green-500 font-bold mt-2">— PIC PAY</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> SECURE ENCRYPTION</span>
            </div>
          </div>

          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          </div>
        </div>

        {/* Lado Direito: Formulário de Cadastro */}
        <div className="w-full lg:w-7/12 p-8 md:p-14 overflow-y-auto max-h-[90vh]">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <span className="text-3xl">📝</span>
            <h1 className="text-3xl font-black text-white">Tarefex</h1>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">Criar nova conta</h2>
            <p className="text-gray-400 text-sm">Preencha os dados abaixo para o seu cadastro corporativo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="Seu nome" required
                  />
                </div>
              </div>

              {/* Sobrenome */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sobrenome</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input
                    type="text" name="lastname" value={formData.lastname} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="Seu sobrenome" required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Profissional</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </span>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="email@empresa.com" required
                  />
                </div>
              </div>

              {/* Nascimento */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nascimento</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </span>
                  <input
                    type="date" name="birth" value={formData.birth} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all appearance-none"
                    required
                  />
                </div>
              </div>

              {/* Razao Social */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Razão Social</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18" /><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7" /><path d="M19 21V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14" /></svg>
                  </span>
                  <input
                    type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="Nome da Empresa" required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-green-500 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </span>
                  <input
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                    placeholder="••••••••••••" required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all transform active:scale-[0.98] mt-4"
            >
              FINALIZAR CADASTRO
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já possui uma conta?
            <button type="button" onClick={onGoLogin} className="text-green-500 hover:text-green-400 font-bold ml-1 transition-colors">
              Fazer login agora
            </button>
          </p>

          <div className="relative flex py-8 items-center">
            <div className="grow border-t border-white/5"></div>
            <span className="shrink mx-4 text-[10px] font-bold text-gray-600 tracking-widest uppercase">Redes Sociais</span>
            <div className="grow border-t border-white/5"></div>
          </div>

          <div className="flex justify-center gap-4">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
