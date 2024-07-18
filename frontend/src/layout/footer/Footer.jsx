import './Footer.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons'; // Importa los iconos de redes sociales
import logoNegro from '../../assets/images/header/logo_fondotransparente.png';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-columns">
        <div className="column footer-logo">
          <NavLink to="/">
            <img src={logoNegro} alt="Logo Footer" />
          </NavLink>
        </div>
        <div className="redes-sociales">
          <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#"><FontAwesomeIcon icon={faWhatsapp} /></a>
          <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
          <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
        </div>
      </div>
      <div className="copyright">
        <p>© Valentino Ricci S.r.l. P.IVA IT04586091261</p>
      </div>
    </footer>
  );
}

export default Footer;
