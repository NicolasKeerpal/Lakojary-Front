import React from 'react';
import { getCustomer } from '../services/CustomerService';
import { getEmployee } from '../services/EmployeeService';
import { jwtDecode } from 'jwt-decode';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          firstname: '',
          lastname: '',
          mail: '',
          role: null
        };
        this.logout = this.logout.bind(this);
      }

    async componentDidMount() {
      const token = localStorage.getItem('token');
      let decoded;
      if (token) {
        try {
          decoded = jwtDecode(token);
          this.setState({ role: decoded.role });
        } catch (error) {
          alert("Une erreur est survenue");
          this.props.navigate('/home');
        }
      }
  
      try {
          let userData, firstname, lastname, mail;
          if (decoded.role=='client') {
            userData = await getCustomer(decoded.id);
            firstname = userData.data.customerId.firstname;
            lastname = userData.data.customerId.lastname;
            mail = userData.data.customerId.mail;
          } else {
            userData = await getEmployee(decoded.id);
            firstname = userData.data.employeeId.firstname;
            lastname = userData.data.employeeId.lastname;
            mail = userData.data.employeeId.mail;
          }
          
          if (userData.success) {
              this.setState({ 
                  firstname,
                  lastname,
                  mail
              });
          }
      } catch(error) {
          alert("Une erreur est survenue");
          this.props.navigate('/home');
      }
    }

    logout = () => {
      localStorage.removeItem('token');
      this.props.navigate('/connexion');
      window.location.reload();
    }
  
    render() {
      console.log(this.state);
      return (
        <div>
          <h1>Profil</h1>
          <button onClick={this.logout}>Déconnexion</button>
        </div>
      );
    }
}

export default Profile;