import React, { useState, useEffect, useRef } from 'react';
import './AccessibilityBtn.css';

// --- Constante de Chave de Armazenamento ---
const STORAGE_KEY = 'accessibility_settings_v2';

// --- Funções de Persistência ---
const loadSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let settings = stored ? JSON.parse(stored) : {};
        
        // 🎯 Definir todos os valores padrão (fallback)
        settings.fontScale = settings.fontScale || 1; // 1 = Tamanho Normal
        settings.darkMode = settings.darkMode || false;
        settings.highContrast = settings.highContrast || false;
        settings.visualFocus = settings.visualFocus || false;
        
        return settings;
    } catch (e) {
        console.error("Erro ao carregar configurações de acessibilidade:", e);
        return { 
            fontScale: 1, 
            darkMode: false, 
            highContrast: false, 
            visualFocus: false
        };
    }
};

const saveSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Erro ao salvar configurações de acessibilidade:", e);
    }
};

function AccessibilityBtn() {
    const [settings, setSettings] = useState(() => loadSettings());
    const [isOpen, setIsOpen] = useState(false);
    // 🎯 CORREÇÃO FOCO VISUAL: Cria uma referência para o botão principal
    const mainButtonRef = useRef(null);

    // 1. Efeito para aplicar as classes ao body e estilos
    useEffect(() => {
        // Aplica classes CSS
        document.body.classList.toggle('dark-mode', settings.darkMode);
        document.body.classList.toggle('high-contrast-mode', settings.highContrast);
        document.body.classList.toggle('visual-focus-mode', settings.visualFocus);
        
        // Aplica a classe se o fator for 1.2
        document.body.classList.toggle('font-large-mode', settings.fontScale === 1.2);
        
        

        // Salva as configurações para persistência
        saveSettings(settings);
    }, [settings]);

    // 🎯 CORREÇÃO FOCO VISUAL: Função para alternar o menu e focar no botão
    const handleToggleMenu = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        
        // Quando o menu é fechado, o foco é removido do botão clicado, o que pode "travar"
        // o outline se o modo visual-focus-mode estiver ativo. 
        // Forçamos o foco de volta no botão principal após um pequeno delay.
        if (newState === false && mainButtonRef.current) {
            // Necessário um pequeno delay para que o navegador processe a remoção do menu.
            setTimeout(() => {
                mainButtonRef.current.focus();
            }, 0); 
        }
    };

    // 2. Função genérica de toggle para modos binários
    const toggleSetting = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    
    // 3. Função para alternar o tamanho da fonte (Normal <-> Maior)
    const toggleFont = () => {
        const currentScale = settings.fontScale || 1;
        const newScale = currentScale === 1.2 ? 1 : 1.2; 
        
        setSettings(prev => ({
            ...prev,
            fontScale: newScale
        }));
    };

    // 4. Reinicia todas as configurações
    const resetSettings = () => {
        localStorage.removeItem(STORAGE_KEY);
        
        // Remove todas as classes aplicadas ao body
        document.body.classList.remove('dark-mode', 'high-contrast-mode', 'visual-focus-mode', 'font-large-mode');
        document.body.style.fontSize = ''; 
        
        // Força o estado a retornar ao padrão limpo e desativado
        setSettings({ 
            fontScale: 1,
            darkMode: false,
            highContrast: false,
            visualFocus: false
        });
        setIsOpen(false);
    }

    // Determina o texto do botão de fonte
    const isFontLarge = settings.fontScale === 1.2;
    const fontButtonText = isFontLarge ? '➖ Fonte Normal' : '➕ Fonte Maior';

    return (
        <>
            {/* Botão Principal Flutuante */}
            <button 
                className={`accessibility-main-btn ${isOpen ? 'btn-active' : ''}`}
                // 🎯 CORREÇÃO FOCO VISUAL: Usa a nova função
                onClick={handleToggleMenu}
                title="Configurações de Acessibilidade"
                aria-expanded={isOpen}
                ref={mainButtonRef} // 🎯 CORREÇÃO FOCO VISUAL: Adiciona a referência
            >
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>♿</span>
            </button>

            {/* Menu de Opções */}
            {isOpen && (
                <div className="accessibility-menu">
                    {/* Dark Mode */}
                    <button 
                        className={`menu-item ${settings.darkMode ? 'active' : ''}`}
                        onClick={() => toggleSetting('darkMode')}
                        title="Modo Escuro (Aplica cores escuras)"
                    >
                        🌙 Dark Mode
                    </button>
                    
                    {/* Alto Contraste */}
                    <button 
                        className={`menu-item ${settings.highContrast ? 'active' : ''}`}
                        onClick={() => toggleSetting('highContrast')}
                        title="Alto Contraste (Fundo preto, texto amarelo/branco)"
                    >
                        ⚫ Alto Contraste
                    </button>

                    {/* Tamanho da Fonte */}
                    <button 
                        className={`menu-item ${isFontLarge ? 'active' : ''}`}
                        onClick={toggleFont}
                        title={isFontLarge ? "Voltar ao tamanho normal da fonte" : "Aumentar fonte em 20%"}
                    >
                        {fontButtonText}
                    </button>
                    
                    {/* Resetar */}
                    <button 
                        className="menu-item menu-item-reset"
                        onClick={resetSettings}
                        title="Resetar todas as configurações de acessibilidade"
                    >
                        🔄 Resetar
                    </button>
                </div>
            )}
        </>
    );
}

export default AccessibilityBtn;