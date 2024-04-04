import React from 'react';

class Connexion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      role: 'client'
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  login(event) {
    event.preventDefault();
    const { email, password, role } = this.state;
    console.log("Email:", email);
    console.log("Mot de passe:", password);
    console.log("Rôle:", role);
  }

  render() {
    return (
      <div>
        <h1>Connexion</h1>
        <form onSubmit={this.login}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
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
        </form>
      </div>
    );
  }
}

export default Connexion;
