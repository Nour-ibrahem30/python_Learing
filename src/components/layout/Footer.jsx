import { motion } from 'framer-motion';
import './Footer.css';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <a className="brand" href="#">
        <span className="mark">Py<span>؛</span></span>
        <span>بايثون <b>مع نوار</b></span>
      </a>
      <p>فيديوهات شرح بايثون مع نوار.</p>
      <small className="made-by">Made by <b>Nour Ibrahim</b></small>
      <a href="#">لفوق ↑</a>
    </motion.footer>
  );
}
