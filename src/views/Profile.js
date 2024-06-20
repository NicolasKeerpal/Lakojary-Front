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
      const { firstname, lastname, mail, role } = this.state;

      return (
        <div class="flex items-center justify-center mt-[3rem] mb-[3rem]">
            <div class="bg-[#533619] rounded-lg p-6 w-[30rem]">
              <h1>Profil</h1>
              <div class="bg-custom-blue rounded-lg p-4 mb-4">
                <h1 class="text-2xl text-white">{firstname} {lastname}</h1>
                <p class="text-white">{role}</p>
                <div class="mt-4">
                    <div class="flex space-x-4">
                        <div class="flex-1">
                            <p class="text-white font-semibold">First Name</p>
                            <div class="border-4 border-red bg-transparent text-white p-2 rounded">
                                <p>{firstname}</p>
                            </div>
                        </div>
                        <div class="flex-1">
                            <p class="text-white font-semibold">Last Name</p>
                            <div class="border-4 border-red bg-transparent text-white p-2 rounded">
                                <p>{lastname}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex space-x-4 mt-4">
                        <div class="flex-1">
                            <p class="text-white font-semibold">Mail</p>
                            <div class="border-4 border-red bg-transparent text-white p-2 rounded">
                                <p>{mail}</p>
                            </div>
                        </div>
                    </div>

              <button onClick={this.logout}>Déconnexion</button>
            </div>        
          </div>
          </div>
          </div>
      );
    }
}

export default Profile;