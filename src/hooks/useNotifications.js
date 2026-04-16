import { useState, useEffect, useCallback } from 'react';
import { listarAgendamentos } from '../services/api';

/**
 * Hook para monitorar chegada de pacientes em tempo real (Smart Polling)
 * @param {Object} usuario - Usuário logado
 */
export const useNotifications = (usuario) => {
  const [lastNotifiedId, setLastNotifiedId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Função para tocar o sino (som suave de notificação)
  const playSound = () => {
  try {
    // Garante que Audio está disponível no contexto (não funciona em Workers)
    if (typeof window === 'undefined' || typeof window.Audio === 'undefined') return;
    
    const audio = new window.Audio(
      'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
    );
    audio.volume = 0.5;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Bloqueado por política do navegador (sem interação prévia) — ignora silenciosamente
      });
    }
  } catch (e) {
    // Illegal constructor ou outro erro de ambiente — ignora silenciosamente
  }
};

  const checkNewPatients = useCallback(async () => {
    if (!usuario || (usuario.perfil !== 'profissional' && usuario.perfil !== 'admin')) return;

    try {
      const res = await listarAgendamentos({ 
        status: 'em_espera',
        data: new Date().toISOString().split('T')[0]
      });

      const pacientesEsperando = res.data;

      if (pacientesEsperando.length > 0) {
        const latest = pacientesEsperando[pacientesEsperando.length - 1];
        
        // Só notifica se for um novo ID ou se o médico logado for o destinatário
        if (latest.id !== lastNotifiedId) {
          if (usuario.perfil === 'admin' || latest.profissional_id === usuario.profissional_id) {
            setNotification({
              id: latest.id,
              msg: `📍 Paciente ${latest.cliente_nome} acabou de chegar!`,
              type: 'checkin'
            });
            setLastNotifiedId(latest.id);
            playSound();
          }
        }
      }
    } catch (err) {
      console.error('Erro no polling de notificações:', err);
    }
  }, [usuario, lastNotifiedId]);

  useEffect(() => {
    // Inicia polling a cada 30 segundos
    const interval = setInterval(checkNewPatients, 30000);
    checkNewPatients(); // Chamada inicial

    return () => clearInterval(interval);
  }, [checkNewPatients]);

  const clearNotification = () => setNotification(null);

  return { notification, clearNotification };
};
