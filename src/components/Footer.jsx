import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Users,
  Clock
} from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-global">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">⚕️</span>
              <span className="logo-text">Clínica Vita</span>
            </div>
            <p className="brand-desc">
              Excelência em medicina humanizada. Unindo tecnologia de ponta ao cuidado genuíno para oferecer a melhor experiência em saúde em um único lugar.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Globe size={20} /></a>
              <a href="#" className="social-icon"><MessageSquare size={20} /></a>
              <a href="#" className="social-icon"><Users size={20} /></a>
            </div>
          </div>

          {/* Rapid links */}
          <div className="footer-links">
            <h4>Acesso Rápido</h4>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/especialidades">Especialidades</Link></li>
              <li><Link to="/noticias">Notícias de Saúde</Link></li>
              <li><Link to="/novidades">Novidades Clínica</Link></li>
              <li><Link to="/contato">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Specialties preview */}
          <div className="footer-links">
            <h4>Serviços</h4>
            <ul>
              <li><Link to="/especialidades">Clínica Geral</Link></li>
              <li><Link to="/especialidades">Psiquiatria</Link></li>
              <li><Link to="/especialidades">Cardiologia</Link></li>
              <li><Link to="/especialidades">Pediatria</Link></li>
              <li><Link to="/agendar">Agendar Consulta</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="footer-contact">
            <h4>Contato</h4>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>(11) 4004-0000 / (11) 99999-9999</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>contato@clinicavita.com.br</span>
            </div>
            <div className="contact-item">
              <Clock size={18} />
              <span>Seg - Sex: 08h às 20h | Sáb: 08h às 13h</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Portal VitaHub. Todos os direitos reservados.</p>
          <div className="made-with">
            Feito com <Heart size={14} className="heart-icon" /> para você
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
