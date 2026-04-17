import React, { useState } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import '../styles/Contato.css';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      await axios.post(`${API_URL}/contato`, formData);
      
      setStatus({ 
        type: 'success', 
        message: 'Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.' 
      });
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setStatus({ 
        type: 'error', 
        message: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contato-page fade-in">
      <header className="contato-header">
        <div className="header-container">
          <span className="badge">Fale Conosco</span>
          <h1>Estamos aqui para <span>ouvir você.</span></h1>
          <p>Dúvidas, sugestões ou feedbacks? Nossa equipe está pronta para te atender.</p>
        </div>
      </header>

      <div className="contato-content">
        <div className="contato-grid">
          {/* Contact Info Cards */}
          <div className="contato-info">
            <div className="info-card">
              <div className="info-icon"><Phone size={24} /></div>
              <div className="info-text">
                <h4>Telefone</h4>
                <p>(11) 4004-0000</p>
                <p>(11) 99999-9999</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><Mail size={24} /></div>
              <div className="info-text">
                <h4>E-mail</h4>
                <p>contato@clinicavita.com.br</p>
                <p>suporte@vitalpro.com.br</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"><MapPin size={24} /></div>
              <div className="info-text">
                <h4>Localização</h4>
                <p>Av. Paulista, 1000 - 10º andar</p>
                <p>Bela Vista, São Paulo - SP</p>
              </div>
            </div>

            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="whatsapp-float-btn">
              <MessageCircle /> <span>Conversar via WhatsApp</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="contato-form-container">
            <form onSubmit={handleSubmit} className="contato-form">
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome" 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Assunto</label>
                  <select name="assunto" value={formData.assunto} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    <option value="Dúvida">Dúvida</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Sugestão">Sugestão</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Mensagem</label>
                <textarea 
                  name="mensagem" 
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Como podemos ajudar?" 
                  rows="5" 
                  required
                ></textarea>
              </div>

              {status.message && (
                <div className={`form-feedback ${status.type}`}>
                  {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {status.message}
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Enviando...' : (
                  <>
                    Enviar Mensagem <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <section className="map-section">
          <h3>Nossa Localização</h3>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.650!3d-23.563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da17e3f3%3A0xc095460a5d2a6a68!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '20px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Clínica Vita"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contato;
