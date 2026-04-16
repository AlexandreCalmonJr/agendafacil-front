// src/hooks/useNotifications.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { listarAgendamentos } from '../services/api';

export const useNotifications = (usuario) => {
  const [lastNotifiedId, setLastNotifiedId] = useState(null);
  const [notification, setNotification] = useState(null);
  const audioCtxRef = useRef(null);

  const playSound = useCallback(() => {
    try {
      // Só tenta se o browser suporta
      const AC = window.AudioContext ?? window.webkitAudioContext;
      if (!AC) return;

      // Reutiliza o contexto ou cria um novo
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AC();
      }

      const ctx = audioCtxRef.current;

      // Resume caso esteja suspenso (política de autoplay)
      const resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();

      resume.then(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      }).catch(() => {});
    } catch (_) {}
  }, []);

  const checkNewPatients = useCallback(async () => {
    if (!usuario || !['profissional', 'admin'].includes(usuario.perfil)) return;

    try {
      const res = await listarAgendamentos({
        status: 'em_espera',
        data: new Date().toISOString().split('T')[0]
      });

      const pacientes = res.data;
      if (pacientes.length === 0) return;

      const latest = pacientes[pacientes.length - 1];

      if (latest.id !== lastNotifiedId) {
        const ehMeu = usuario.perfil === 'admin' || 
                      latest.profissional_id === usuario.profissional_id;
        
        if (ehMeu) {
          setNotification({
            id: latest.id,
            msg: `📍 Paciente ${latest.cliente_nome} acabou de chegar!`,
            type: 'checkin'
          });
          setLastNotifiedId(latest.id);
          playSound(); // só toca quando há evento real
        }
      }
    } catch (_) {}
  }, [usuario, lastNotifiedId, playSound]);

  useEffect(() => {
    const interval = setInterval(checkNewPatients, 30000);
    checkNewPatients();
    return () => {
      clearInterval(interval);
      // Fecha o contexto ao desmontar para liberar recursos
      audioCtxRef.current?.close().catch(() => {});
    };
  }, [checkNewPatients]);

  const clearNotification = useCallback(() => setNotification(null), []);

  return { notification, clearNotification };
};