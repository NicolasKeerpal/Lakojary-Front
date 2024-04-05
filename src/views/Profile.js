import React from 'react';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
      }

    logout = () => {
      localStorage.removeItem('token');
      this.props.navigate('/connexion');
      window.location.reload();
    }
  
    render() {
      return (
        <div>
          <h1>Profil</h1>
          <button onClick={this.logout}>Déconnexion</button>
        </div>
      );
    }
}

export default Profile;