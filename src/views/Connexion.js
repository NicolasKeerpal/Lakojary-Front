import React from 'react';
import { login } from '../services/LoginService';
import { Link } from 'react-router-dom';

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      password: '',
      role: 'client'
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async submit(event) {
    event.preventDefault();
    const { mail, password, role } = this.state;

    try {
      const response = await login(mail, password, role);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        this.props.navigate('/');
        window.location.reload();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Une erreur est survenue");
    }
  }

  render() {
    return (
      <div>
        <h1>Connexion</h1>
        <form onSubmit={this.submit}>
          <label>
            Mail:
            <input
              type="email"
              name="mail"
              value={this.state.mail}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Mot de passe:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </label>
          <br />
          <label>
            Rôle:
            <select
              name="role"
              value={this.state.role}
              onChange={this.handleChange}
            >
              <option value="client">Client</option>
              <option value="employé">Employé</option>
            </select>
          </label>
          <br />
          <button type="submit">Connexion</button>
          <p>Vous n'avez pas de compte ? <Link to="/inscription">Créer un compte</Link></p>
        </form>
      </div>
    );
  }
}

export default Connexion;
