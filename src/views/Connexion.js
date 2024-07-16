import React from 'react';
import { login } from '../services/LoginService';
import { Link } from 'react-router-dom';

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      password: '',
      role: 'client',
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
      <div className="bg-custom-primary_color flex items-center justify-center mt-[3rem] mb-[3rem]">
        <div className="bg-custom-secondary_color rounded-lg p-6 w-[30rem]">
          <h1 className="text-[2rem] font-bold pt-[2rem] pb-[1rem] text-white text-center">Connexion</h1>

          <form onSubmit={this.submit} className="max-w-sm mx-auto">
            <div className="mb-4">
              <label htmlFor="mail" className="block mb-1 text-white text-left">Mail (*):</label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={this.state.mail}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 text-white text-left">Mot de passe (*):</label>
              <input
                type="password"
                id="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block mb-1 text-white text-left">Rôle:</label>
              <select
                name="role"
                value={this.state.role}
                onChange={this.handleChange}
                className="w-full px-3 py-2 bg-white text-black rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="client">Client</option>
                <option value="employé">Employé</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-custom-primary_color hover:bg-custom-hover_effect text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
              Connexion
            </button>
          </form>

          <p className="mt-4 text-white">
            Vous n'avez pas de compte ? <Link to="/inscription" className="text-custom-hover_effect hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Connexion;
