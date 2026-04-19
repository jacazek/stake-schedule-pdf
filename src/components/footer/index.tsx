import { Link } from 'react-router-dom';
import "./footer.css";

export const Footer = () => {
    return (
        <nav>
            <Link className='footer-link' to="/">Home</Link>
            <Link className='footer-link' to="/speaker-schedule">Speaker Schedule</Link>
            <Link className='footer-link' to="/unit-schedule">Unit Schedule</Link>
        </nav>
    );
}
