// Footer.js
import './Footer.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons'; // Importa los iconos de redes sociales
import logoNegro from '../../assets/images/header/logo_fondotransparente.png'; // Ruta al logo

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="contain">
          <div className="col">
            <h1>Company</h1>
            <ul>
              <li>About</li>
              <li>Webmail</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>
          <div className="col">
            <h1>Products</h1>
            <ul>
              <li>About</li>
              <li>Webmail</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>
          <div className="col">
            <h1>Accounts</h1>
            <ul>
              <li>About</li>
              <li>Webmail</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>
          <div className="col">
            <h1>Resources</h1>
            <ul>
              <li>About</li>
              <li>Webmail</li>
              <li>Services</li>
              <li>Social</li>
              <li>Get in touch</li>
            </ul>
          </div>
          <div className="col">
            <h1>Support</h1>
            <ul>
              <li>Contact us</li>
              <li>Web chat</li>
              <li>Webmail</li>
            </ul>
          </div>
          <div className="col social">
            <h1>Social</h1>
            <div className="iconos-redes">
              <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#"><FontAwesomeIcon icon={faWhatsapp} /></a>
              <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="footer-left">
          <span>¿QUERES SABER MÁS?</span>
          <NavLink className="btn-style4" to="#">REGÍSTRATE</NavLink>
          <NavLink className="btn-style5" to="#">INGRESA</NavLink>
        </div>
        <div className="final">
          <span>© Valentino Ricci S.r.l. P.IVA IT04586091261</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
